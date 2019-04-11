import React from 'react';
import HttpService from "../services/httpservice";

const {fetchCategories} = new HttpService();

const withCategories = WrappedComponent => {
    return class extends React.Component {
        state = {
            categories: null,
            loading: false,
            error: null
        };

        controller = new AbortController();
        signal = this.controller.signal;

        componentDidMount() {
            this.setState({loading: true});
            fetchCategories(this.signal)
                .then(data => {
                    if (data.message) {
                        if (data.message.includes('aborted')) return;
                        this.setState({loading: false});
                        return
                    }
                    if (!Array.isArray(data)) {
                        this.setState({
                            error: data.message || 'Unknown error',
                            categories: null,
                            loading: false
                        });
                    } else {
                        this.setState({
                            categories: data,
                            loading: false,
                            error: null
                        })
                    }
                })
        }

        componentWillUnmount() {
            this.controller.abort();
        }

        render() {
            return <WrappedComponent categories={this.state.categories}
                                     loading={this.state.loading}
                                     error={this.state.error}
                                     {...this.props}
            />
        }
    }


};
export default withCategories