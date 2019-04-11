import React from 'react';
import moment from "moment";
import {MContext} from '../services/m_service';
import {isMobile} from "react-device-detect";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";
import HistoryList from "../components/HistoryList";
import HistoryFilter from "../components/HistoryFilter";


class HistoryPage extends React.Component {

    tooltip = React.createRef();

    state = {
        openFilter: false,
        filter: {
            start: '',
            end: '',
            order: ''
        },
        isBtnDisabled: true,
        filterOptions: null
    };

    componentDidMount() {
        this.hint = this.context.Tooltip.init(this.tooltip.current);
    };

    componentWillUnmount() {
        this.hint.destroy();
    };

    toggleFilter = () => {
        this.hint.close();
        this.setState((state) => {
            return {
                openFilter: !state.openFilter
            }
        })
    };
    _dateHandler = (name, value) => {
        switch (name) {
            case 'start' : {
                if (!value) return '';
                return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DDT00:00:00.000');
            }
            case 'end' : {
                if (!value) return '';
                return moment(value, 'DD.MM.YYYY').format('YYYY-MM-DDT23:59:59.999');
            }
            default:
                return value
        }
    };
    _allFieldsEmpty = filter => Object.keys(filter).every(item => !filter[item]);
    changeFilter = ({name, value}) => {
        const newValue = this._dateHandler(name, value);
        const newFilter = {...this.state.filter, [name]: newValue};
        const {start, end} = newFilter;
        let dateIsValid = true;
        if (start && end) {
            dateIsValid = new Date(start).getTime() <= new Date(end).getTime();
        }
        if (!dateIsValid) this.context.showMessage('Incorrect date');
        this.setState({
            filter: newFilter,
            isBtnDisabled: this._allFieldsEmpty(newFilter) || !dateIsValid
        })
    };
    submitFilter = () => {
        const {filter} = this.state;
        const filterOptions = Object.keys(filter)
            .filter(item => filter[item])
            .reduce((obj, key) => ({...obj, [key]: filter[key]}), {});
        this.setState({
            filterOptions
        })
    };

    render() {
        const {toggleFilter, changeFilter, submitFilter, _allFieldsEmpty} = this;
        const {openFilter, filter, filter: {order}, isBtnDisabled, filterOptions} = this.state;
        const classes = ['btn btn-small'];
        if (openFilter) classes.push('active');
        if (!_allFieldsEmpty(filter)) classes.push('red');
        return (
            <>
            <Sidebar/>
            <main className={`content ${isMobile ? 'content-mobile' : ''}`}>
                <div className="page-title">
                    <h4>Purchase history</h4>
                    <button ref={this.tooltip}
                            data-tooltip={openFilter ? 'Close filter' : 'Open filter'}
                            data-position="left"
                            onClick={toggleFilter}
                            className={classes.join(' ')}>
                        <i className="material-icons">filter_list</i>
                    </button>
                </div>

                <HistoryFilter open={openFilter}
                               changeFilter={changeFilter}
                               submitFilter={submitFilter}
                               order={order}
                               isBtnDisabled={isBtnDisabled}
                />
                <HistoryList filterOptions={filterOptions}/>

            </main>
            <FloatingButton/>
            </>
        )
    }
}

HistoryPage.contextType = MContext;

export default HistoryPage
