import authReducer from './auth.reducers';
import cartReducer from './cart.reducer';
import userReducer from './user.reducer';
import productReducer from './product.reducer';
import categoryReducer from './category.reducer';
// import pageReducer from './page.reducer';
import { combineReducers } from 'redux';

// to be exported to src/store/index.js
const rootReducer = combineReducers({
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    category: categoryReducer,
    product: productReducer,
    // page: pageReducer
});

export default rootReducer;