import React from 'react';
import HttpService from "../services/httpservice";
import {MContext} from '../services/m_service';
import {isMobile} from "react-device-detect";
import Loader from "../components/Loader";
import Sidebar from "../components/Sidebar";
import FloatingButton from "../components/FloatingButton";
import OverviewContent from "../components/OverviewContent";

const {getOverview} = new HttpService();

class Overview extends React.Component {

    state = {
        data: {},
        loading: false
    };
    controller = new AbortController();
    signal = this.controller.signal;

    componentDidMount() {
        this.getData();
    };

    componentWillUnmount() {
        this.controller.abort();
    }

    getData = () => {
        this.setState({loading: true});
        getOverview(this.signal)
            .then((data) => {
                if (data.message) {
                    if (data.message.includes('aborted')) return;
                    this.context.showMessage(data.message);
                    this.setState({loading: false});
                    return
                }
                this.setState({
                    data: data,
                    loading: false
                })
            });
    };


    render() {
        const {loading, data: {gain, orders}} = this.state;
        const content = loading ? <Loader/> : <OverviewContent gain={gain} orders={orders}/>;
        return (
            <>
            <Sidebar/>
            <main className={`content ${isMobile ? 'content-mobile' : ''}`}>
                {loading ? (
                    <div className="page-title">
                        <h4>
                            Review yesterday
                        </h4>
                    </div>
                ) : null}
                {content}
            </main>
            <FloatingButton/>
            </>
        )
    }

}

Overview.contextType = MContext;

export default Overview


