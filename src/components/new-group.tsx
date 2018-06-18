import * as React from 'react';
import Field from "./field";
import {Link} from "react-router-dom";
import './new-user.css';
import './new-group.css';
import Select from "./select";

interface INewGroupProps {
    history:any;
}

interface INewGroupState {
    group: {name: string},
    message?:string
}

class NewGroup extends React.Component<INewGroupProps,INewGroupState>{
    constructor(props:INewGroupProps){
        super(props);
        this.state = {
            group: {name: ''}
        };
    }

    public updateField = (fieldName: string, value: string) => {
        this.setState(prevState => {
            return {
                group: {
                    ...this.state.group,
                    [fieldName]: value
                }
            }
        })
    };

    private onCreateNewGroup = async () => {
        // try{
        //     const result = await this.props.onCreateNewUser(this.state.user);
        //     if(result.user){
        //         const id = result.user.id;
        //         this.props.history.push(id);
        //         this.setState({message:"User created successfully"});
        //     }
        //     else{
        //         this.setState({message:"Username already exist, choose a different name"});
        //     }
        // }
        // catch(e){
        //     this.setState({message:"Something went wrong..."}); // fixme;
        // }
    };

    render(){
        return(
            <>
                <Link to='/users'><button className="new-group-back-btn">Back</button></Link>
                <div className='new-group-wrapper'>
                    <h2 className='new-group-header'>Create new group</h2>
                    <Field name={'name'} type={'text'} onChange={this.updateField}/>
                    <div className="new-group-select-parent">Parent:</div>
                    <form className="new-group-select-form">
                        <fieldset className="new-group-field-set">
                            <Select />
                        </fieldset>
                    </form>
                    <p hidden={!this.state.message}>{this.state.message}</p>
                    <button onClick={this.onCreateNewGroup} className="create-new-group-btn" disabled={!this.state.group.name} type="button">Create</button>
                </div>
            </>
        )
    }
}

export default NewGroup;