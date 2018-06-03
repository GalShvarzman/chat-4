import * as React from 'react';
import {Link} from 'react-router-dom';
import Field from "./field";
import {ERROR_MSG} from "../App";

interface ISignUpProps {
    onSubmit(user:{name:string, age?:number, password:string}):void,
    signUpStatus: ERROR_MSG
}

interface ISignUpState {
    user: {name:string, age?:number, password:string}

}

class SignUp extends React.Component<ISignUpProps, ISignUpState> {

    private messages = {
        [ERROR_MSG.allGood]: 'You have successfully registered',
        [ERROR_MSG.credentials]: 'Username already exists. Choose a different name'
    };

    private colors = {
        [ERROR_MSG.allGood]: 'green',
        [ERROR_MSG.credentials]: 'red'
    };

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
            <div>
                <form>
                    <div>
                        <Link to='/'><button>X</button></Link>
                    </div>
                    <div>
                        <Field name={'name'} type={'text'} onChange={this.updateField}/>
                        <Field name={'age'} type={'number'} onChange={this.updateField}/>
                        <Field name={'password'} type={'password'} onChange={this.updateField}/>
                        <button disabled={!this.state.user.name || !this.state.user.password} type="button" onClick={this.submitHandler}>Sign up</button>
                        <p style={{color:this.colors[this.props.signUpStatus]}}>{this.messages[this.props.signUpStatus]}</p>
                        {/*<input type="text" placeholder="name"/>*/}
                        {/*<input type="number" placeholder="age"/>*/}
                        {/*<input type="password" placeholder="password"/>*/}
                        {/*<Link to='/login'><input type="button" value="Submit"/></Link>*/}
                    </div>
                </form>
            </div>
        );
    }
}

export default SignUp;