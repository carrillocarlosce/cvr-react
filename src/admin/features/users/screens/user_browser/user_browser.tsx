import React, { useState, useEffect, Fragment } from 'react';
import { Theme, createStyles, withStyles, Modal } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import Browser from '../../../../../components/browser/browser';
import DetailsView from '../../../../../components/browser/components/DetailsView';
import NotiSnack, { NotiSkackPropTypes } from '../../../../../services/notisnack';
import { firebase } from '../../../../../services/firebase';

// import Browser from '../../../../components/browser/browser';
// import DetailsView from '../../../../components/browser/components/DetailsView';
// import NotiSnack, { NotiSkackPropTypes } from '../../../../services/notisnack';

const styles = (theme: Theme) => createStyles({
    root: {
        width: '100%',
        padding: 0,
        // maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
        position: 'relative'
    },

    progress: {
        // position: 'absolute',
        // width: '100%',
        // zIndex: 1,
    },

});
interface PropTypes extends RouteComponentProps {
    classes: any;
    user: any
}
const UserBrowserWrapper = (props: PropTypes) => {
    const { classes, location, match, user } = props;
    const [selected, setSelected] = useState(null);
    useEffect(() => {
        console.log(props)
    }, [])
    const [snack, setSnack] = useState<NotiSkackPropTypes>({
        autoHideDuration: null,
        open: false,
        onClose: () => null,
        message: '',
        variant: 'info'
    });

    return (
        <Fragment>
            <Browser
                ownerUserId={(match.params as any).uid}
                viewerUserId={user.uid}
                onItemClick={(item) => setSelected(item)}
                selected={selected}
                onUploadProgress={(uploadTask) => {
                    uploadTask.on('state_changed', function (snapshot: any) {
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
                    }, function (error) {
                        // Handle unsuccessful uploads
                    }, function () {
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
                }}
            />
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
                    <DetailsView close={() => setSelected(false)} selected={selected} />
                </div>
            </Modal>
            <NotiSnack
                autoHideDuration={snack.autoHideDuration}
                open={snack.open}
                onClose={() => setSnack({ ...snack, open: false })}
                variant={snack.variant}
                message={snack.message}
            />
        </Fragment>
    )
}

const UserBrowser = withStyles(styles)(UserBrowserWrapper);
export default UserBrowser;