import * as React from 'react';
import Field from "./field";
import './new-user.css';
import {Link} from "react-router-dom";
import {IClientUser} from "../interfaces";
import {store} from "../state/store";
import {setErrorMsg} from "../state/actions";

interface INewUserProps {
    onCreateNewUser(user:IClientUser):void
    history:any;
    errorMsg:string|null,
    newUser:IClientUser
}

interface INewUserState {
    user: {name: string, age?:number, password: string},
}

class NewUser extends React.Component<INewUserProps,INewUserState>{
    constructor(props:INewUserProps){
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

    private onCreateNewUser = () => {
        this.props.onCreateNewUser(this.state.user);
    };

    componentDidUpdate(prevProps:INewUserProps, prevState:INewUserState){
        if(this.props.newUser !== prevProps.newUser){
            this.props.history.push(this.props.newUser._id);
        }
    }

    componentWillUnmount(){
        store.dispatch(setErrorMsg(null));
    }

    render(){
        return(
            <>
                <Link to='/users'><button className="new-user-back-btn">Back</button></Link>
                <div className='new-user-wrapper'>
                    <h2 className='new-user-header'>Create new user</h2>
                    <Field name={'name'} type={'text'} onChange={this.updateField}/>
                    <Field name={'age'} type={'number'} onChange={this.updateField}/>
                    <Field name={'password'} type={'password'} onChange={this.updateField}/>
                    <p hidden={!this.props.errorMsg}>{this.props.errorMsg}</p>
                    <button onClick={this.onCreateNewUser} className="create-new-user-btn"
                            disabled={!this.state.user.name || !this.state.user.password} type="button">Create</button>
                </div>
            </>
        )
    }
}

export default NewUser;