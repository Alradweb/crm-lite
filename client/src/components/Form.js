import React from 'react';
import Input from "./Input";
import {isDisabled, validateControl} from "../utils/validation";
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux';
import {auth} from "../redux/actions/auth";

class Form extends React.Component {


    initialState = () =>{
        return  {
            email: {
                value: '',
                touched: false,
                isValid: false
            },
            password: {
                value: '',
                touched: false,
                isValid: false
            }
        }
    };
    state = this.initialState();
    emailRef = React.createRef();
    passwordRef = React.createRef();
    componentDidMount(){
         if(this.props.guest && !this.props.token){
             this.letGuest()
         }
    }
    letGuest = () =>{
        const enterGuestPassword = () => {
            const password = 'abcdef';
            let num = 0;
            let value = password[num];
            const int = setInterval(() => {
                let newPassword = {
                    value ,
                    touched: true,
                    isValid: validateControl('password', value)};
                this.passwordRef.current.focus() ;
                this.setState({password : newPassword});
                num += 1;
                value += password[num];
                if(num >= password.length){
                    clearInterval(int);
                    this.passwordRef.current.blur();
                    this.onClickHandler()
                }
            },600);
        };
        const enterGuestEmail = (cb) =>{
            const email = 'john_doe@good.men';
            let num = 0;
            let value = email[num];
            const int = setInterval(() => {
                let newEmail = {
                    value ,
                    touched: true,
                    isValid: validateControl('email', value)};
                this.emailRef.current.focus() ;
                this.setState({email : newEmail});
                num += 1;
                value += email[num];
                if(num >= email.length){
                    clearInterval(int);
                    cb()
                }
            },300);


        };
        enterGuestEmail(enterGuestPassword);
    };
    onSubmitHandler = ev => ev.preventDefault();

    onClickHandler = () =>{
        let user = {
            email: this.state.email.value,
            password: this.state.password.value
        };
        if(this.props.guest){
            user = {
                email: 'email@good.gde',
                password: '11111'
            };
        }
        this.setState(this.initialState());
        const isLoginForm = this.props.authRole === 'login';
        this.props.auth(user,isLoginForm);
    };

    onChangeHandler = (ev) =>{
        const control = ev.target.name;
        const newControl = {...this.state[control]};
        newControl.value = (ev.target.value).trim();
        newControl.touched = true;
        newControl.isValid = validateControl(control, ev.target.value);
        this.setState({
             [control] : newControl
        })
    };
    render() {
        const{emailRef, passwordRef, onSubmitHandler, onChangeHandler, onClickHandler} = this;
        const{authRole, token, register} = this.props;
        const{email, password} = this.state;
        const role = authRole === 'login';
        if(token) return  <Redirect to="/overview"/>;
        if(register && !role) return <Redirect  to="/login"/>;

        return (
            <form onSubmit={onSubmitHandler} className="auth-block">
                <div className="card">
                    <div className="card-content">
                        <span className="card-title">{role ? 'Sign in' : 'Create an account'}</span>
                        <Input ref={emailRef}
                              onChange={onChangeHandler}
                               value={email.value}
                               name="email"
                               incorrect={email.touched && !email.isValid}
                        />
                        <Input ref={passwordRef}
                              onChange={onChangeHandler}
                               value={password.value}
                               name="password"
                               incorrect={password.touched && !password.isValid}
                        />
                    </div>
                    <div className="card-action">
                        <button
                            onClick={onClickHandler}
                            disabled={!isDisabled(email, password)}
                            type="button"
                            className="modal-action btn waves-effect">
                            {role ? 'Sign in' : 'Create'}
                        </button>
                    </div>
                </div>
            </form>
       )
    }
}

const mapStateToProps = ({auth}) =>{
    return{
        token: auth.token,
        register : auth.register,
        guest: auth.guest
    }
};
const mapDispatchToProps = dispatch => {
    return {
        auth: (user, isLogin) => dispatch(auth(user, isLogin))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Form)
