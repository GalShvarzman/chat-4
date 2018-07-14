import * as React from 'react';
import {Link} from 'react-router-dom';
import Field from "./field";
//import {ERROR_MSG} from "../App";
import './sign-up.css'

interface ISignUpProps {
    onSubmit(user:{name:string, age?:number, password:string}):void,
    //signUpStatus: ERROR_MSG
}

interface ISignUpState {
    user: {name:string, age?:number, password:string}
}

class SignUp extends React.Component<ISignUpProps, ISignUpState> {

    // private messages = {
    //     [ERROR_MSG.allGood]: 'You have successfully registered',
    //     [ERROR_MSG.credentials]: 'Username already exists. Choose a different name',
    //     [ERROR_MSG.fail]:"sign up failed"
    // };
    //
    // private colors = {
    //     [ERROR_MSG.allGood]: 'green',
    //     [ERROR_MSG.credentials]: 'red',
    //     [ERROR_MSG.fail]: 'red'
    // };

    constructor(props:ISignUpProps){
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

    public submitHandler = () => {
        this.props.onSubmit(this.state.user);
    };

    public render() {
        return (
            <div className="sign-up-wrapper">
                <div className="sign-up-form-wrapper">
                    <form className="sign-up-form">
                        <div>
                            <Link to='/'><button className='sign-up-x'>X</button></Link>
                        </div>
                        <div className="sign-up-fields">
                            <Field name={'name'} type={'text'} onChange={this.updateField}/>
                            <Field name={'age'} type={'number'} onChange={this.updateField}/>
                            <Field name={'password'} type={'password'} onChange={this.updateField}/>
                            <button className='sign-up-btn' disabled={!this.state.user.name || !this.state.user.password}
                                    type="button" onClick={this.submitHandler}>Sign up</button>
                            {/*<p>{this.messages[this.props.signUpStatus]}</p>*/}
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignUp;