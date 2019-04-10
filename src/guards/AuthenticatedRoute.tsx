import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { AccountConsumer } from '../providers/AccountProvider';

const AuthenticatedRoute = ({
    component: Component,
    ...rest
    }) => (
    <AccountConsumer>
        {({user}) => (
            <Route {...rest} render={(props) => (
                (!!user)
                ? <Component user={user} {...props} />
                : <Redirect to='/login/' />
            )} />
        )}
    </AccountConsumer>
)
export default AuthenticatedRoute;
  