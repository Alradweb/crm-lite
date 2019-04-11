import React from 'react';
import moment from 'moment';

const HistoryOrder = ({id, orderNumber, date, orderSummary, showDetails}) => {
    return (
        <tr>
            <td>{orderNumber}</td>
            <td>{moment(date).format('DD.MM.YYYY')}</td>
            <td>{moment(date).format('HH:mm:ss')}</td>
            <td>{orderSummary}</td>
            <td>
                <button onClick={() => showDetails(id)} className="btn btn-small grey darken-1"><i
                    className="material-icons">open_in_new</i></button>
            </td>
        </tr>
    )
};

export default HistoryOrder