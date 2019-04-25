import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const auth = admin.auth();
const db = admin.firestore();
const storage = admin.storage();

const { increment, serverTimestamp } = admin.firestore.FieldValue;

exports.registerUser = functions.auth.user().onCreate(async (user) => {
    try {
        const createUser = await db.doc(`users/${user.uid}`).set({
            uid: user.uid,
            email: user.email,
            name: user.displayName,
            photoURL: user.photoURL
        })
        return createUser;
    } catch (error) {
        console.log(error)
        return error
    }
});
exports.onFileDeleted = functions.firestore.document('directories/{directoryId}')
    .onDelete(async (snapshot, context) => {
        const { filePath, parent } = snapshot.data()!;
        const deleteFile = storage.bucket().file(filePath).delete()

        if (parent) {
            const parentRef = db.doc(`directories/${parent}`);
            // const parentSnapshot = await parentRef.get();
            // const parentData = parentSnapshot.data();
            const updateParent = parentRef.update({
                elements: increment(-1),
                updatedAt: serverTimestamp()
            })
            return Promise.all([updateParent, deleteFile])

        }
        return deleteFile;


    })

exports.fileUpload = functions.storage.object().onFinalize(async (object, context) => {
    try {
        console.log(object)
        if (object.metadata!.uploadType === 'user/directory') {
            const metadata = object.metadata!;
            const uploaderSnapshot = await db.doc(`users/${metadata.uploaderId}`).get();
            const uploader = uploaderSnapshot.data();
            const data = {
                userId: metadata.ownerId,
                parent: metadata.parent || null,
                contentType: object.contentType,
                size: object.size,
                name: metadata.name,
                filePath: object.name,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                uploader
            }


            const addFile = await db.collection(`directories`).add(data);
            if (data.parent) {
                const parentRef = db.doc(`directories/${data.parent}`);
                // const parentDoc = await parentRef.get();
                // const parentData = parentDoc.data();
                // const parentElements = parentData!.elements || 0;
                const updateParent = parentRef.update({
                    elements: increment(1),
                    updatedAt: serverTimestamp()

                })
                return Promise.all([addFile, updateParent])
            }

            return addFile;
        }
    } catch (error) {
        console.log(error)
        return error;
    }
});

async function grantAdmin(email: string): Promise<void> {
    const user = await auth.getUserByEmail(email);

    if (user.customClaims && (user.customClaims as any).admin === true) {
        return;
    }
    return auth.setCustomUserClaims(user.uid, {
        admin: true,
    });
}
exports.addAdmin = functions.https.onRequest(async (req, res) => {
    try {
        await grantAdmin('carrillocarlosce@gmail.com');
        await grantAdmin('claudio.vera@centros.cl');
        return res.sendStatus(200).send('Done!')
    } catch (error) {
        return res.sendStatus(500).send('Somenthing went wrong...')
    }

})
interface Workers {
    [key: string]: (options: any) => Promise<any>
}

// Business logic for named tasks. Function name should match worker field on task document. 
const workers: Workers = {
    helloWorld: () => db.collection('logs').add({ hello: 'world' }),
}
export const taskRunner = functions.runWith({ memory: '2GB' }).pubsub

    .schedule('* * * * *').onRun(async context => {

        // Consistent timestamp
        const now = admin.firestore.Timestamp.now();

        // Query all documents ready to perform
        const query = db.collection('tasks').where('performAt', '<=', now).where('status', '==', 'scheduled');

        const tasks = await query.get();


        // Jobs to execute concurrently. 
        const jobs: Promise<any>[] = [];

        // Loop over documents and push job.
        tasks.forEach(snapshot => {
            const { worker, options } = snapshot.data();

            const job = workers[worker](options)

                // Update doc with status on success or error
                .then(() => snapshot.ref.update({ status: 'complete' }))
                .catch((err) => snapshot.ref.update({ status: 'error' }));

            jobs.push(job);
        });

        // Execute all jobs concurrently
        return await Promise.all(jobs);
    });

