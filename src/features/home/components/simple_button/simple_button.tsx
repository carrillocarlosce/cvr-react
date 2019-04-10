import React from 'react';
import { withStyles, createStyles, CircularProgress } from '@material-ui/core';
import { Button } from "@material-ui/core";
import { ButtonProps } from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';

const styles = theme => createStyles({
    root: {
        display: 'flex',
        alignItems: 'center',
      },
      wrapper: {
        margin: theme.spacing.unit,
        position: 'relative',
      },
      buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
          backgroundColor: green[700],
        },
      },
      fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
      },
      buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
      },
});
interface PropTypes extends ButtonProps {
    classes: any;
    loading?: boolean;
}
const ButtonWrapper = (props: PropTypes) => {
    const {classes, children, loading, ...buttonProps} = props;
    return (
        <div className={classes.wrapper}>
            <Button {...buttonProps}>
            {children}
            </Button>
            {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
    );
}
const SimpleButton = withStyles(styles)(ButtonWrapper);
export default SimpleButton;