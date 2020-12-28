import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./containers/HomePage";
import ProductListPage from "./containers/ProductListPage";
import { useDispatch, useSelector } from "react-redux";
import { isUserLoggedIn, updateCart } from "./actions";
import ProductDetailsPage from "./containers/ProductDetailsPage";
// import CartPage from "./containers/CartPage";
// import CheckoutPage from "./containers/CheckoutPage";
// import OrderPage from "./containers/OrderPage";

function App() {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);

    // axios.interceptors is responsible for automatically bouncing out user after expiry
    // session. It resets the state to initial in reducer.js which means 'authenticate'
    // becomes false.
    useEffect(() => {
        if (!auth.authenticate) {
            dispatch(isUserLoggedIn()); 
        }
    }, [auth.authenticate]);    // Login / Logout event

    // useEffect(() => {
    //     console.log("App.js - updateCart");
    //     dispatch(updateCart());
    // }, [auth.authenticate]);

    return (
        <div className="App">
            <Router>
                <Switch>
                    <Route path="/" exact component={HomePage} />
                    {/* <Route path="/cart" component={CartPage} />
                    <Route path="/checkout" component={CheckoutPage} />
                    <Route path="/account/orders" component={OrderPage} />*/}
                    <Route
                        path="/:productSlug/:productId/p"
                        component={ProductDetailsPage}
                    />

                    {/* :slug will act as key in search query in ProductListPage component */}
                    <Route path="/:slug" component={ProductListPage} /> 
                </Switch>
            </Router>
        </div>
    );
}

export default App;
