import React, { ReactElement, Fragment, useState, useEffect } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';
import { Route } from 'react-router-dom'
import firebaseApp from './services/firebase';
import { FaKey } from 'react-icons/fa';
interface LinkProps {
    to: string
    label: string
    exact?: boolean
    renderIcon?(): ReactElement
}

const Link = ({to, label, exact, renderIcon}: LinkProps) => (
    <Route path={to} exact={exact} children={({match, history}) => (
        <ListItem
            button
            selected={!!match}
            onClick={() => {
                history.push(to)
            }}>
            {renderIcon && (<ListItemIcon>
                {renderIcon()}
            </ListItemIcon>)}
            <ListItemText primary={label} />
        </ListItem>
    )} />
)


const MainListItemsWrapper = (props: any) => {
  const [items, setItems] = useState<LinkProps[]>([{
    to: '/',
    label: 'Inicio',
    exact: true,
    renderIcon: () => <HomeIcon/>
  }])
  useEffect(() => {
    console.log('Checking Permissions...')

    firebaseApp.auth().currentUser.getIdTokenResult()
    .then((token) => {
      if(token.claims.admin) {
        console.log('User is administrator')
        const adminItems = [{
          to: '/admin',
          label: 'Admin',
          exact: true,
          renderIcon: () => <FaKey/>
        }]
        setItems([...items, ...adminItems])
      }
    })
  }, [])
  return (
    <div>
      {items.map((props, i) => (
          <Link key={`list_item_${i}`} {...props}/>
      ))}
    </div>
  )
};
export const MainListItems = React.memo(MainListItemsWrapper)
export const SecondaryListItems = ({loggedIn}) => (
  <Fragment>
    {/* <ListSubheader inset>Cuenta</ListSubheader> */}
    {loggedIn && (<ListItem button onClick={() => {
      firebaseApp.auth().signOut();
    }}>
      {/* <ListItemIcon>
        <FaSignOutAlt />
      </ListItemIcon> */}
      <ListItemText primary="Cerrar Sesión" />
    </ListItem>)}
    {!loggedIn && (
      <Link 
      to="/login/"
      label="Iniciar Sesión"
      renderIcon={() => <PersonIcon/>}/>
    )} 
  </Fragment>
);