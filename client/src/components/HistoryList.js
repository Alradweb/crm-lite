import React from 'react';
import HttpService from "../services/httpservice";
import {MContext} from '../services/m_service';
import Loader from "./Loader";
import HistoryDetails from "./HistoryDetails";
import HistoryOrder from "./HistoryOrder";
import {CURRENCY} from "../constants";


const {getOrders} = new HttpService();

class HistoryList extends React.Component {

    static defaultProps = {
        step: 3
    };

    initialState = () => {
        return {
            orders: [],
            loading: false,
            reloading: false,
            loadParams: {offset: 0, limit: this.props.step},
            ordersEnded: false,
            modal: null
        }
    };
    state = this.initialState();
    controller = new AbortController();
    signal = this.controller.signal;
    modal = React.createRef();

    componentDidMount() {
        this.modalInstance = this.context.Modal.init(this.modal.current, {onCloseStart: () => this.setState({modal: null})});
        this.setState({loading: true});
        this.loadOrders(this.state.loadParams, false);
    };

    componentWillUnmount() {
        this.modalInstance.destroy();
        this.controller.abort();
    };

    componentDidUpdate(prevProps) {
        if (this.props.filterOptions !== prevProps.filterOptions) {
            this.applyFilter(this.props.filterOptions);
        }
    }

    applyFilter = (options) => {
        if (options === null) return;
        this.setState(this.initialState());
        this.setState({
            loading: true
        });
        this.loadOrders(options, true);
    };

    loadOrders = (params, filter) => {
        this.setState({reloading: true});
        getOrders(params, this.signal)
            .then((data) => {
                if (data.message) {
                    if(data.message.includes('aborted')) return;
                    this.context.showMessage(data.message);
                    this.setState({loading: false});
                    return
                }
                if (filter) {
                    this.setState({
                        orders: data,
                        loading: false,
                        reloading: false,
                        ordersEnded: true
                    });
                    return
                }
                this.setState(({orders, loadParams}) => {
                    const newOrders = orders.concat(data);
                    const newParams = {...loadParams, offset: loadParams.offset + this.props.step};
                    return {
                        orders: newOrders,
                        loading: false,
                        reloading: false,
                        loadParams: newParams,
                        ordersEnded: data.length < this.props.step
                    }
                });
            })
    };

    showDetails = (id) => {
        const idx = this.state.orders.findIndex(item => item.id === id);
        const modalData = this.state.orders[idx];
        this.setState({
            modal: modalData
        });
        this.modalInstance.open();
    };
    modalClose = () => {
        this.modalInstance.close();
    };
    loadMore = () => {
        this.loadOrders(this.state.loadParams, false);
    };

    render() {
        const {showDetails, loadMore, modalClose} = this;
        const {loading, reloading, orders, ordersEnded, modal} = this.state;
        const reload = reloading ? <Loader/> : (<div className="center mb2">
            <button onClick={loadMore} className="btn waves-effect grey darken-1 btn-small mb-btn">Load more</button>
        </div>);
        const orderList = orders.length ?
            orders.map(({id, orderNumber, date, orderSummary}) => {
                return <HistoryOrder key={id}
                                     id={id}
                                     orderNumber={orderNumber}
                                     date={date}
                                     orderSummary={orderSummary}
                                     showDetails={showDetails}/>
            }) : <tr>
                <td>no orders</td>
            </tr>;
        return (
            <>
            {loading ? <Loader/> :
                <>
                <table className={`highlight mb2 ${ordersEnded ? 'mb-tbl' : ''}`}>
                    <thead>
                    <tr>
                        <th>№</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Total({CURRENCY})</th>
                        <th>???</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderList}
                    </tbody>
                </table>
                {ordersEnded ? null : reload}
                </>
            }
            <div ref={this.modal} className="modal modal-fixed-footer">
                {modal && <HistoryDetails order={modal} modalClose={modalClose}/>}
            </div>
            </>
        )
    }
}

HistoryList.contextType = MContext;

export default HistoryList
