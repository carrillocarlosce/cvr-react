import React, { useEffect, useState, Fragment } from 'react';
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
    ListItemSecondaryAction,
    Button
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import classNames from 'classnames';
import { green } from '@material-ui/core/colors';
import firebaseApp, { firestore } from '../../services/firebase';
import IconFileType from '../icons/IconFileType';
import filesize from 'filesize';
import { collection } from 'rxfire/firestore';
import { map } from 'rxjs/operators';
import FileForm from './components/FileForm';
import { FaFolderPlus } from 'react-icons/fa';
import ContextualMenu from '../Popper/ContextualMenu';
import { BrowserItemType, BrowserType } from 'cvr-shared/interfaces/browser';
import { ContextualMenuOption } from 'cvr-shared/interfaces';

interface FormModal {
    open?: boolean;
    name?: string;
    value?: any;
    action?: any;
    label?: string;
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
    breadcrumbButton: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.grey[100],
        boxShadow: 'none',
        borderRadius: 0,
        '&:hover': {
          backgroundColor: theme.palette.grey[300],
        },
    },
    breadcrumbButtonDsabled: {
        color: theme.palette.text.disabled,        
    }
});
const directoriesRef = firestore.collection('directories');

const createGetPath = (userId: string) => {
    return (directory: BrowserItemType) => {
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

const BrowserWrapper = (props: BrowserType) => {
    const {
        classes,
        viewerUserId,
        // onFileUpload,
        onUploadProgress,
        ownerUserId,
        onItemClick,
        selected
    } = props;
    const [form, setForm] = useState<FormModal>({})
    const [directories, setDirectories]  = useState<BrowserItemType[]>([]);
    const [loading, setLoading] = useState(false);
    const getPath = createGetPath(ownerUserId);
    const initialDir = [{ 
        name: 'Root',
        parent: null,
        path: getPath({})
    }];
    const [history, setHistory] = useState(initialDir)
    
    useEffect(() => {
        console.log(history)
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


    const handleClick = (item: BrowserItemType) => {
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
    const getContextualOptions = (item: BrowserItemType): ContextualMenuOption[] => {
        const options: ContextualMenuOption[] = [
            {
                name: 'Renombrar',
                action: () => {
                    setForm({
                        open: true,
                        label: 'Nuevo nombre',
                        name: 'Renombrar',
                        value: item.name,
                        action: item.rename,
                        buttonSubmitText: 'Renombrar'
                    })
                }
            },
        ];
        if (item.contentType !== 'folder') {
            options.push({
                name: 'Eliminar',
                action: item.delete
            })
        }
        return options;
    }
    return (
        <Fragment>
            <Modal 
                onClose={() => {
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
                    formLabel={form.label}
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
            <div>
                {history.map((item, index) => {
                    return (
                        <Button
                            key={index}
                            onClick={() => {
                                setHistory(history.slice(0, index + 1))
                            }}
                            variant="contained"
                            color="primary"
                            className={classNames(classes.margin, classes.breadcrumbButton)}
                            disabled={history.length === index+1}
                        >
                            {index === 0 ? (<HomeIcon />) : item.name}
                        </Button>
                    )
                })}
            </div>
            <List className={classes.root}>
                {/* <ListItem button disabled={history.length === 1} onClick={goBack}>
                    {history.length > 1 ? <ArrowBackIcon  /> : <HomeIcon /> }
                    <ListItemText inset primary={history.length > 1 ? 'VOLVER' : 'PRINCIPAL'} />
                </ListItem> */}
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
                            <ContextualMenu items={getContextualOptions(item)}/>
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
                    label: 'Nombre de la carpeta',
                    name: 'Añadir Carpeta',
                    buttonSubmitText: 'Añadir',
                    action: (name: string) => {
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
const Browser = withStyles(styles)(BrowserWrapper);
export default Browser;