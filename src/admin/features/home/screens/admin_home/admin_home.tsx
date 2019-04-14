import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles, Theme } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import { RouteComponentProps } from 'react-router-dom';
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

const AdminHomeWrapper = (props: PropTypes) => {

    const { classes, match, history } = props;

    return (
      <List
        component="nav"
        subheader={<ListSubheader component="div">Admin Dashboard</ListSubheader>}
        className={classes.root}
      >
        <ListItem button onClick={() => {
            const to = `${match.path}/users`;
            history.push(to)

            console.log(props)
        }}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText inset primary="Usuarios" />
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


const AdminHome = withStyles(styles)(AdminHomeWrapper);
export default AdminHome;