import React from 'react';
import {connect} from "react-redux";
import {isNumeric} from "../utils/validation";
import {MContext} from '../services/m_service';
import {addOrder} from "../redux/actions/order";


class OrderPosition extends React.Component {

    state = {
        quantity: 1
    };

    componentWillUnmount() {
        this.context.Toast.dismissAll();
    };

    changeQuantity = (ev) => {
        const quantity = ev.target.value;
        if (!isNumeric(quantity) || quantity < 1) return;
        this.setState({
            quantity
        })
    };

    addItem = () => {
        this.props.addPosition({
                id: this.props.positionId,
                name: this.props.name,
                cost: +this.props.cost,
                quantity: +this.state.quantity
            }
        );
        this.context.showMessage(`${this.props.name} successfully added`)
    };

    render() {
        const {changeQuantity, addItem} = this;
        const {quantity} = this.state;
        const {name, cost} = this.props;
        return (
            <tr>
                <td>{name}</td>
                <td>{cost}</td>
                <td>
                    <div className="input-field inline order-position-input">
                        <input onChange={changeQuantity} type="number" value={quantity} min="1"/>
                    </div>
                </td>
                <td>
                    <button onClick={addItem} className="btn waves-effect wavers-light btn-small">Add</button>
                </td>
            </tr>
        )
    }
}
OrderPosition.contextType = MContext;


const mapDispatchToProps = dispatch => {
    return {
        addPosition: order => dispatch(addOrder(order))
    }
};
export default connect(null, mapDispatchToProps)(OrderPosition)