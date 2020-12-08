import { authConstants } from "../actions/constants";

const initState = {
    token: null,
    user: {
        firstName: '',
        lastName: '',
        email: '',
        picture: ''
    },
    authenticate: false,
    authenticating: false,
    loading: false,
    error: null,
    message: ''
};

export default (state = initState, action) => {

    // console.log(action);    // payload : {
                            //     email: "kodesektor@gmail.com"
                            //     password: "123456"
                            //     type: "LOGIN_REQUEST"
                            // }

    switch (action.type) {
        case authConstants.LOGIN_REQUEST :
            state = {
                ...state,
                authenticating: true
            }
        break;
        case authConstants.LOGIN_SUCCESS :
            state = {
                ...state,
                user: action.payload.user,  // Save user's details from DB
                token: action.payload.token,    // Save token
                authenticate: true,
                authenticating: false
            }
        break;
        case authConstants.LOGOUT_REQUEST:
            state = {
                ...state,
                loading: true
            }
        break;
        case authConstants.LOGOUT_SUCCESS:
            state = {
                ...initState
            }
        break;
        case authConstants.LOGOUT_FAILURE:
            state = {
                ...state,
                error: action.payload.error,
                loading: false
            }
        break;
    }
    return state;
}

