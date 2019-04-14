import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { AccountConsumer } from '../providers/AccountProvider';

const AdminRoute = ({
    component: Component,
    ...rest
    }) => (
    <AccountConsumer>
        {({user}) => (
            <Route {...rest} render={(props) => (
                (!!user && (user.claims as any).admin)
                ? <Component user={user} admin={true} {...props} />
                : <Redirect to='/' />
            )} />
        )}
    </AccountConsumer>
)
export default AdminRoute;
  