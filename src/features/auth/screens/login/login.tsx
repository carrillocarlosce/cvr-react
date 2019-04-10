import React, { useState, useEffect, Fragment } from 'react';
import styled from 'styled-components';
import firebase from 'firebase';
import firebaseApp from '../../../../services/firebase';
import { AccountConsumer, UserTypes, AccountTypes } from '../../../../providers/AccountProvider';
import FullLoading from '../../../../components/progress/FullLoading';
import { Paper, withStyles, createStyles, Typography, Theme, Button, Divider } from '@material-ui/core';
const styles = (theme: Theme) => createStyles({
    welcomeBox: {
        display: 'flex',
        height: '150px',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.dark
    },
    welcomeText: {
        color: 'white'
    },
    loginBox: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: theme.spacing.unit * 2,
        padding: theme.spacing.unit * 2,
    },
    signInText: {
        textAlign: 'center',
        // marginBottom: theme.spacing.unit * 2
    },
    googleButton: {
        backgroundColor: '#EA4335',
        marginTop: theme.spacing.unit * 2
    }
});
const  provider = new firebase.auth.GoogleAuthProvider();
const signIn = () => {
    
    firebaseApp.auth()
        .signInWithPopup(provider)
        .then(function(result) {
            console.log(result)
            
            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // // The signed-in user info.
            // var user = result.user;
            // ...
            console.log(result)
        }).catch(function(error) {
            console.log(error)

            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
}
// const signOut = (account: AccountTypes) => {
//     firebaseApp.auth().signOut()
//     .then(res => {
//         console.log(res)
//     })
//     .then(err => console.log(err))
// }
const LoginWrapper = ({match, history, classes}) => {

    return (
        <AccountConsumer>
            {(account) => (
                <Fragment>
                    <Paper 
                        square={true} 
                        elevation={0} 
                        className={classes.welcomeBox}>
                        <Typography 
                            variant="h3"
                            component="h3"
                            color="textPrimary"
                            className={classes.welcomeText}>
                            BIENVENIDO
                        </Typography>
                    </Paper>
                    <Paper className={classes.loginBox}>
                        <Typography 
                            variant="h5"
                            gutterBottom
                            className={classes.signInText}>
                            Iniciar Sesión
                        </Typography>
                        <Divider/>
                        <Button 
                            variant="contained"
                            color="primary"
                            onClick={signIn}
                            className={classes.googleButton}>
                            Entrar con Google
                        </Button>
                    </Paper>
                    {/* {!account.user && (<button onClick={() => {
                        signIn(account)
                    }}>Login</button>)}
                    {account.user && (<button onClick={() => {
                        signOut(account)
                    }}>Log Out</button>)} */}
                </Fragment>
            )}
        </AccountConsumer>
    )}
const Login = withStyles(styles)(LoginWrapper)
export default Login