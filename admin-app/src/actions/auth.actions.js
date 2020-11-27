import { authConstants } from "./constants";
import axios from "../helpers/axios";

export const login = (user) => {

    console.log(user)   // {email: "kodesektor@gmail.com", password: "123456"}

    return async (dispatch) => {

        dispatch({ type: authConstants.LOGIN_REQUEST });

        const res = await axios.post(`/admin/signin`, {     // Send to controller
            ...user     // pass in login details to controller (from form)
        });

        if(res.status === 200) {
            const { token, user } = res.data;   // User details returned from controller
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({
                type: authConstants.LOGIN_SUCCESS,   // type to send to the reducer
                payload: {
                    token, user  // login details from UI
                }
            });
        }else{
            if(res.status === 400) {
                dispatch({
                    type: authConstants.LOGIN_FAILURE,
                    payload: { error: res.data.error }
                });
            }
        }
    }
}

export const isUserLoggedIn = () => {
    return async dispatch => {
        const token = localStorage.getItem('token');    // Check if user is saved in localstorage
        if (token) {
            const user = JSON.parse(localStorage.getItem('user'));
            dispatch({
                type: authConstants.LOGIN_SUCCESS,
                payload: {
                    token, user
                }
            });
        } else {
            dispatch({
                type: authConstants.LOGIN_FAILURE,
                payload: { error: 'Failed to login' }
            });
        }
    }
}

// export const signout = () => {
//     return async dispatch => {

//         dispatch({ type: authConstants.LOGOUT_REQUEST });
//         const res = await axios.post(`/admin/signout`);

//         if(res.status === 200){
//             localStorage.clear();
//             dispatch({ type: authConstants.LOGOUT_SUCCESS });
//         }else{
//             dispatch({
//                 type: authConstants.LOGOUT_FAILURE,
//                 payload: { error: res.data.error }
//             });
//         }
//     }
// }