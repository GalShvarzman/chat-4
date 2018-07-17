import * as React from 'react';
import Field from "./field";
import './user-edit.css';
import {Link} from "react-router-dom";
import {IClientUser} from "../interfaces";
import {setErrorMsg} from "../state/actions";
import {store} from "../state/store";

interface IUserEditProps {
    location:any,
    onEditUserDetails(user:IClientUser):void,
    errorMsg:string|null
}

interface IUserEditState {
    user: {
        name:string,
        age?:number,
        id:string,
        password?:string
    }
}

class UserEdit extends React.PureComponent<IUserEditProps, IUserEditState>{
    constructor(props:IUserEditProps){
        super(props);
        this.state = {
            user:{
                name:props.location.state.user.name,
                age:props.location.state.user.age,
                id:props.location.state.user._id
            }
        }
    }

    public saveUserNewDetails = () => {
        this.props.onEditUserDetails(this.state.user);
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

    render(){
        return(
            <div>
                <Link to='/users'><button className="edit-user-back-btn">Back</button></Link>
                <div className="edit-user-wrapper">
                    <h3 className="edit-user-name">Edit {this.state.user.name}'s details</h3>
                    <Field name={'age'} type={'number'} user={this.state.user.age}
                           onChange={this.updateField}/>
                    <Field name={'password'} type={'password'} onChange={this.updateField}/>
                    <button className="edit-user-save-btn" type="button" onClick={this.saveUserNewDetails}>Save</button>
                    <p hidden={!this.props.errorMsg}>{this.props.errorMsg}</p>
                </div>
            </div>
        )
    }
}

export default UserEdit;