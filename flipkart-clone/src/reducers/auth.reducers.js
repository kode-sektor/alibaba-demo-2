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
    message: '',
    formMsg : ''
};

export default (state = initState, action) => {

    // console.log(action);    // payload : {
                            //     token : "53EGERTWERWER23RF4V..."
                            //      user : {
                            //          email: "kodesektor@gmail.com"
                            //          password: "123456"
                            //      }
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
        case authConstants.LOGIN_FAILURE:
            state = {
                ...state,
                formMsg: action.payload.error,
            };
        break;
        case authConstants.SIGNUP_FAILURE:
            state = {
                ...state,
                formMsg: action.payload.error,
            };
        break;
        case authConstants.IS_LOGGED_IN_FAILURE:
            state = {
                ...state
            };
        break;
    }
    return state;
}

