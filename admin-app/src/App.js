import React, { useEffect } from 'react'
import { Route, Switch } from 'react-router-dom'

import "./App.css";

import Home from './containers/Home'
import Orders from './containers/Orders'
import Category from './containers/Category'
import NewPage from './containers/NewPage'
import Products from './containers/Products'

import Signin from './containers/Signin'
import Signup from './containers/Signup'
import PrivateRoute from './components/HOC/privateRoute'

import { isUserLoggedIn, getAllCategory, getInitialData } from './actions'
import { useDispatch, useSelector } from 'react-redux'


function App() {

    const dispatch = useDispatch();
    const auth = useSelector(state => state.auth);  // returns the initState in reducer

    useEffect(() => {
        if (!auth.authenticate) {   // still works without this condition
            dispatch(isUserLoggedIn())  // checks for user fetched from DB saved in LS
        }
        
        if (auth.authenticate) {
            dispatch(getInitialData())
        }

        // Fetch all categories to populate the select dropdown
        // dispatch(getAllCategory())

        // Fetch intial data
        dispatch(getInitialData())

    }, [auth.authenticate])

    // console.log(auth)

    return (
        <div className="App">
            <Switch>
                <PrivateRoute path="/" exact component={Home} />
                <PrivateRoute path="/page" component={NewPage} />
                <PrivateRoute path="/category" component={Category} />
                <PrivateRoute path="/products" component={Products} />
                <PrivateRoute path="/orders" component={Orders} />  
                
                <Route path="/signin" component={Signin} />
                <Route path="/signup" component={Signup} />
            </Switch>
        </div>
    )
}

export default App;
