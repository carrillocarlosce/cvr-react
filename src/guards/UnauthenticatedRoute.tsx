import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { AccountConsumer } from '../providers/AccountProvider';

const UnauthenticatedRoute = ({
    component: Component,
    ...rest
    }) => (
    <AccountConsumer>
        {({user}) => (
            <Route {...rest} render={(props) => (
                !(!!user)
                ? <Component {...props} />
                : <Redirect to='/' />
            )} />
        )}
    </AccountConsumer>
)
export default UnauthenticatedRoute;
  