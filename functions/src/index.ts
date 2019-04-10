import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const storage = admin.storage();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const { increment, serverTimestamp } = admin.firestore.FieldValue
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
        const {filePath, parent} = snapshot.data()!;
        const deleteFile = storage.bucket().file(filePath).delete()

        if(parent) {
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
        if(object.metadata!.uploadType === 'user/directory') {
            const metadata = object.metadata!;
            const uploaderSnapshot = await db.doc(`users/${metadata.userId}`).get();
            const uploader = uploaderSnapshot.data();
            const data = {
                userId: metadata.userId,
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
            if(data.parent) {
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

// exports.download = functions.https.onRequest((req, res) => {
//     return res.send('Hello World')

// })