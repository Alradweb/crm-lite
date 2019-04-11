import {
    AUTH_SUCCESS, REGISTER_SUCCESS, AUTH_LOGOUT, AUTH_ERROR, CLEAR_AUTH_ERROR,
    AUTH_WARNING, MEET_GUEST
} from "../actions/actionsTypes";


const localStore = localStorage['auth-store'] ? {...(JSON.parse(localStorage['auth-store']).auth), quest: false } : null;

const initialState = localStore ?
    localStore :
    {
        token: null,
        register: null,
        authError: null,
        warning: null,
        guest: false
    };

export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case AUTH_SUCCESS :
            return {
                ...state, token: action.token, authError: null
            };
        case REGISTER_SUCCESS :
            return {
                ...state, register: action.register
            };
        case AUTH_ERROR :
            return {
                ...state, authError: action.error
            };
        case CLEAR_AUTH_ERROR :
            return {
                ...state, authError: null
            };
        case AUTH_WARNING :
            return {
                ...state, warning: 'You will be logged out automatically in 1 minute.'
            };
        case AUTH_LOGOUT :
            return {
                ...state, token: null, authError: null, warning: null, guest: false
            };
        case MEET_GUEST :
            return {
                ...state, guest: true
            };
        default :
            return state
    }
}
