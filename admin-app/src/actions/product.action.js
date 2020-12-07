import axios from "../helpers/axios";

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

// export const addCategory = (form) => {
//     return async dispatch => {
//         // console.log("FORM >>> ", Array.from(form))

//         dispatch({ type: categoryConstants.ADD_NEW_CATEGORY_REQUEST });
//         try {
//             const res = await axios.post(`/category/create`, form);
//             console.log("RES : >>> ", res)
            
//             if (res.status === 201) {
//                 dispatch({
//                     type: categoryConstants.ADD_NEW_CATEGORY_SUCCESS,
//                     payload: { category: res.data.category }
//                 });
//             } else {
//                 dispatch({
//                     type: categoryConstants.ADD_NEW_CATEGORY_FAILURE,
//                     payload: res.data.error
//                 });
//             }
//         } catch (error) {   
//             console.log(error.response);
//             dispatch({
//                 type: categoryConstants.ADD_NEW_CATEGORY_FAILURE,
//                 payload: { error : error.response }
//             });
//         }
//     }
// }