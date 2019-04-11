import React from 'react';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {isMobile} from "react-device-detect";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";
import Category from "../components/Category";
import Loader from "../components/Loader";
import Order from "../components/Order";
import withCategories from "../hoc/withCategories";


class OrderPage extends React.Component {
    state = {
        openModal: false
    };

    render() {
        const {loading, categories, history, order} = this.props;
        const {openModal} = this.state;
        const content = categories && categories.length ?
            categories.map(({name, id, imageSrc}, index) => {
                return (
                    <Category
                        showAll
                        key={id}
                        id={id}
                        index={index}
                        name={name}
                        imageSrc={imageSrc}
                        onClickHandler={(id) => {
                            history.push(`order/${id}`)
                        }}
                    />
                )
            })
            : <li>No categories</li>;
        const loader = loading ? <Loader/> : null;
        return (
            <>
            <Sidebar/>
            <main className={`content ${isMobile ? 'content-mobile' : ''}`}>
                <div className={`page-title ${isMobile ? 'page-title-mobile' : ''}`}>
                    <h4>Order</h4>
                    <button onClick={() => this.setState({openModal: !this.state.openModal})}
                            className="waves-effect btn grey darken-1"
                            disabled={!order.length} >
                        To complete
                    </button>
                </div>
                <ul className={`frow order-row ${isMobile ? 'mobile-list' : ''}`}>
                    {loader || content}
                </ul>
            </main>
            <Order openModal={openModal}/>
            <FloatingButton/>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        order: state.order.orders
    }
};

export default connect(mapStateToProps)(withRouter(withCategories(OrderPage)))