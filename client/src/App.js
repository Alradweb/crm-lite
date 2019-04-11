import React, {Component} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {connect} from "react-redux";
import './App.css';
import checkAuth from "./utils/checkAuth";
import {logout} from "./redux/actions/auth";
import {MContext} from './services/m_service';
import MainPage from "./pages/MainPage/MainPage";
import Overview from "./pages/Overview";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import HistoryPage from "./pages/HistoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryDetails from "./pages/CategoryDetails";
import OrderPage from "./pages/OrderPage";
import OrderPositionsPage from "./pages/OrderPositionsPage";
import NotFound from "./pages/404";



class App extends Component {
    componentDidMount() {
        checkAuth(this.props.logout);
    }
    componentDidUpdate(prevProps){
        const{warning} = this.props;
        if(warning !== prevProps.warning && warning){
            this.context.showMessage(warning)
        }
    }
    render() {
        const {isAuthenticated} = this.props;
        //console.log('isAuthenticated ', !!isAuthenticated);
        if (!isAuthenticated) {
            return (
                <>
                <Router>
                    <Switch>
                        <Route path="/" exact render={() => <MainPage/>}/>
                        <Route path="/login" exact render={() => <LoginPage/>}/>
                        <Route path="/register" exact render={() => <RegistrationPage/>}/>
                        <Route render={() => <Redirect to="/login"/>}/>
                    </Switch>
                </Router>
                </>
            )
        }
        return (
            <>
            <Router>
                <Switch>
                    <Route path="/" exact render={() => <MainPage/>}/>
                    <Route path="/login" exact render={() => <LoginPage/>}/>
                    <Route path="/register" exact render={() => <RegistrationPage/>}/>
                    <Route path="/overview" exact render={() => <Overview/>}/>
                    <Route path="/analytics" exact render={() => <AnalyticsPage/>}/>
                    <Route path="/history" exact render={() => <HistoryPage/>}/>
                    <Route path="/categories" exact render={() => <CategoriesPage/>}/>
                    <Route path="/categories/new" exact render={() => <CategoryDetails id="new"/>}/>
                    <Route path="/categories/:id" render={({match}) => {
                        return <CategoryDetails id={match.params.id}/>
                    }}/>
                    <Route path="/order" exact render={() => <OrderPage/>}/>
                    <Route path="/order/:id" render={({match}) => {
                        return <OrderPositionsPage id={match.params.id}/>
                    }}/>
                    <Route render={() => <NotFound/>}/>
                </Switch>
            </Router>
            </>
        );
    }
}

App.contextType = MContext;

const mapStateToProps = ({auth}) => {
    return {
        isAuthenticated: auth.token,
        warning: auth.warning
    }
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
