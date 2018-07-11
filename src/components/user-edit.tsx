import * as React from 'react';
import Field from "./field";
import './user-edit.css';
import {Link} from "react-router-dom";
import {IClientUser} from "../interfaces";

interface IUserEditProps {
    location:any,
    onEditUserDetails(user:IClientUser):Promise<void>}

interface IUserEditState {
    user: {
        name:string,
        age?:number,
        id:string,
        password?:string
    },
    message?:string
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

    public save = async () => {
        try{
            await this.props.onEditUserDetails(this.state.user);
            this.setState({message:"Users details updated successfully"});
        }
        catch (e) {
            this.setState({message:"Update user details failed"});
        }
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

    render(){
        return(
            <div>
                <Link to='/users'><button className="edit-user-back-btn">Back</button></Link>
                <div className="edit-user-wrapper">
                    <h3 className="edit-user-name">Edit {this.state.user.name}'s details</h3>
                    <Field name={'age'} type={'number'} user={this.state.user.age}
                           onChange={this.updateField}/>
                    <Field name={'password'} type={'password'} onChange={this.updateField}/>
                    <button className="edit-user-save-btn" type="button" onClick={this.save}>Save</button>
                    <p hidden={!this.state.message}>{this.state.message}</p>
                </div>
            </div>
        )
    }
}

export default UserEdit;