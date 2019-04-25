import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import BeenhereIcon from '@material-ui/icons/Beenhere';
import { useCollection } from '../../../../../hooks/firestore_hooks';
import { firestore } from '../../../../../services/firebase';
import { Avatar, ListItemAvatar } from '@material-ui/core';
import { RouteComponentProps } from 'react-router';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});
interface PropTypes extends RouteComponentProps {
  classes: any,
};

const UserHomeWrapper = (props: PropTypes) => {

  const { classes, location, history } = props;
  return (
    <List
      component="nav"
      subheader={<ListSubheader component="div">Acciones</ListSubheader>}
      className={classes.root}
    >
      <ListItem button onClick={() => {
        const to = `${location.pathname}/browser`;
        // console.log(props)
        history.push(to);
      }}>
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText inset primary={'Explorar Archivos'} secondary={'Interactua con los archivos de este usuario.'} />
      </ListItem>
      <ListItem button onClick={() => {
        const to = `${location.pathname}/services`;
        // console.log(props)
        history.push(to);
      }}>
        <ListItemIcon>
          <BeenhereIcon />
        </ListItemIcon>
        <ListItemText inset primary={'Administrar Servicios'} secondary={'Interactua con los archivos de este usuario.'} />
      </ListItem>


      {/* <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText inset primary="Drafts" />
        </ListItem> */}
    </List>
  );
}


const UserHome = withStyles(styles)(UserHomeWrapper);
export default UserHome;