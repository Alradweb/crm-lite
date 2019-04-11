import {
    AUTH_SUCCESS,
    REGISTER_SUCCESS,
    AUTH_LOGOUT,
    AUTH_ERROR,
    AUTH_WARNING,
    CLEAR_AUTH_ERROR,
    MEET_GUEST
} from "./actionsTypes";
import {LIFE_TIME_TOKEN} from "../../constants";
import HttpService from "../../services/httpservice";

const {login, register} = new HttpService();

export function auth(user, isLogin) {
    return async dispatch => {
        if (isLogin) {
            await loginHandler(user, dispatch)
        } else {
            await registrationHandler(user, dispatch)
        }
    }
}

async function registrationHandler(user, dispatch) {
    const res = await register(user);
    if (res.ok) {
        dispatch(authRegister(res))
    } else {
        dispatch(authError(res));
    }

}

async function loginHandler(user, dispatch) {
    const res = await login(user);
    if (res.ok) {
        autoLogout(dispatch);
        logoutWarning(dispatch);
        dispatch(authRegister(null));
        dispatch(authLogin(res.token));
    } else {
        dispatch(authError(res));
    }
}

function autoLogout(dispatch) {
    localStorage.setItem('token-lifetime', Date.now() + LIFE_TIME_TOKEN);
    const timerId = setTimeout(() => {
        dispatch(logout());
        clearTimeout(timerId);
    }, LIFE_TIME_TOKEN);
}

function logoutWarning(dispatch) {
    const timerId = setTimeout(() => {
        dispatch({type: AUTH_WARNING});
        clearTimeout(timerId);
    }, LIFE_TIME_TOKEN - 60000);

}

export function authLogin(token) {
    return {
        type: AUTH_SUCCESS,
        token
    }
}

export function authRegister(register) {
    return {
        type: REGISTER_SUCCESS,
        register
    }
}

export function logout() {
    localStorage.removeItem('token-lifetime');
    return {
        type: AUTH_LOGOUT
    }
}

export function authError(error) {
    return {
        type: AUTH_ERROR,
        error: error.message
    }
}

export function clearAuthError() {
    return {
        type: CLEAR_AUTH_ERROR
    }
}

export function authAsGuest() {
    return {
        type: MEET_GUEST
    }
}

