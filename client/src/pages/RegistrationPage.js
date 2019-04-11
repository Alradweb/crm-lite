import React from 'react';
import Form from "../components/Form";
import AuthNav from "../components/AuthNav";
import withErrorMessages from "../hoc/withErrorMessages";


const  RegistrationPage = (props) =>{
    return (
        <>
            <AuthNav/>
            <Form {...props} authRole="registration"/>
        </>
    )
};

export default withErrorMessages(RegistrationPage)
