import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {APP_NAME} from "../constants";
import {connect} from "react-redux";
import {logout} from "../redux/actions/auth";

const AuthNav = ({guest, logout}) => {
    if (guest) {
        return (

            <nav>
                <div className="nav-wrapper grey darken-1  ">
                    {guest ? <span className="brand-logo">{APP_NAME}</span> : <Link onClick={() => {
                        logout()
                    }} to="/" className="brand-logo">{APP_NAME}</Link> }

                </div>
            </nav>

        )
    } else {
        return (

            <nav>
                <div className="nav-wrapper grey darken-1">
                    <Link to="/" className="brand-logo">{APP_NAME}</Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li><NavLink to="/login" activeClassName="active-link">Login</NavLink></li>
                        <li><NavLink to="/register" activeClassName="active-link">Registration</NavLink></li>
                    </ul>
                </div>
            </nav>

        )
    }

};
const mapStateToProps = ({auth}) => {
    return {
        guest: auth.guest
    }
};
const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout())
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AuthNav)

