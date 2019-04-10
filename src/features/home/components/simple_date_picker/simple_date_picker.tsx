import React, { useState } from 'react';
import { 
    FormControl,
    InputLabel, 
    Select, 
    OutlinedInput, 
    withStyles, 
    createStyles, 
    MenuItem, 
    Input,
    FormHelperText
} from "@material-ui/core";
import { DatePicker } from 'material-ui-pickers';
import { DatePickerModalProps } from 'material-ui-pickers/DatePicker/DatePickerModal';

interface SimpleDatePickerTypes extends DatePickerModalProps {
    classes: any
    label?: string
    handleChange?(e: React.ChangeEvent<any>): void
    errorMsg: string
}

const styles = theme => createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
  });
const Wrapper = (props: SimpleDatePickerTypes) => {
    const { 
        classes,
        errorMsg,
        ...pickerProps
    } = props;
    return (
        <FormControl className={classes.formControl} error={props.error}>
            <DatePicker
                {...pickerProps}
                // autoOk
                // label={label}
                // clearable={clearable}
                // disablePast={disablePast}
                // value={value}
                // onChange={handleChange}
            />
          <FormHelperText>{errorMsg}</FormHelperText>
        </FormControl>
    )
}
const SimpleDatePicker = withStyles(styles)(Wrapper)
export default SimpleDatePicker;