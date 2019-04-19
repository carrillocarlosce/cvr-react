import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { Menu, Theme, createStyles } from '@material-ui/core';
import { ContextualMenuOption } from 'cvr-shared/interfaces/browser';

interface PropTypes {
    classes: any,
    items: ContextualMenuOption[];
  }
const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing.unit * 2,
  },
});

const ContextualMenuWrapper = (props: PropTypes) => {
    const [anchorEl, setAnchorEl] = useState(null)
    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const { classes, items } = props;

    return (
        <div>
        <IconButton 
            aria-owns={anchorEl ? 'simple-menu' : undefined}
            aria-haspopup="true"
            onClick={handleClick}>
            <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
            {items.map((option, key) => (
                <MenuItem key={key} onClick={() => {
                    option.action();
                    handleClose()
                }}>{option.name}</MenuItem>
            ))}
          
        </Menu>
      </div>
    );
}

const ContextualMenu = withStyles(styles)(ContextualMenuWrapper)

export default ContextualMenu;
