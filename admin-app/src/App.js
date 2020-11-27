import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import "./App.css";

import Home from './containers/Home'
import Signin from './containers/Signin'
import Signup from './containers/Signup'
import PrivateRoute from './components/HOC/privateRoute'

import { isUserLoggedIn, getInitialData } from './actions';
import { useDispatch, useSelector } from 'react-redux';


function App() {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);  // returns the initState in reducer

    useEffect(() => {
        if (!auth.authenticate) {   // still works without this condition
            dispatch(isUserLoggedIn())  // checks for user fetched from DB saved in LS
        }
    }, [])

    // console.log(auth)

    return (
        <div className="App">
            <Switch>
                <PrivateRoute path="/" exact component={Home} />
                <Route path="/signin" component={Signin} />
                <Route path="/signup" component={Signup} />
            </Switch>
        </div>
    );
}

export default App;
