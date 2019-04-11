import {ADD_ORDER, REMOVE_ORDER, CLEAR_ORDER} from "./actionsTypes";

export function addOrder(order) {
    return{
        type: ADD_ORDER,
        order
    }
}

export function removeOrder(id) {
    return{
        type: REMOVE_ORDER,
        id
    }
}
export function clearOrder() {
    return{
        type: CLEAR_ORDER
    }
}
