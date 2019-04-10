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

interface SimpleSelectTypes {
    classes: any
    label?: string
    value?: string
    handleChange?(e: React.ChangeEvent<any>): void
    name: string
    options: {
        name: string
        value: any
    }[]
    error: boolean,
    errorMsg: string,
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
const Wrapper = ({ 
    classes, 
    value, 
    handleChange, 
    label,
    name,
    options,
    error,
    errorMsg
}: SimpleSelectTypes) => {
    return (
        <FormControl className={classes.formControl} error={!!error}>
          <InputLabel shrink htmlFor={`${name}-label-placeholder`}>
            {label}
          </InputLabel>
          <Select
            value={value}
            onChange={handleChange}
            input={<Input name={name} id={`${name}-label-placeholder`} />}
            displayEmpty
            name={name}
            className={classes.selectEmpty}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {options.map(({name, value}, i) => (
                <MenuItem key={`option_${i}`} value={value}>{name}</MenuItem>
            ))}
          </Select>
          <FormHelperText>{errorMsg}</FormHelperText>
        </FormControl>
    )
}
const SimpleSelect = withStyles(styles)(Wrapper)
export default SimpleSelect;