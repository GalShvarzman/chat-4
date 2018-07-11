import * as React from 'react';
import Field from "./field";
import {Link} from "react-router-dom";
import './new-user.css';
import './new-group.css';
import Select from "./select";
import {stateStoreService} from "../state/store";

interface INewGroupProps {
    history:any;
    onCreateNewGroup(group:{name:string, parentId:string}):{name:string, id:string}
}

interface INewGroupState {
    group: {name: string, parentId:string},
    message?:string,
    groupsWithGroupsChildren:{name:string, id:string}[]
}

class NewGroup extends React.PureComponent<INewGroupProps,INewGroupState>{
    constructor(props:INewGroupProps){
        super(props);
        this.state = {
            group: {name: '', parentId: 'select'},
            groupsWithGroupsChildren:[]
        };
    }

    public handleSelect = (parentId:any) => {
        this.setState((prevState)=>{
            return{
                group:{
                    name:prevState.group.name,
                    parentId
                }
            }
        })
    };


    public updateField = (fieldName: string, value: string) => {
        this.setState(prevState => {
            return {
                group: {
                    ...prevState.group,
                    [fieldName]: value
                }
            }
        })
    };

    private getOptions = async ()=>{
        const groupsWithGroupsChildren = await stateStoreService.getOptionalGroupParents();
        this.setState({groupsWithGroupsChildren});
    };

    componentDidMount(){
        this.getOptions();
    }

    private onCreateNewGroup = async () => {
        try {
            const group = await this.props.onCreateNewGroup(this.state.group);
            const id = group.id;
            this.props.history.push(id);
            this.setState({message: "Group created successfully", groupsWithGroupsChildren:this.state.groupsWithGroupsChildren.concat([group])});
        }
        catch(e){
            this.setState({message:"Create group failed"});
        }
    };

    render(){
        return(
            <>
                <Link to='/groups'><button className="new-group-back-btn">Back</button></Link>
                <div className='new-group-wrapper'>
                    <h2 className='new-group-header'>Create new group</h2>
                    <Field name={'name'} type={'text'} onChange={this.updateField}/>
                    <div className="new-group-select-parent">Parent</div>
                    <Select parent={this.state.group.parentId} handleSelect={this.handleSelect}
                            groups={this.state.groupsWithGroupsChildren}/>
                    <p hidden={!this.state.message}>{this.state.message}</p>
                    <button onClick={this.onCreateNewGroup} className="create-new-group-btn"
                            disabled={!this.state.group.name || this.state.group.parentId == "select"} type="button">Create</button>
                </div>
            </>
        )
    }
}

export default NewGroup;