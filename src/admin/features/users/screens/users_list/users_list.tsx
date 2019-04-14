import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
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

const UsersListWrapper = (props: PropTypes) => {

    const { classes, match, history } = props;
    const query = firestore.collection('users');

    const users = useCollection(query);

    console.log(users)
    return (
      <List
        component="nav"
        subheader={<ListSubheader component="div">Usuarios</ListSubheader>}
        className={classes.root}
      >
      {
          users.map(user => {
              return (
                <ListItem key={user.uid} button onClick={() => {
                    const to = `${match.path}/${user.uid}`;
                    history.push(to);
                }}>
                    <ListItemAvatar>
                        <Avatar
                        alt={user.name}
                        src={user.photoURL} />
                    </ListItemAvatar>
                    
                    <ListItemText inset primary={user.name} secondary={user.email} />
                </ListItem>
              )
          })
      }
        
        {/* <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText inset primary="Drafts" />
        </ListItem> */}
      </List>
    );
}


const UsersList = withStyles(styles)(UsersListWrapper);
export default UsersList;