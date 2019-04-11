import {ADD_ORDER, REMOVE_ORDER, CLEAR_ORDER} from "../actions/actionsTypes";

const initialState = {
    orders: []
};
export default function orderReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_ORDER :
            const index = state.orders.findIndex(item => item.id === action.order.id);
            let newOrders;
            if (state.orders.length && index > -1) {
                const oldPosition = state.orders[index];
                const quantity = oldPosition.quantity + action.order.quantity;
                const newPosition = {...oldPosition, quantity};
                newOrders = [...state.orders.slice(0, index), newPosition, ...state.orders.slice(index + 1)];
            } else {
                newOrders = [...state.orders, action.order]
            }
            return {
                ...state, orders: newOrders
            };
        case REMOVE_ORDER :
            const idx = state.orders.findIndex(item => item.id === action.id);
            const withoutOrder = [...state.orders.slice(0, idx),
                ...state.orders.slice(idx + 1)];
            return {
                ...state, orders: withoutOrder
            };
        case CLEAR_ORDER :
            return {
                ...state, orders: []
            };
        default :
            return state
    }
}

