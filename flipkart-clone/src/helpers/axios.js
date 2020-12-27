import axios from 'axios';
import { api } from '../urlConfig';     // 'http://localhost:2000/api'
import store from '../store';
import { authConstants } from '../actions/constants';

// Whenever you sign up or sign in, the code saves a token in the localstorage
const token = window.localStorage.getItem('token');
// console.log(token)

const axiosInstance = axios.create({
    baseURL: api,
    headers: {
        'Authorization': token ? `Bearer ${token}` : ''
    }
});

axiosInstance.interceptors.request.use((req) => {
    const { auth } = store.getState();
    if (auth.token) {
        req.headers.Authorization = `Bearer ${auth.token}`;
    }
    return req;
})

// Be careful, as this can cause errors when a form is submitted
// Part of code that logs out if 'expiresIn' is set.
// It destroys the token in localstorage.
axiosInstance.interceptors.response.use((res) => {
    return res;
}, (error) => {
    console.log(error.response);
    const status = error.response ? error.response.status : 500;

    if (status && status === 500) {
        localStorage.clear();
        // returns state to initialState in reducer which means 
        // authenticate becomes false
        store.dispatch({ type: authConstants.LOGOUT_SUCCESS });
    }
    return Promise.reject(error);
})

export default axiosInstance;