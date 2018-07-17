import * as React from 'react';
import {Link} from 'react-router-dom';
import Field from "./field";
import './sign-up.css'
import {setErrorMsg} from "../state/actions";
import {store} from "../state/store";
import {IClientUser} from "../interfaces";

interface ISignUpProps {
    onSubmit(user:IClientUser):void,
    errorMsg:string|null
}

interface ISignUpState {
    user: {name:string, age?:number, password:string}
}

class SignUp extends React.Component<ISignUpProps, ISignUpState> {

    constructor(props:ISignUpProps){
        super(props);
        this.state = {
            user: {name: '', password: ''}
        };
    };

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
                            <p hidden={!this.props.errorMsg}>{this.props.errorMsg}</p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default SignUp;