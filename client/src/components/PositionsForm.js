import React from 'react';
import {connect} from "react-redux";
import HttpService from "../services/httpservice";
import {MContext} from '../services/m_service';
import Loader from "./Loader";
import Position from './Position';
import {isNumeric} from "../utils/validation";

const {getPositionsById, createPosition, updatePosition, removePosition} = new HttpService();



class PositionsForm extends React.Component {
    state = {
        editablePosition: {
            positionId: '',
            index: null,
            name: '',
            cost: ''
        },
        loading: false
    };

    modal = React.createRef();
    componentDidMount() {
        this.modalForm = this.context.Modal.init(this.modal.current,{onCloseEnd: this.clearEditablePosition});
    };
    componentDidUpdate(prevProps) {
        this.context.updateTextFields();
        const {id} = this.props;
        if (id !== prevProps.id && id !== 'new') {
            this.getPositions(id);
        }
    }
    componentWillUnmount() {
        this.modalForm.destroy();
    };
    onSubmitHandler = ev => ev.preventDefault();

    getPositions = (id) => {
        this.setState({loading: true});
        getPositionsById(id)
            .then(data => {
                if(data.message) {
                    this.context.showMessage(data.message);
                }else {
                    this.props.receivePositions(data);
                }
                this.setState({loading: false});
            })
    };
    selectedPosition = (index) =>{
        const{positionId, name, cost} = this.props.positions[index];
        this.setState({editablePosition: {index, name, cost, positionId}});
        this.modalForm.open()
    };
    clearEditablePosition = () =>{
        const clear = {
            positionId: '',
            index: null,
            name: '',
            cost: ''
        };
        this.setState({
            editablePosition: clear
        })
    };
    changePositionValue = (ev) =>{
        const{name, value}= ev.target;
        this.setState(({editablePosition}) => {
            const newPosition = {...editablePosition, [name] : value };
            return {editablePosition: newPosition}
        });

    };
    onDeletePosition = (positionId, name) =>{
        const confirmation = window.confirm(`Are you sure you want to delete a position "${name}" ?`);
        if (!confirmation) return;
        if(this.props.guest){
            this.context.showMessage('Access is denied. Register or login.');
            return;
        }
        removePosition(positionId)
            .then((data) =>{
                this.context.showMessage(data.message);
                this.getPositions(this.props.id)
            })
    };
    savePosition = () =>{
        this.modalForm.close();
        if(this.props.guest){
            this.context.showMessage('Access is denied. Register or login.');
            return;
        }
        if(this.state.editablePosition.positionId){
            updatePosition(this.state.editablePosition.positionId, this.state.editablePosition)
                .then( data => processData(data))
        }else{
            createPosition(this.state.editablePosition, this.props.id)
                .then( data => processData(data))
        }
        const processData = (data) =>{
            this.context.showMessage(data.message);
            this.getPositions(data.category);
            this.clearEditablePosition();
        }
    };
    render() {
        const{changePositionValue, onDeletePosition, savePosition} = this;
        const {id, positions} = this.props;
        const {loading, editablePosition: {name, cost, index}} = this.state;
        const positionsList = positions.length && id !== 'new' ? positions.map((pos, idx) => {
            return <Position key={pos.name + idx}
                             positionId={pos.positionId}
                             name={pos.name}
                             cost={pos.cost}
                             index={idx}
                             onDeletePosition={onDeletePosition}
                             selectedPosition={this.selectedPosition}/>
        }) : <p>There are no items in this category.</p>;
        return (
            <>
            <div className="row">
                <div className="col s12 mb-pf">
                    <div className="page-subtitle">
                        <h4>Positions:</h4>
                        <button onClick={()=>{this.modalForm.open()}}
                                type="button" className="waves-effect waves-light btn grey darken-1 btn-small"
                                disabled={id === 'new'}>
                            Add position
                        </button>
                    </div>
                    <ul >
                    {loading ? <Loader/> : positionsList}
                    </ul>
                </div>
            </div>

            <form ref={this.modal}
                  onSubmit={this.onSubmitHandler}
                  id="create-modal"
                  className="modal">
                <div className="modal-content">
                    <h4 className="mb1">{index === null ? 'Add' : 'Edit'} position </h4>
                    <div className="input-field">
                        <input onChange={changePositionValue} id="pos_name" type="text" value={name} name="name" required/>
                        <label htmlFor="pos_name">Name</label>
                    </div>
                    <div className="input-field">
                        <input onChange={changePositionValue}  id="pos_cost" type="number" value={cost} name="cost" required/>
                        <label htmlFor="pos_cost">Cost</label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={() => this.modalForm.close()}
                            type="button"
                            className="modal-action waves-effect waves-black btn-flat">
                        Cancel
                    </button>
                    <button onClick={savePosition}
                             type="button" className="modal-action btn waves-effect" disabled={!name || !isNumeric(cost)}>
                        Save
                    </button>
                </div>
            </form>
            </>
        )
    }
}
PositionsForm.contextType = MContext;
const mapStateToProps = ({auth}) => {
    return {
        guest: auth.guest
    }
};
export default connect(mapStateToProps)(PositionsForm)