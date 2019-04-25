import React, { useState, useEffect, Fragment } from 'react';
import { Theme, createStyles, withStyles, Modal } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';
import { withFormik, FormikProps } from "formik";
import * as Yup from "yup";
import ServiceForm from './components/service_form/service_form';


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
const UserServicesWrapper = (props: PropTypes) => {

    return (
        <Fragment>
            <ServiceForm />
        </Fragment>
    )
}

const UserServices = withStyles(styles)(UserServicesWrapper);
export default UserServices;