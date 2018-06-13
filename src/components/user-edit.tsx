import * as React from 'react';
import Field from "./field";

interface IUserEditProps {
    location:any
}

interface IUserEditState {
    user: {
        name:string,
        age:number,
        id:string,
        password?:string
    }
}

class UserEdit extends React.Component<IUserEditProps, IUserEditState>{
    constructor(props:IUserEditProps){
        super(props);
        this.state = {
            user:{
                name:props.location.state.user.name,
                age:props.location.state.user.age,
                id:props.location.state.user.id
            }
        }
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

    render(){
        return(
            <div>
                <h3>Edit {this.state.user.name}'s details</h3>
                <Field name={'age'} type={'number'} user={this.state.user.age} onChange={this.updateField}/>
                <Field name={'password'} type={'password'} onChange={this.updateField}/>
                <button disabled={!this.state.user.age || !this.state.user.password} type="button">Save</button>
                {/*<p style={{color:this.colors[this.props.signUpStatus]}}>{this.messages[this.props.signUpStatus]}</p>*/}
            </div>
        )
    }

}

export default UserEdit;