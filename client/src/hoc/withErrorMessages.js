import React from 'react';
import {MContext} from '../services/m_service';
import {connect} from "react-redux";
import {clearAuthError} from "../redux/actions/auth";

const withErrorMessages = (Wrapped) => connect(mapStateToProps, mapDispatchToProps)(class AuthError extends React.Component {

    showErrorMessage = (msg) => {
        this.context.toast({html: msg, displayLength: 5000});
        setTimeout(() => {
            this.props.clearError();
            this.context.updateTextFields();
        }, 0)
    };

    render() {
        AuthError.contextType = MContext;
        const errorMessage = this.props.authError;
        if (!!errorMessage) {
            this.showErrorMessage(errorMessage)
        }
        return (
            <Wrapped  {...this.props}  />
        )
    }

});

const mapStateToProps = ({auth}) => {
    return {
        authError: auth.authError,
        register: auth.register
    }
};
const mapDispatchToProps = dispatch => {
    return {
        clearError: () => dispatch(clearAuthError())
    }
};
export default withErrorMessages

