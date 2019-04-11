import React from 'react';
import moment from "moment";
import {CURRENCY} from "../constants";

const OverviewContent = ({gain, orders}) => {
    if (!gain || !orders) return null;
    const yesterday = moment(new Date(), 'DD.MM.YYYY').subtract(1, 'days').format('DD.MM.YYYY');
    const compareGain = gain.isHigher ? 'green' : 'red';
    const compareOrders = orders.isHigher ? 'green' : 'red';
    return (
        <>
        <div className="page-title">
            <h4>
                Review yesterday ({yesterday})
            </h4>
        </div>

        <div className="row">
            <div className="col s12 l6">
                <div className="card light-blue lighten-2 white-text">
                    <div className="card-content">
                        <span className="card-title">Gain:</span>
                        <h3>{gain.yesterday} {CURRENCY}</h3>
                        <h3 className={`${compareGain}-text text-darken-2 m0 mb1`}>
                            <i className="material-icons">{gain.isHigher ? 'arrow_upward' : 'arrow_downward'}</i>
                            {gain.percent}%
                        </h3>
                        <p>{`Your business revenue yesterday ${gain.isHigher ? 'was' : 'is'} ${gain.percent}%
                        ${gain.isHigher ? 'above' : 'below'} average: ${CURRENCY} ${gain.compare} per day`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="col s12 l6">
                <div className="card orange lighten-2 white-text">
                    <div className="card-content">
                        <span className="card-title">Orders:</span>
                        <h3>{orders.yesterday} ord.</h3>
                        <h3 className={`${compareOrders}-text m0 mb1`}>
                            <i className="material-icons">{orders.isHigher ? 'arrow_upward' : 'arrow_downward'}</i>
                            {orders.percent}%
                        </h3>
                        <p>{`The number of orders yesterday is ${orders.percent}%
                             ${orders.isHigher ? 'higher than' : 'below'} the average: ${orders.compare} ord. in a day
                            `}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
};
export default OverviewContent;
