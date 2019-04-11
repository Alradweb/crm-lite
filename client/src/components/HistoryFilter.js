import React from 'react';
import {isMobile} from "react-device-detect";
import {MContext} from '../services/m_service';

class HistoryFilter extends React.Component {
    state = {
        name: ''
    };

    componentDidMount() {
        const options = {showClearBtn: true, format: 'dd.mm.yyyy', onClose: this.onCloseDatepicker};
        this.pickerInstanceStart = this.context.Datepicker.init(this.start.current, options);
        this.pickerInstanceEnd = this.context.Datepicker.init(this.end.current, options);

    };

    componentWillUnmount() {
        this.pickerInstanceStart.destroy();
        this.pickerInstanceEnd.destroy();
    };

    start = React.createRef();
    end = React.createRef();

    onCloseDatepicker = () => {
        const {name} = this.state;
        const value = this[name].current.value;
        this.context.updateTextFields();
        this.props.changeFilter({name, value})
    };
    onClickHandler = (ev) => {
        const {name} = ev.target;
        if (name === 'start') {
            this.pickerInstanceStart.open();
        } else {
            this.pickerInstanceEnd.open();
        }
        this.setState({name})
    };
    onSubmitHandler = ev => ev.preventDefault();

    render() {

        const {onSubmitHandler, onClickHandler} = this;
        const {open, changeFilter, submitFilter, order, isBtnDisabled} = this.props;
        return (
            <form onSubmit={onSubmitHandler} className={open ? 'filter' : 'hide'}>
                <div className={`${isMobile ? 'fr-mobile' : 'fr'}`}>
                    <div className="col order fr-order">
                        <div className="input-field inline order-position-input">
                            <input
                                   onChange={(ev) => changeFilter({name: ev.target.name, value: ev.target.value})}
                                   value={order} name="order" type="number" id="number" min="1"/>
                            <label htmlFor="number">Order number</label>
                        </div>
                    </div>
                    <div className="col filter-pickers ">
                        <div className="input-field">
                            <input ref={this.start} onClick={onClickHandler} id="start" name="start" type="text"/>
                            <label htmlFor="start">Start</label>
                        </div>

                        <div className="input-field ">
                            <input ref={this.end} onClick={onClickHandler} name="end" id="end" type="text"/>
                            <label htmlFor="end">End</label>
                        </div>
                    </div>
                </div>

                <button onClick={submitFilter} className="btn waves-effect wavers-light btn-small"
                        disabled={isBtnDisabled}>Apply filter
                </button>
            </form>
        )
    }


}

HistoryFilter.contextType = MContext;

export default HistoryFilter

