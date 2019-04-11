import React from 'react';
import {Link} from "react-router-dom";
import {MContext} from '../services/m_service';

 class FloatingButton extends React.Component {
    floatingBtn = React.createRef();
    componentDidMount(){
        this.context.FloatingActionButton.init(this.floatingBtn.current);
    }
    render() {
        return (
            <div ref={this.floatingBtn} className="fixed-action-btn">
                <button type="button" className="btn-floating btn-large red">
                    <i className="large material-icons">add</i>
                </button>
                <ul>
                    <li>
                        <Link to="/order" className="btn-floating green">
                            <i className="material-icons">assignment</i>
                        </Link>
                    </li>
                    <li>
                        <Link to="/categories" className="btn-floating blue">
                            <i className="material-icons">list</i>
                        </Link>
                    </li>
                </ul>
            </div>
       )
    }
}
FloatingButton.contextType = MContext;
export default FloatingButton