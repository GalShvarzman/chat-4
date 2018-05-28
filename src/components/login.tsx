import * as React from 'react';
import {Link} from 'react-router-dom';
import Field from './field';
import {ERROR_MSG} from '../App'
import './login.css'

interface ILoginProps {
    state:{},
    onSubmit: (user: {}) => void,
    loginStatus: ERROR_MSG
}

interface ILoginState {
    user: {name:string, password:string}
}

class Login extends React.Component<ILoginProps, ILoginState> {

    private messages = {
        [ERROR_MSG.allGood]: 'you\'re logged in!!!',
        [ERROR_MSG.credentials]: 'username or password are wrong!',
        [ERROR_MSG.locked]: 'you\'re locked!!'
    };

    private colors = {
        [ERROR_MSG.allGood]: 'green',
        [ERROR_MSG.credentials]: 'red',
        [ERROR_MSG.locked]: 'red'
    };

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
                    ...this.state.user,
                    [fieldName]: value
                }
            }
        })
    };

    public submitHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
        this.props.onSubmit(this.state.user);
    };



    public render() {
        return (
            <section>
                <div className="login-form-wrapper">
                    <form className="login-form">
                        <Link to='/'><button className='login-X'>X</button></Link>
                        <div className="login-fields">
                            <Field className="login-field" name={'name'} type={'text'} onChange={this.updateField}/>
                            <Field className="login-field" name={'password'} type={'password'} onChange={this.updateField}/>
                            <button className="login-btn" disabled={!this.state.user.name || !this.state.user.password} type="button" onClick={this.submitHandler}>Login</button>
                        </div>
                        <p style={{color:this.colors[this.props.loginStatus]}}>{this.messages[this.props.loginStatus]}</p>
                    </form>
                </div>
            </section>
        );
    }
}

export default Login;