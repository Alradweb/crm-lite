import React from 'react';
import {MContext} from '../services/m_service';
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {isMobile} from "react-device-detect";
import HttpService from "../services/httpservice";
import {CURRENCY} from "../constants";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";
import Loader from "../components/Loader";
import Order from "../components/Order";
import OrderPosition from "../components/OrderPosition";


const {getPositionsById} = new HttpService();

class OrderPositionsPage extends React.Component {
    state = {
        positions: [],
        loading: false,
        openModal: false
    };
    controller = new AbortController();
    signal = this.controller.signal;
    componentDidMount() {
        const {id} = this.props.match.params;
        this.getPositions(id)
    }
    componentWillUnmount(){
        this.controller.abort();
    }
    getPositions = (id) => {
        this.setState({loading: true});
        getPositionsById(id, this.signal)
            .then(data => {
                if (data.message) {
                    if(data.message.includes('aborted')) return;
                    this.context.showMessage(data.message);
                    this.setState({loading: false});
                } else {
                    this.setState({
                        positions: data,
                        loading: false
                    });
                }
            })
    };
    toggleModal = () => {
        this.setState(state => {
            return {
                openModal: !state.openModal
            }
        })
    };

    render() {
        const {toggleModal} = this;
        const {order} = this.props;
        const {positions, openModal, loading} = this.state;
        const positionsList = positions.length ? positions.map((pos) => {
            return <OrderPosition key={pos.positionId} name={pos.name} cost={pos.cost} positionId={pos.positionId}/>
        }) : <tr>
            <td>No positions</td>
        </tr>;
        return (
            <>
            <Sidebar/>
            <main className={`content ${isMobile ? 'content-mobile ' : ''}`}>
                <div className="page-title">
                    <h4>
                        <Link to="/order">Order</Link>
                        <i className="material-icons">keyboard_arrow_right</i>
                        Add products
                    </h4>
                    <button onClick={toggleModal}
                            className={`waves-effect btn grey darken-1 ${isMobile ? 'fs-mobile ' : ''}`}
                            disabled={!order.length}>
                        To complete
                    </button>
                </div>
                {loading ?
                    <Loader/> :
                    <table className="highlight">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Cost ({CURRENCY})</th>
                            <th>Quantity</th>
                            <th/>
                        </tr>
                        </thead>
                        <tbody>
                        {positionsList}
                        </tbody>
                    </table>
                }
            </main>
            <Order openModal={openModal}/>
            {isMobile ? null : <FloatingButton/>}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        order: state.order.orders
    }
};


const WrappedClass = withRouter(OrderPositionsPage);
WrappedClass.WrappedComponent.contextType = MContext;
export default connect(mapStateToProps)(WrappedClass)
