import { authConstants, cartConstants } from "./constants";
import axios from "../helpers/axios";

// new update signup action
export const signup = (user) => {

	return async (dispatch) => {
        let res;

		try {
			dispatch({ type: authConstants.SIGNUP_REQUEST });
            res = await axios.post(`/signup`, user);
            
			if (res.status === 201) {
				dispatch({ type: authConstants.SIGNUP_SUCCESS });
                const { token, user } = res.data;
                
				localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                
				dispatch({
					type: authConstants.LOGIN_SUCCESS,
					payload: {
						token,
						user
					}
				});
			} else {
				const { message } = res.data;
                dispatch({ 
                    type: authConstants.SIGNUP_FAILURE, 
                    payload: { error : message } 
                });
			}
		} catch (error) {
            const { data } = error.response;    // {message: "User already registered"}
            let message = data.message
            dispatch({
				type: authConstants.SIGNUP_FAILURE,
				payload: { error : message }
			});
		}
	};
};

export const login = (user) => {

	return async (dispatch) => {

        dispatch({ type: authConstants.LOGIN_REQUEST });

        try {
            const res = await axios.post(`/signin`, {
            // const res = axios.post(`/signin`, {
                ...user,
            });

            if (res.status === 200) {
                const { token, user } = res.data;
                
                localStorage.setItem("token", token);   // eyJhbGciOiJIUzI1NiIsInR5cCI...
                localStorage.setItem("user", JSON.stringify(user));
                
                dispatch({
                    type: authConstants.LOGIN_SUCCESS,
                    payload: {
                        token,
                        user
                    }
                });
            } else {
                console.log(res)
                if (res.status === 400) {
                    console.log(res.data)
                    dispatch({
                        type: authConstants.LOGIN_FAILURE,
                        payload: { error: res.data.message }
                    });
                }
            }
        } catch (error) {
            const { data } = error.response;    // {message: "User already registered"}
            console.log(data)
            let message = data.message
            dispatch({
				type: authConstants.LOGIN_FAILURE,
				payload: { error : message }
			});
        }
		
	};
};

export const isUserLoggedIn = () => {

	return async (dispatch) => {

        const token = localStorage.getItem("token");
        
		if (token) {
			const user = JSON.parse(localStorage.getItem("user"));
			dispatch({
				type: authConstants.LOGIN_SUCCESS,
				payload: {
					token,
					user,
				},
			});
		} else {
			dispatch({
				type: authConstants.IS_LOGGED_IN_FAILURE,
				payload: { error: "Failed to login" },
			});
		}
	};
};

export const signout = () => {

	return async (dispatch) => {

		dispatch({ type: authConstants.LOGOUT_REQUEST });
		// localStorage.removeItem('user');
		// localStorage.removeItem('token');
        localStorage.clear();
        
		dispatch({ type: authConstants.LOGOUT_SUCCESS });
		dispatch({ type: cartConstants.RESET_CART });
		//const res = await axios.post(`/admin/signout`);
		// if(res.status === 200){

		// }else{
		//     dispatch({
		//         type: authConstants.LOGOUT_FAILURE,
		//         payload: { error: res.data.error }
		//     });
		// }
	};
};
