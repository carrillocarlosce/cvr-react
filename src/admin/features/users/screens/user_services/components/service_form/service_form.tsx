import React, { Fragment } from 'react';

import { withFormik, FormikProps } from "formik";
import * as Yup from 'yup';
import { TextField, createStyles, Theme, withStyles, MenuItem } from "@material-ui/core";
import { DatePicker } from 'material-ui-pickers';
import { useState } from 'react';
import { Moment } from 'moment';
import moment from 'moment';
import { firestore } from '../../../../../../../services/firebase';

interface FormValues {
    name: string;
    periodicity: string;
    price: number;
    payday: Moment;
}

interface OtherProps {
    title?: string;
    classes?: any;
}

interface MyFormProps extends OtherProps {
    initialName?: string;
    initialPeriodicity?: string;
    initialPrice?: number;
    initialPayday?: Moment;
}

const styles = (theme: Theme) => createStyles({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    dense: {
        marginTop: 19,
    },
    menu: {
        width: 200,
    },
});
const serviceOptions = [
    {
        value: 'service_1',
        label: 'Servicio 1'
    },
    {
        value: 'service_2',
        label: 'Servicio 2'
    },
    {
        value: 'service_3',
        label: 'Servicio 3'
    },
    {
        value: 'service_4',
        label: 'Servicio 4'
    },
]
const periodicityOptions = [
    {
        value: '1',
        label: 'Mensual'
    },
    {
        value: '12',
        label: 'Anual'
    },
]
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue,
        title,
        classes,
    } = props;
    return (
        <Fragment>
            <h1>{title}</h1>
            <form onSubmit={handleSubmit}>
                <TextField
                    error={touched.name && !!errors.name}
                    select
                    label="Nombre del servicio"
                    name={'name'}
                    className={classes.textField}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    {serviceOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    error={touched.periodicity && !!errors.periodicity}
                    select
                    label="Tipo de Servicio"
                    name={'periodicity'}
                    className={classes.textField}
                    value={values.periodicity}
                    onChange={handleChange}
                    onBlur={handleBlur}
                >
                    {periodicityOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    error={touched.price && !!errors.price}
                    label="Costo del servicio"
                    name={'price'}
                    className={classes.textField}
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                <DatePicker
                    views={["day"]}
                    label="Year only"
                    value={values.payday}
                    onChange={date => setFieldValue('payday', date, true)}
                    format="DD"
                    animateYearScrolling
                />
                <button
                    type="submit"
                    disabled={
                        isSubmitting ||
                        !!(errors.name && touched.name) ||
                        !!(errors.periodicity && touched.periodicity) ||
                        !!(errors.price && touched.price)
                    }
                >
                    Sign In
                </button>
            </form>
        </Fragment >
    );
};

const Form = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: props => ({
        name: props.initialName || "",
        periodicity: props.initialPeriodicity || "",
        price: props.initialPrice || 0,
        payday: props.initialPayday || moment(),
    }),

    validationSchema: Yup.object().shape({
        name: Yup.string().required("Name is required"),
        periodicity: Yup.string().required("Type is required"),
        price: Yup.number().required("Price is required")
    }),

    handleSubmit(
        form: FormValues,
        { props, setSubmitting, setErrors }
    ) {
        setSubmitting(false)
        firestore.collection('user_services').add({ ...form, payday: form.payday.toDate() })
        console.log(form);
    }
})(InnerForm);
const ServiceForm = withStyles(styles)(Form)
export default ServiceForm;