import React, { Fragment, useState } from 'react';
import firebaseApp, { firebase } from '../../../../services/firebase';
import { AccountConsumer } from '../../../../providers/AccountProvider';
import { Paper, withStyles, createStyles, Typography, Theme, Button, Divider, Grid } from '@material-ui/core';
import EmailAuth from './components/email_auth/email_auth';
const styles = (theme: Theme) => createStyles({
    root: {
        display: 'flex',
        justifyContent: 'center',
    },
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
    formToggle: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '10px 0',
    },
    signInText: {
        textAlign: 'center',
        // marginBottom: theme.spacing.unit * 2
    },
    googleButton: {
        backgroundColor: '#EA4335',
    }
});
const provider = new firebase.auth.GoogleAuthProvider();
const signIn = () => {

    firebaseApp.auth()
        .signInWithPopup(provider)
        .then(function (result) {
            console.log(result)

            // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // // The signed-in user info.
            // var user = result.user;
            // ...
            console.log(result)
        }).catch(function (error) {
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
const LoginWrapper = ({ match, history, classes }) => {
    const [formType, setFormType] = useState<"login" | "register">("login");
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
                    <Grid container className={classes.root} spacing={16}>
                        <Grid item xs={12} sm={6}>
                            <Paper className={classes.loginBox}>
                                <Typography
                                    variant="h5"
                                    gutterBottom
                                    className={classes.signInText}>
                                    {formType === "login" ? 'Iniciar Sesión' : 'Registrarse'}
                                </Typography>
                                <Divider />
                                <EmailAuth formType={formType} />
                                <div className={classes.formToggle}>
                                    <Button
                                        size="small"
                                        className={classes.margin}
                                        onClick={() => {
                                            setFormType(formType === "login" ? 'register' : 'login')
                                        }}
                                    >
                                        {formType === "login" ? 'Registrarse' : 'Iniciar Sesión'}
                                    </Button>
                                    <Button size="small" className={classes.margin}>
                                        Recuperar Contraseña
                                    </Button>
                                </div>
                                <Divider />
                                <Typography style={{
                                    textAlign: 'center',
                                    textTransform: 'uppercase',
                                    color: '#666',
                                    fontWeight: 400,
                                    margin: '10px 0',
                                }}>
                                    tambien puedes
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={signIn}
                                    className={classes.googleButton}>
                                    Entrar con Google
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* {!account.user && (<button onClick={() => {
                        signIn(account)
                    }}>Login</button>)}
                    {account.user && (<button onClick={() => {
                        signOut(account)
                    }}>Log Out</button>)} */}
                </Fragment>
            )}
        </AccountConsumer>
    )
}
const Login = withStyles(styles)(LoginWrapper)
export default Login