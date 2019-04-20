import React from 'react';
import { withStyles, createStyles, Button, TextField } from "@material-ui/core";
import { withFormik, FormikProps } from "formik";
import * as Yup from "yup";
import firebaseApp, {firebase} from '../../../../../../services/firebase';

interface FormValues {
  name: string;
  email: string;
  password: string;
}
interface OtherProps {
  formType: "register" | "login";
  classes?: any;
  onSubmit?(values: FormValues): Promise<any>
}
interface MyFormProps extends OtherProps {
  initialName?: string;
  initialEmail?: string;
  initialPassword?: string;
  selected?: null | any;

}

const styles = theme => createStyles({
  card: {
    maxWidth: 400,
  },
  actions: {
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    width: '100%',
  },
});

const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const {
      values,
      errors,
      touched,
      handleChange,
      handleBlur,
      handleSubmit,
      isSubmitting,
      classes,
      formType,
      onSubmit,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
          {formType === 'register' && <TextField
            error={touched.name && !!errors.name}
            label={'Nombre'}
            placeholder="Su Nombre"
            helperText={touched.name ? errors.name : null}
            fullWidth
            margin="normal"
            name={'name'}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />}
          <TextField
            error={touched.email && !!errors.email}
            label={'E-mail'}
            placeholder="Su correo electronico"
            helperText={touched.email ? errors.email : null}
            fullWidth
            margin="normal"
            name={'email'}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            error={touched.password && !!errors.password}
            label={'Contraseña'}
            placeholder="Su contraseña"
            helperText={touched.password  ? errors.password : null}
            fullWidth
            type="password"
            margin="normal"
            name={'password'}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          />
        <Button
          variant="contained"
          disabled={isSubmitting}
          component={'button'}
          type={'submit'}
          color="primary"
          className={classes.button}>
          {formType === 'register' ? 'Registrarse' : 'Entrar'}
        </Button>
    </form>
  );
};

const EmailForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: props => ({
        name: props.initialName || "",
        email: props.initialEmail || "",
        password: props.initialPassword || "",
    }),
  
    validationSchema: (props: MyFormProps) => {
      const shape = {
        email: Yup.string()
          .email('Correo electronico no valido')
          .required("Debe introducir su correo"),
        password: Yup.string()
          .min(6, 'La contraseña debe tener minimo 6 digtos')
          .required("Debe introducir una contraseña"),
        name: Yup.string()
      };
      if (props.formType === 'register') {
        shape.name = Yup.string()
        .required("Debe introducir su nombre");
      }
      return Yup.object().shape(shape)
    },
  
    handleSubmit(
        values: FormValues,
        { props, setSubmitting, setErrors }
    ) {
      setSubmitting(true);
      const handleError = (error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        switch (errorCode) {
          // Password Errors
          case 'auth/wrong-password':
            return setErrors({
              password: 'La contraseña es incorrecta o el usuario no tiene contraseña.'
            })
          case 'auth/user-not-found': 
            return setErrors({
              email: 'No hay registro de usuario correspondiente a este identificador.'
            })
          case 'auth/email-already-in-use':
            return setErrors({
              email: 'La dirección de correo electrónico ya está en uso por otra cuenta.'
            })
          default:
            return
        }
      }
      if(props.formType === 'register') {
        firebaseApp.auth().createUserWithEmailAndPassword(values.email, values.password)
        .catch(function(error) {
          console.log(error)
          // Handle Errors here.
          setSubmitting(false)
          handleError(error)
        });
      } else {
        firebaseApp.auth().signInWithEmailAndPassword(values.email, values.password)
        .catch(function(error) {
          console.log(error)
          // Handle Errors here.
          setSubmitting(false)
          handleError(error)
        });
      }
        console.log({ props, setSubmitting, setErrors })
    }
  })(InnerForm);
const EmailAuth = withStyles(styles)(EmailForm);
export default EmailAuth