import React from 'react';
import {Link} from 'react-router-dom';
import {APP_NAME} from "../../constants";
import {connect} from "react-redux";
import {isMobile} from "react-device-detect";
import {authAsGuest} from "../../redux/actions/auth";
import './svg-styles.css';
import SvgBackground from './SvgBackground'


class MainPage extends React.Component {
    state = {
        navHeight: 70
    };

    navNode = React.createRef();

    componentDidMount() {
        const {bottom, top} = this.navNode.current.getBoundingClientRect();
        this.setState({navHeight: bottom - top});
    }

    meetGuest = () => {
        this.props.authAsGuest();
    };

    render() {
        const {meetGuest} = this;
        const {navHeight} = this.state;
        return (
            <>
            <nav ref={this.navNode}>
                <div className="nav-wrapper grey darken-1 nav-wrapper-pl">
                    {<Link to="/" className={isMobile ? 'logo-mb' : 'logo-app'}>{APP_NAME}</Link>}
                    <ul id="nav-mobile" className="right">
                        <li onClick={meetGuest}><Link to="/login">I'm guest</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Registration</Link></li>
                    </ul>
                </div>
            </nav>
            <SvgBackground navHeight={navHeight}/>
            </>
        )
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        authAsGuest: () => dispatch(authAsGuest())
    }
};
export default connect(null, mapDispatchToProps)(MainPage)