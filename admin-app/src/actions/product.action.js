import axios from "../helpers/axios";
import { categoryConstants } from "./constants";

export const addProduct = form => {
    return async dispatch => {
        try {
            const res = await axios.post(`product/create`, form)
            console.log("RES : >>> ", res)
            
            if (res.status === 201) {
                dispatch({
                    type: categoryConstants.ADD_NEW_PRODUCT_SUCCESS,
                    payload: { category: res.data.category }
                });
            } else {
                dispatch({
                    type: categoryConstants.ADD_NEW_PRODUCT_FAILURE,
                    payload: res.data.error
                });
            }
        } catch (error) {   
            console.log(error.response);
            dispatch({
                type: categoryConstants.ADD_NEW_PRODUCT_FAILURE,
                payload: { error : error.response }
            });
        }
    }
}
