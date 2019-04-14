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
    Fab,
    Modal,
    ListItemSecondaryAction
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import classNames from 'classnames';
import { green } from '@material-ui/core/colors';
import * as firebase from 'firebase';
import firebaseApp, { firestore } from '../../services/firebase';
import IconFileType from '../icons/IconFileType';
import filesize from 'filesize';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
import FileForm from './components/FileForm';
import { FaFolderPlus } from 'react-icons/fa';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import NotiSnack, { NotiSkackPropTypes } from '../../services/notisnack';
import ContextualMenu from '../Popper/ContextualMenu';
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
    rename?(name: string): Promise<void>;
}

interface BrowserType {
    ownerUserId: string;
    viewerUserId: string;
    classes: any;
    onFileUpload?(
        event: React.ChangeEvent<HTMLInputElement>, 
        directory: DirectoryType,
        ownerId: string,
        uploaderId: string,
        onProgress: any): void;
    selected?: DirectoryType;
    onItemClick?(item: DirectoryType): void;
    onUploadProgress?(uploadTask: firebase.storage.UploadTask): void;
}
interface FormModal {
    open?: boolean;
    name?: string;
    value?: any;
    action?: any;
    buttonSubmitText?: string;
    buttonCancelText?: string;
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

const onFileUpload = (event, directory, ownerId, uploaderId, onProgress) => {
    const file = event.target.files[0]
    if(!file) {
        return
    }
    
    const storageRef = firebaseApp.storage().ref(directory.path + file.name)
    const customMetadata = {
        uploadType: 'user/directory',
        ownerId, 
        uploaderId,
        parent: directory.parent,
        name: file.name
    }
    const uploadTask = storageRef.put(file, { customMetadata })
    onProgress(uploadTask)
    

}

const BroserWrapper = (props: BrowserType) => {
    const {
        classes,
        viewerUserId,
        // onFileUpload,
        onUploadProgress,
        ownerUserId,
        onItemClick,
        selected
    } = props;
    const [formOpened, setFormOpened] = useState(false)
    const [form, setForm] = useState<FormModal>({})
    const [directories, setDirectories]  = useState<DirectoryType[]>([]);
    const [loading, setLoading] = useState(false);
    const getPath = createGetPath(ownerUserId);
    const initialDir = [{ 
        name: 'Root',
        parent: null,
        path: getPath({})
    }];
    const [history, setHistory] = useState(initialDir)
    
    useEffect(() => {
        setLoading(true);
        const directory = history[history.length - 1];
        console.log('useEffect')
        const directoriesQuery = directoriesRef
        .where('parent', '==', directory.parent)
        .where('userId', '==', ownerUserId);
        
        const directories$ = collection(directoriesQuery)
        .pipe(
            map((docs) => docs.map((doc) => {
                return {
                    ...doc.data(),
                    id: doc.id,
                    delete: () => {
                        return doc.ref.delete()
                    },
                    rename: (name: string) => {
                        let new_name = name;
                        if(doc.get('contentType') !== 'folder') {
                            const old_name = doc.get('name')
                            const name_split = old_name.split('.');
                            const ext = name_split[name_split.length - 1];
                            new_name = `${name}${ext ? '.' + ext : ''}`
                        }
                        
                        return doc.ref.update({name: new_name})
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
    }, [history.length])


    const handleClick = (item: DirectoryType) => {
        if(item.contentType !== 'folder') {
            return onItemClick(item);
        }

        const newDir = {
            name: item.name,
            parent: item.id,
        }

        setHistory([
            ...history,
            { ...newDir, path: getPath(newDir) }
        ]);

        setDirectories([]);
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
                onClose={() => {
                    setFormOpened(false)
                    setForm({})
                }}
                open={form.open || false}
            >
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                <FileForm 
                    title={form.name}
                    close={() => setForm({ ...form, open: false })}
                    selected={selected}
                    buttonSubmitText={form.buttonSubmitText}
                    buttonCancelText={form.buttonCancelText}
                    onSubmit={(values) => {
                        return form.action(values.name).then(() => {
                            setForm({})

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
                    <ListItem button key={key}>
                        <Avatar>
                            <IconFileType contentType={item.contentType || ''} />
                        </Avatar>
                        <ListItemText onClick={() => {
                                handleClick(item)
                            }} primary={item.name} secondary={
                            item.contentType === 'folder' ?
                            `${item.elements || '0'} elementos` :
                            `${filesize(+item.size)}`
                            } />
                        <ListItemSecondaryAction>
                            <ContextualMenu items={[
                                {
                                    name: 'Renombrar',
                                    action: () => {
                                        setForm({
                                            open: true,
                                            name: 'Renombrar',
                                            value: item.name,
                                            action: item.rename,
                                            buttonSubmitText: 'Renombrar'
                                        })
                                    }
                                }
                            ]}/>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <input
                // className={classes.input}
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={(event) => {
                    if(onFileUpload){
                        const directory = history[history.length - 1];
                        onFileUpload(event, directory, ownerUserId, viewerUserId, onUploadProgress)
                    }
                }}
                />
            <div className={classes.fabs}>
                <Fab onClick={() => setForm({
                    open: true,
                    name: 'Añadir Carpeta',
                    buttonSubmitText: 'Añadir',
                    action: (name) => {
                        return directoriesRef.add({
                            contentType: 'folder',
                            name,
                            parent: history[history.length - 1].parent,
                            userId: ownerUserId
                        })
                    }
                })} component="span" className={classNames(classes.fab, classes.fabGreen)} color={'primary'}>
                    <FaFolderPlus size="20" />
                </Fab>
                <label htmlFor="raised-button-file">
                    <Fab component="span" className={classNames(classes.fab, classes.fabGreen)} color={'primary'}>
                        <CloudUploadIcon />
                    </Fab>
                </label> 
            </div>
        </Fragment>
        
    )
}
const Browser = withStyles(styles)(BroserWrapper);
export default Browser;