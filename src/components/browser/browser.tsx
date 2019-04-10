import React, { useEffect, useState, Fragment, SyntheticEvent } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    LinearProgress,
    Avatar,
    withStyles,
    Theme,
    createStyles,
    Typography,
    Fab,
    Modal
} from '@material-ui/core';
import firebase from 'firebase';
import HomeIcon from '@material-ui/icons/Home';
import FolderIcon from '@material-ui/icons/Folder';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import classNames from 'classnames';
import { green } from '@material-ui/core/colors';
import firebaseApp, { firestore } from '../../services/firebase';
import IconFileType from '../icons/IconFileType';
import { saveAs } from 'file-saver';
import filesize from 'filesize';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
import DetailsView from './components/DetailsView';
import FileForm from './components/FileForm';
import { FaFolderPlus } from 'react-icons/fa';
import NotiSnack, { NotiSkackPropTypes } from '../../services/notisnack';
interface DirectoryType {
    id?: string;
    parent?: string | null;
    elements?: number;
    name?: string;
    path?: string;
    contentType?: string;
    filePath?: string;
    size?: string;
    userId?: string;
    delete?(): Promise<void>;
}

interface BrowserType {
    userId: string;
    classes: any
}
const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        padding: 0,
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative'
    },
    progress: {},
    fabGreen: {
        color: theme.palette.common.white,
        backgroundColor: green[500],
        '&:hover': {
          backgroundColor: green[600],
        },
    },
    fabs: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: 0
    },
    fab: {
        marginRight: theme.spacing.unit * 2,
    },
});
const directoriesRef = firestore.collection('directories');

const createGetPath = (userId: string) => {
    return (directory: DirectoryType) => {
        const root = `user_directories/${userId}/`;
        const path = directory.parent ? directory.parent + '/' : '';
        return root + path;
        
    }
}

const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, history, userId, snacks) => {
    const file = event.target.files[0]
    if(!file) {
        return
    }
    const directory = history[history.length - 1];
    const storageRef = firebaseApp.storage().ref(directory.path + file.name)
    const customMetadata = {
        uploadType: 'user/directory',
        userId,
        parent: directory.parent,
        name: file.name
    }
    console.log(customMetadata)
    const uploadTask = storageRef.put(file, { customMetadata })
    const [snack, setSnack] = snacks;

    uploadTask.on('state_changed', function(snapshot: any){
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        setSnack({
            ...snack,
            autoHideDuration: null,
            message: progress.toFixed(2) + '% completado!',
            open: true,
            variant: 'info'
        })
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      }, function(error) {
        // Handle unsuccessful uploads
      }, function() {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        // uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        //   console.log('File available at', downloadURL);
        // });
        setSnack({
            ...snack,
            message: 'Subida de archivo completada!',
            open: true,
            autoHideDuration: 6000,
            variant: 'success'
        })
      });
}

const BroserWrapper = (props: BrowserType) => {
    const { classes, userId } = props;
    const [selected, setSelected] = useState(null)
    const [formOpened, setFormOpened] = useState(false)
    const [directories, setDirectories]  = useState<DirectoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const getPath = createGetPath(userId);
    const initialDir = [{ 
        name: 'Root',
        parent: null,
        path: getPath({})
    }];
    const [history, setHistory] = useState(initialDir)
    const [snack, setSnack] = useState<NotiSkackPropTypes>({
        autoHideDuration: null,
        open: false,
        onClose: () => null,
        message: '',
        variant: 'info'
    });
    useEffect(() => {
        setLoading(true);
        const directory = history[history.length - 1];
        console.log('useEffect')
        const directoriesQuery = directoriesRef
        .where('parent', '==', directory.parent)
        .where('userId', '==', userId);
        
        const directories$ = collection(directoriesQuery)
        .pipe(
            map((docs) => docs.map((doc) => {
                
                return {
                    ...doc.data(),
                    id: doc.id,
                    delete: () => {
                        return doc.ref.delete()
                    }
                }
            }))
        ).subscribe((docs) => {
            console.log('CHANGE')
            setDirectories(docs);
            setLoading(false)
        })
        
        return () => {
            console.log('unsubscribe')
            return directories$.unsubscribe()
        }
    },[history.length])

    const handleFileClick = async (item: DirectoryType) => {
        try {
            // const fileURL = await firebaseApp.storage()
            //     .ref(item.filePath)
            //     .getDownloadURL();

            //     saveAs(fileURL, "image.jpg")
            setSelected(item)
        } catch (error) {
            console.log(error)
        }
    }

    const handleClick = (item: DirectoryType) => {
        if(item.contentType !== 'folder') {
            return handleFileClick(item);
        }
        // browser.history.push()
        const newDir = {
            name: item.name,
            parent: item.id,
        }
        setHistory([
            ...history,
            {
                ...newDir,
                path: getPath(newDir)
            }
        ]);

        setDirectories([]);
        // history.push(`${location.pathname}?d=${directoryId}`)
    }
    const goBack = () => {
        if(history.length > 1){
            history.pop();
            setHistory(history)
            setDirectories([])
        }
    }
    return (
        <Fragment>
            <Modal 
                onClose={() => setSelected(false)}
                open={!!selected}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                <DetailsView close={() => setSelected(false)} selected={selected}/>
                </div>
            </Modal>
            <Modal 
                onClose={() => setFormOpened(false)}
                open={formOpened}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                <FileForm 
                    title="Nueva Carpeta"
                    close={() => setFormOpened(false)}
                    selected={selected}
                    onSubmit={(values) => {
                        return directoriesRef.add({
                            contentType: 'folder',
                            name: values.name,
                            parent: history[history.length - 1].parent,
                            userId
                        })
                    }}
                    />
                </div>
            </Modal>
            <List className={classes.root}>
                <ListItem button disabled={history.length === 1} onClick={goBack}>
                    {history.length > 1 ? <ArrowBackIcon  /> : <HomeIcon /> }
                    <ListItemText inset primary={history.length > 1 ? 'VOLVER' : 'PRINCIPAL'} />
                </ListItem>
                {loading && <LinearProgress className={classes.progress} color="primary" />}
                {(!loading && !directories.length) &&  (
                    <ListItem disabled>
                        <ListItemText primary={'Directorio vacio!'} />
                    </ListItem>
                )}
                {directories.map((item, key) => (
                    <ListItem button onClick={() => {
                        handleClick(item)
                    }} key={key}>
                        <Avatar>
                            <IconFileType contentType={item.contentType || ''} />
                        </Avatar>
                        <ListItemText primary={item.name} secondary={
                            item.contentType === 'folder' ?
                            `${item.elements || '0'} elementos` :
                            `${filesize(+item.size)}`
                            } />
                    </ListItem>
                ))}
            </List>
            <input
                // className={classes.input}
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={(e) => handleFileChange(e, history, userId, [snack, setSnack])}
                />
            <div className={classes.fabs}>
                <Fab onClick={() => setFormOpened(true)} component="span" className={classNames(classes.fab, classes.fabGreen)} color={'primary'}>
                    <FaFolderPlus size="20" />
                </Fab>
                <label htmlFor="raised-button-file">
                    <Fab component="span" className={classNames(classes.fab, classes.fabGreen)} color={'primary'}>
                        <CloudUploadIcon />
                    </Fab>
                </label> 
            </div>
            <NotiSnack
                autoHideDuration={snack.autoHideDuration}
                open={snack.open}
                onClose={() => setSnack({...snack, open: false})}
                variant={snack.variant}
                message={snack.message}
            />
        </Fragment>
        
    )
}
const Browser = withStyles(styles)(BroserWrapper);
export default Browser;