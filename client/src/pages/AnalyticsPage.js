import React from 'react';
import Chart from 'chart.js';
import {isMobile} from "react-device-detect";
import HttpService from "../services/httpservice";
import {MContext} from '../services/m_service';
import Sidebar from "../components/Sidebar";
import Loader from "../components/Loader";
import FloatingButton from "../components/FloatingButton";
import {CURRENCY} from "../constants";


const {getAnalyticsData} = new HttpService();

class AnalyticsPage extends React.Component {
    static defaultProps = {
        gainConfig: {
            label: 'Gain',
            color: 'rgb(255, 99, 132)'
        },
        ordersConfig: {
            label: 'Orders',
            color: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)'
        }
    };
    state = {
        average: null,
        chart: [],
        loading: false
    };

    gain = React.createRef();
    order = React.createRef();
    controller = new AbortController();
    signal = this.controller.signal;
    componentDidMount() {
        this.setState({loading: true});
        getAnalyticsData(this.signal)
            .then(data => {
                if (data.message) {
                    if(data.message.includes('aborted')) return;
                    this.context.showMessage(data.message);
                    this.setState({loading: false});
                    return
                }
                if(data.chart && data.chart.length){
                    this.setState({
                        average: data.average,
                        chart: data.chart,
                        loading: false
                    });
                    this.drawGainChart(this.gain.current);
                    this.drawOrdersChart(this.order.current)
                }
            })

    };
    componentWillUnmount(){
        this.controller.abort();
    }
    createChartConfig = ({label, color, labels, data}) => {
        return {
            type: 'line',
            options: {
                responsive: true
            },
            data: {
                labels,
                datasets: [
                    {
                        label,
                        data,
                        backgroundColor: color,
                        steppedLine: false,
                        fill: false,
                        borderColor: color,
                        borderWidth: 2
                    }
                ]
            }
        }
    };
    drawGainChart = (elem) => {
        const gainConfig = {
            label: this.props.gainConfig.label,
            color: this.props.gainConfig.color
        };
        gainConfig.labels = this.state.chart.map(item => item.label);
        gainConfig.data = this.state.chart.map(item => item.gain);
        const config = this.createChartConfig(gainConfig);
        return new Chart(elem.getContext('2d'), config)
    };
    drawOrdersChart = (elem) => {
        const {color, label, borderColor} = this.props.ordersConfig;
        return new Chart(elem.getContext('2d'), {
            type: 'bar',
            data: {
                labels: this.state.chart.map(item => item.label),
                datasets: [{
                    label,
                    data: this.state.chart.map(item => item.order),
                    backgroundColor: color,
                    borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    };

    render() {
        const {average, loading} = this.state;
        return (
            <>
            <Sidebar/>
            <main className={`content ${isMobile ? 'content-mobile' : ''}`}>
                <div className="page-title">
                    <h4>Analytics</h4>
                </div>
                {loading ? <Loader/> : (
                    <>
                    <div className="average-price">
                        <p>Average check: <strong>{average} {CURRENCY}</strong></p>
                    </div>

                    <div style={{marginBottom: '20px', height: 'auto'}} className="analytics-block pb3">
                        <h5>Gain</h5>
                        <canvas ref={this.gain} aria-label="Revenue chart"/>
                    </div>

                    <div style={{height: 'auto'}} className="analytics-block">
                        <h5>Orders</h5>
                        <canvas ref={this.order} aria-label="Orders chart"/>
                    </div>
                    </>
                )}

            </main>
            <FloatingButton/>
            </>
        )
    }
}

AnalyticsPage.contextType = MContext;

export default AnalyticsPage


