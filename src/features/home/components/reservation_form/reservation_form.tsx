import React, { useState, useEffect } from "react";
import { withFormik, FormikProps } from "formik";
import * as Yup from "yup";
import SimpleSelect from "../simple_select/simple_select";
import SimpleButton from '../simple_button/simple_button'
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import SimpleDatePicker from "../simple_date_picker/simple_date_picker";
import moment from 'moment';
import { getPlaces } from "../../api/places";
import { Grid } from "@material-ui/core";
import CircularProgressButton from "../simple_button/circular_progress_button";
interface FormValues {
    origin: string;
    destination: string;
    date: string;
}

interface OtherProps {
    title?: string;
    handleChange?(e: React.ChangeEvent<any> | string): void
    loading?: boolean
}

interface MyFormProps {
    initialOrigin?: string;
    initialDestination?: string;
    initialDate?: string; 
    onSubmit(form:FormValues): void;
    loading?: boolean

}

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    background-color: lightgrey;
    padding: 1.5rem;
    border-radius: 3px;
`;

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
        loading
    } = props;
    const [selectedDate, handleDateChange] = useState(
        values.date ? moment(values.date, 'DD/MM/YYYY') : null
    );
    const [places, setPlaces] = useState([])

    useEffect(() => {
        getPlaces()
        .then(docs => {
            console.log({docs})
            const places = docs.map(place => ({
                name: place.name,
                value: place.id
            }))
            setPlaces(places)
        })
        .catch(error => {
            console.log(error)
        })
    }, [places.length])

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <Grid container spacing={24}>
                <Grid item md sm={6} xs={12}>
                    <SimpleSelect
                        label={'Origen'}
                        value={values.origin}
                        error={!!(errors.origin && touched.origin)}
                        errorMsg={errors.origin}
                        handleChange={handleChange}
                        name="origin"
                        options={places}
                    />
                </Grid>
                <Grid item md sm={6} xs={12}>
                    <SimpleSelect
                        label={'Destino'}
                        value={values.destination}
                        error={!!(errors.destination && touched.destination)}
                        errorMsg={errors.destination}
                        handleChange={handleChange}
                        name="destination"
                        options={places}
                    />
                </Grid>
                <Grid item md sm={6} xs={12}>
                    <SimpleDatePicker
                        autoOk
                        label="Fecha del Viaje"
                        disablePast
                        value={selectedDate}
                        format={'DD/MM/YYYY'}
                        onChange={(date) => {
                            const value = date ? date.format('DD/MM/YYYY') : null
                            setFieldValue('date', value)
                            handleDateChange(date)
                        }}
                        error={errors.date && touched.date}
                        errorMsg={errors.date}
                    />
                </Grid>
                <Grid item md={2} sm={6} xs={12}>
                    <CircularProgressButton
                        loading={loading}
                        color="primary"
                        type="submit"
                        disabled={
                            isSubmitting ||
                            loading ||
                            !!(errors.origin && touched.origin) ||
                            !!(errors.destination && touched.destination)
                        }>
                        <SearchIcon/>
                    </CircularProgressButton>
                </Grid>
            </Grid>
        </FormWrapper>
    );
};

const ReservationForm = withFormik<MyFormProps, FormValues>({
    mapPropsToValues: props => ({
        origin: props.initialOrigin || "",
        destination: props.initialDestination || "",
        date: props.initialDate || ""
    }),

    validationSchema: Yup.object().shape({
        origin: Yup.string()
            .required("Origen requerido"),
        destination: Yup.string()
            .required("Destino requerido"),
        date: Yup.string()
            .required("Fecha requerida")
    }),
    handleSubmit(
        form: FormValues,
        { props, setSubmitting, setErrors }
    ) {
        props.onSubmit(form)
        setSubmitting(false)
    }
})(InnerForm);

export default ReservationForm;