import React from 'react';
import {connect} from "react-redux";
import {addOrder, clearOrder, removeOrder} from "../redux/actions/order";
import HttpService from "../services/httpservice";
import {MContext} from '../services/m_service';
import {CURRENCY} from "../constants";

const {createOrder} = new HttpService();

const CurrentPosition = ({id, name, cost, quantity, deleteItem}) => {
    return (
        <tr>
            <td>{name}</td>
            <td>{quantity}</td>
            <td>{cost}</td>
            <td><i onClick={() => deleteItem(id)} className="material-icons pointer">delete</i></td>
        </tr>
    )
};

class Order extends React.Component {
    componentDidMount() {
        this.modalForm = this.context.Modal.init(this.modal.current);
    };

    componentWillUnmount() {
        this.modalForm.destroy();
    };

    shouldComponentUpdate(nextProps) {
        if (this.props.currentOrder !== nextProps.currentOrder) return true;
        const update = this.props.openModal !== nextProps.openModal;
        if (update) {
            this.modalForm.open();
        }
        return update
    }

    revokeOrder = () => {
        this.props.clearItem();
        this.modalForm.close();
    };
    submitOrder = () => {
        this.modalForm.close();
        const list = this.props.currentOrder.map((obj) => {
            const {id, ...last} = obj;
            return Object.assign({}, last)
        });
        const order = {
            list
        };
        createOrder(order)
            .then(data => {
                this.context.showMessage(data.message);
                this.props.clearItem();
            })

    };
    removeItem = (id) => {
        this.props.deleteItem(id)
    };
    modal = React.createRef();

    render() {
        const {revokeOrder, submitOrder, removeItem} = this;
        const {currentOrder, orderSummary} = this.props;
        const positionsList = currentOrder.length ? currentOrder.map(pos => {
            return <CurrentPosition key={pos.id}
                                    id={pos.id}
                                    name={pos.name}
                                    cost={pos.cost}
                                    quantity={pos.quantity}
                                    deleteItem={removeItem}/>
        }) : <tr>
            <td>no positions</td>
        </tr>;

        return (
            <div ref={this.modal} className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4 className="mb1">Your order</h4>
                    <table className="highlight">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Cost({CURRENCY})</th>
                            <th/>
                        </tr>
                        </thead>

                        <tbody>
                        {positionsList}
                        </tbody>
                    </table>
                    <div className="order-summary">
                        <p>Total: <strong> {orderSummary}</strong></p>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={revokeOrder} className="modal-action waves-effect waves-black btn-flat">Cancel
                    </button>
                    <button onClick={submitOrder} className="modal-action btn waves-effect"
                            disabled={!currentOrder.length}>Confirm
                    </button>
                </div>
            </div>
        )
    }
}

Order.contextType = MContext;

const mapStateToProps = ({order}) => {
    const currentOrder = order.orders;
    let orderSummary = 0;
    currentOrder.forEach(item => orderSummary += (item.cost * item.quantity));
    return {
        currentOrder,
        orderSummary
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addPosition: order => dispatch(addOrder(order)),
        deleteItem: id => dispatch(removeOrder(id)),
        clearItem: () => dispatch(clearOrder())
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Order)
