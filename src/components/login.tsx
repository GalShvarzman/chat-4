import * as React from 'react';
import {Link} from 'react-router-dom';
import Field from './field';
import './login.css'
import {setErrorMsg} from "../state/actions";
import {store} from "../state/store";

interface ILoginProps {
    onSubmit(user: {name:string, password:string}):void,
    errorMsg: string | null
}

interface ILoginState {
    user: {name:string, password:string}
}

class Login extends React.PureComponent<ILoginProps, ILoginState> {

    constructor(props:ILoginProps){
        super(props);
        this.state = {
            user: {name: '', password: ''}
        };
    }

    public updateField = (fieldName: string, value: string) => {
        this.setState(prevState => {
            return {
                user: {
                    ...prevState.user,
                    [fieldName]: value
                }
            }
        })
    };

    componentWillUnmount(){
        store.dispatch(setErrorMsg(null));
    }

    public submitHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onSubmit(this.state.user);
    };

    public render() {
        return (
            <div className="login-wrapper">
                <div className="login-form-wrapper">
                    <form className="login-form">
                        <div>
                            <Link to='/'><button className='login-X'>X</button></Link>
                        </div>
                        <div className="login-fields">
                            <Field className="login-field" name={'name'} type={'text'} onChange={this.updateField}/>
                            <Field className="login-field" name={'password'} type={'password'} onChange={this.updateField}/>
                            <button className="login-btn" disabled={!this.state.user.name || !this.state.user.password}
                                    type="button" onClick={this.submitHandler}>Login</button>
                            <p className="login-err-msg" hidden={!this.props.errorMsg}>{this.props.errorMsg}</p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Login;