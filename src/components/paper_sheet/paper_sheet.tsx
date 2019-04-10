import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Paper, { PaperProps } from '@material-ui/core/Paper';

interface PropTypes extends PaperProps {
    classes: any,
    children?: React.ReactNode
}
const styles = theme => createStyles({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

const PaperSheetWrapper =(props: PropTypes) => {
  const { classes, children, ...paperProps } = props;

  return (
    <div>
      <Paper className={classes.root} {...paperProps}>
        {children}
      </Paper>
    </div>
  );
}


const PaperSheet = withStyles(styles)(PaperSheetWrapper);
export default PaperSheet;