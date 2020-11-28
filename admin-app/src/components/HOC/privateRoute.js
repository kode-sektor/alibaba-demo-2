import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({component: Component, ...rest}) => {
    return <Route {...rest} component={(props) => {

        // 'token' is the name of the key saved in localstorage 
        // during jwt signin / signup process
        const token = window.localStorage.getItem('token'); 
        if (token) {
            // If token, render required page as normal+
            return <Component {...props} />
        } else {
            // Redirect to sign in page if no token
            return <Redirect to={`/signin`} />
        }
    }} />
}

export default PrivateRoute;

