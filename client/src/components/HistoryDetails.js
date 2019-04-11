import React from 'react';
import {CURRENCY} from "../constants";

const HistoryDetails = ({order, modalClose}) => {
    return (
        <>
        <div className="modal-content">
            <h4 className="mb1">Order №{order.orderNumber}</h4>
            <table className="highlight">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Cost ({CURRENCY})</th>
                </tr>
                </thead>
                <tbody>
                {order.list.map((item) => {
                    return (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.cost}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <div className="order-summary">
                <p>Total: <strong>{order.orderSummary}</strong></p>
            </div>
        </div>
        <div className="modal-footer">
            <button onClick={modalClose} className="modal-action waves-effect waves-black btn-flat">Close</button>
        </div>
        </>
    )
};

export default HistoryDetails