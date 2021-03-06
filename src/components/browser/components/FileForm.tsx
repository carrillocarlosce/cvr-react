import React from 'react';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import { TextField, Button } from '@material-ui/core';
import { withFormik, FormikProps } from "formik";
import * as Yup from "yup";

interface FormValues {
  name: string;
}
interface OtherProps {
  title?: string;
  formLabel?: string;
  buttonSubmitText?: string;
  buttonCancelText?: string;
  classes?: any;
  close?(): void;
  onSubmit?(values: FormValues): Promise<any>
}
interface MyFormProps extends OtherProps {
  initialName?: string;
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
    margin: theme.spacing.unit,
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
      title,
      formLabel,
      classes,
      close,
      onSubmit,
      buttonSubmitText,
      buttonCancelText
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Card className={classes.card}>
        <CardHeader
          title={title}
        />
        <CardContent>
          <TextField
            error={touched && !!errors.name}
            id="standard-full-width"
            label={formLabel}
            style={{ margin: 8, marginRight: 16 }}
            placeholder="Su texto aqui..."
            // helperText="Full width!"
            fullWidth
            margin="normal"
            name={'name'}
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            InputLabelProps={{
              shrink: true,
            }}
          
          />
        </CardContent>
        <CardActions  className={classes.actions} disableActionSpacing>
          <Button
            disabled={isSubmitting || (touched && !!errors.name)}
            component={'button'}
            type={'submit'}
            color="primary"
            className={classes.button}>
            {buttonSubmitText || 'Guardar'}
          </Button>
          <Button 
            disabled={isSubmitting}
            component={'a'}
            color="secondary"
            className={classes.button}
            onClick={close}>
            {buttonCancelText || 'Cancelar'}
            
          </Button>
        </CardActions>
      </Card>
    </form>
  );
};

const FileForm = withFormik<MyFormProps, FormValues>({
  mapPropsToValues: props => ({
      name: props.initialName || "",
  }),

  validationSchema: Yup.object().shape({
      name: Yup.string()
          .required("El nombre no puede estar vacio!"),
  }),

  handleSubmit(
      values: FormValues,
      { props, setSubmitting, setErrors }
  ) {
    setSubmitting(true)
    props.onSubmit(values)
      .then(res => {
        setSubmitting(false)
        props.close();
      })
      .catch(error => {
        console.log(error)
        setSubmitting(false)
      });
      console.log({ props, setSubmitting, setErrors })
  }
})(InnerForm);

export default withStyles(styles)(FileForm);