import React, { Fragment } from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import { SecondaryListItems, MainListItems } from './listItems';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from './features/home/screens/home/home';
import DestinationsHome from './features/destinations/screens/home/destinations_home';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
// pick utils
import MomentUtils from '@date-io/moment';
import Search from './features/home/screens/search/search';
import MainHeader from './layout/header/header';
import Login from './features/auth/screens/login/login';
import AccountProvider, { AccountConsumer } from './providers/AccountProvider';
import UnauthenticatedRoute from './guards/UnauthenticatedRoute';
import AuthenticatedRoute from './guards/AuthenticatedRoute';
import { Avatar, Typography, createMuiTheme } from '@material-ui/core';
import AdminRoute from './guards/AdminRoute';
import AdminHome from './admin/features/home/screens/admin_home/admin_home';
import UsersList from './admin/features/users/screens/users_list/users_list';
import UserHome from './admin/features/users/screens/user_home/user_home';
import UserBrowser from './admin/features/users/screens/user_browser/user_browser';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';
const BreakUp = (props) => {
  const matches = useMediaQuery(`(min-width:${props.px}px)`);
  return matches ? props.children : <Fragment />
}
const styles = (theme: Theme) => createStyles({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    // padding: theme.spacing.unit * 3,
    height: '100vh',
    overflow: 'auto',
  },
  h5: {
    marginBottom: theme.spacing.unit * 2,
  },
  drawerPaper: {
    width: '300px',
  },
  bigAvatar: {
    margin: 10,
    width: 60,
    height: 60,
  },
  userTextBox: {
    paddingRight: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
  }
});
let CustomMatchRoute = ({ component: Component, matcher, ...routeProps }) => (
  <Route 
    {...routeProps}
    component={({ location, ...props }) =>
      matcher(location) && <Component {...props} />
    }
  />
)
class Dashboard extends React.Component<PropTypes> {
  state = {
    open: false,
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Router>
          <AccountProvider>
            <CssBaseline />
            <MainHeader 
              handleDrawerOpen={this.handleDrawerOpen}
              title={'Inicio'} />
            <AccountConsumer>
              {({user}) => (
                <Drawer
                  anchor={'left'}
                  open={this.state.open}
                  onClose={this.handleDrawerClose}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                >
                {user && (
                  <Fragment>
                    {user.photoURL && (
                      <Avatar
                        alt={user.name}
                        src={user.photoURL}
                        className={classes.bigAvatar} />
                    )}
                    {!user.photoURL && (
                      <Avatar
                        alt={user.name}
                        className={classes.bigAvatar}>
                        {user.name[0]}
                      </Avatar>
                    )}
                      <div className={classes.userTextBox}>
                        <Typography variant="h6">
                          {user.name}
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                          {user.email}
                        </Typography>
                      </div>
                    
                    <Divider />
                  </Fragment>
                )}
                {user && (<List onClick={this.handleDrawerClose}>
                  <MainListItems/>
                </List>)}
                <Divider />
                <List onClick={this.handleDrawerClose}>
                  <SecondaryListItems loggedIn={!!user}/>
                </List>
              </Drawer>)}   
            </AccountConsumer>

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <main className={classes.content}>
                <div className={classes.appBarSpacer} />
                  <AuthenticatedRoute path="/" exact component={Home} />
                  <UnauthenticatedRoute path="/login/" component={Login} />

                  {/* Admin Routes */}
                  
                  <AdminRoute path="/admin/users/:uid/browser" exact component={UserBrowser} />
                  <AdminRoute path="/admin" exact component={AdminHome} />
                  <AdminRoute path="/admin/users" exact component={UsersList} />
                  <AdminRoute path="/admin/users/:uid" exact component={UserHome} />
              </main>
            </MuiPickersUtilsProvider>
          </AccountProvider>
        </Router> 
      </div>
    );
  }
}

interface PropTypes {
  classes: any
};

export default withStyles(styles)(Dashboard);