import React from 'react';
import {connect} from "react-redux";
import {NavLink, Link, withRouter} from "react-router-dom";
import {logout} from "../redux/actions/auth";
import {APP_NAME} from "../constants";
import {isMobile} from "react-device-detect";
import {MContext} from '../services/m_service';

class Sidebar extends React.Component {
    static defaultProps = {
        links: [
            {url: '/overview', name: 'Overview'},
            {url: '/analytics', name: 'Analytics'},
            {url: '/history', name: 'History'},
            {url: '/order', name: 'Add order'},
            {url: '/categories', name: 'Assortment'}
        ]
    };
    navMobile = React.createRef();

    componentDidMount() {
        this.instance = this.context.Sidenav.init(this.navMobile.current);
    }

    makeDelay = (ev, url) => {
        ev.preventDefault();
        if (isMobile) this.instance.close();
        setTimeout(() => {
            this.props.history.push(url)
        }, 300)
    };
    onCloseMenu = () => {
        this.instance.close();
        this.props.logout();
    };

    render() {
        const {onCloseMenu} = this;
        const {links} = this.props;
        const menu = links.map(({url, name}) => {
            return <li key={url} className="bold">
                <NavLink to={url}
                         onClick={(ev) => this.makeDelay(ev, url)}
                         className="waves-effect waves-orange"
                         activeClassName="active-link">
                    {name}
                </NavLink>
            </li>
        });
        if (isMobile) {
            return (
                <>
                <nav ref={this.navNode}>
                    <div className="nav-wrapper grey darken-1">
                        <button onClick={() => this.instance.open()} data-target="slide-out"
                                className="sidenav-trigger btn mobile-button"><i className="material-icons">menu</i>
                        </button>
                        <Link onClick={() => {
                            logout()
                        }} to="/" className="brand-logo">{APP_NAME}</Link>
                        <ul ref={this.navMobile} id="slide-out" className="sidenav">
                            {menu}
                            <li>
                                <div className="divider"/>
                            </li>
                            <li onClick={onCloseMenu} className="bold last">
                                <Link to="/" className="waves-effect waves-orange">Log out</Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                </>
            )
        }
        return (
            <div className="sidenav sidenav-fixed a-sidenav ">
                <Link onClick={() => {
                    this.props.logout()
                }} to="/" className=" bold waves-effect waves-orange"><h4>{APP_NAME}</h4></Link>
                <ul>
                    {menu}
                    <li onClick={() => {
                        this.props.logout()
                    }} className="bold last">
                        <Link to="/" className="waves-effect waves-orange">Log out</Link>
                    </li>
                </ul>
            </div>
        )
    }


}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout())
    }
};
Sidebar.contextType = MContext;
export default withRouter(connect(null, mapDispatchToProps)(Sidebar))


