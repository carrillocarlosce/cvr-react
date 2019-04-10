import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { Menu } from '@material-ui/core';
interface PropTypes {
    classes: any,
    items: {
        name: string,
        action?(): void,
        close?: boolean 
    }[];
  }
const styles = theme => ({
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
            {items.map((x, key) => (
                <MenuItem key={key} onClick={() => {
                    x.action();
                    handleClose()
                }}>{x.name}</MenuItem>
            ))}
          
        </Menu>
      </div>
    );
}

const ContextualMenu = withStyles(styles)(ContextualMenuWrapper)

export default ContextualMenu;
