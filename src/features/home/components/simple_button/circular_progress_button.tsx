import React from 'react';
import { withStyles, createStyles, CircularProgress, Fab } from '@material-ui/core';
import { Button } from "@material-ui/core";
import { ButtonProps } from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import { FabProps } from '@material-ui/core/Fab';

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
interface PropTypes extends FabProps {
    classes: any;
    loading?: boolean;
    children?: React.ReactNode
}
const ButtonWrapper = (props: PropTypes) => {
    const {classes, children, loading, ...buttonProps} = props;
    return (
        <div className={classes.wrapper}>
            <Fab {...buttonProps}>
              {children}
            </Fab>
            {loading && <CircularProgress size={68} className={classes.fabProgress} />}
        </div>
    );
}
const CircularProgressButton = withStyles(styles)(ButtonWrapper);
export default CircularProgressButton;