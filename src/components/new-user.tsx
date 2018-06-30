import * as React from 'react';
import Field from "./field";
import './new-user.css';
import {Link} from "react-router-dom";

interface INewUserProps {
    onCreateNewUser(user:{name:string, age?:number, password:string}):Promise<{user:{name:string, age:string, id:string}}>
    history:any;
}

interface INewUserState {
    user: {name: string, age?:number, password: string},
    message?:string
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
                    ...this.state.user,
                    [fieldName]: value
                }
            }
        })
    };

    private onCreateNewUser = async () => {
        try{
            const result = await this.props.onCreateNewUser(this.state.user);
            if(result.user){
                const id = result.user.id;
                this.props.history.push(id);
                this.setState({message:"User created successfully"});
            }
            else{
                this.setState({message:"Username already exist, choose a different name"});
            }
        }
        catch(e){
            this.setState({message:"Create user failed"});
        }
    };

    render(){
        return(
            <>
                <Link to='/users'><button className="new-user-back-btn">Back</button></Link>
                <div className='new-user-wrapper'>
                    <h2 className='new-user-header'>Create new user</h2>
                    <Field name={'name'} type={'text'} onChange={this.updateField}/>
                    <Field name={'age'} type={'number'} onChange={this.updateField}/>
                    <Field name={'password'} type={'password'} onChange={this.updateField}/>
                    <p hidden={!this.state.message}>{this.state.message}</p>
                    <button onClick={this.onCreateNewUser} className="create-new-user-btn"
                            disabled={!this.state.user.name || !this.state.user.password} type="button">Create</button>
                </div>
            </>
        )
    }
}

export default NewUser;