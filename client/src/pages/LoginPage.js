import React from 'react';
import Form from "../components/Form";
import AuthNav from "../components/AuthNav";
import withErrorMessages from "../hoc/withErrorMessages";

const LoginPage = (props) =>{
    return (
        <>
            <AuthNav/>
            <Form {...props} authRole="login"/>
        </>
    )
};
export default withErrorMessages(LoginPage)