import { productConstants } from "../actions/constants";

const initialState = {
    products: [],
    productsByPrice : {
        under5k : [],
        under10k : [],
        under15k : [],
        under20k : [],
        under30k : [],
    },
    loading: false,
    error: null
};

export default (state = initialState, action) => {

    switch (action.type) {

        case productConstants.GET_PRODUCTS_BY_SLUG : 
            state = {
                ...state,
                products : action.payload.products,
                productsByPrice : {
                    ...action.payload.productsByPrice
                }
            }
        break
        case productConstants.GET_ALL_PRODUCTS_SUCCESS:
            state = {
                ...state,
                products: action.payload.products
            }
        break;
        case productConstants.ADD_NEW_PRODUCT_SUCCESS:
            state = {
                ...state,
                loading : false,
            }
        break;
        case productConstants.ADD_NEW_PRODUCT_FAILURE:
            state = {
                ...state,
                loading: false,
                error: action.payload.error
            }
        break;
    }

    return state;
}