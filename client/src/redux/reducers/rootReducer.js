import {combineReducers} from 'redux';
import authReducer from "./authReducer";
import orderReducer from "./orderReducer";

export const rootReducer =  combineReducers({
    auth : authReducer,
    order : orderReducer
});

