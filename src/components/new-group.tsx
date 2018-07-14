import * as React from 'react';
import Field from "./field";
import {Link} from "react-router-dom";
import './new-user.css';
import './new-group.css';
import Select from "./select";
import {stateStoreService} from "../state/store";
import {IClientGroup} from "../interfaces";

interface INewGroupProps {
    history:any;
    onCreateNewGroup(group:{name:string, parentId:string}):{name:string, _id:string},
    onGetGroupOptionalParents():void,
    groupsWithGroupsChildren:IClientGroup[],
    createNewErrorMsg:string|null
}

interface INewGroupState {
    group: {name: string, parentId:string}
}

class NewGroup extends React.PureComponent<INewGroupProps,INewGroupState>{
    constructor(props:INewGroupProps){
        super(props);
        this.state = {
            group: {name: '', parentId: 'select'}
        };
    }

    // static getDerivedStateFromProps(nextProps:INewGroupProps, prevState:INewGroupState){
    //     if (prevState.groupsWithGroupsChildren !== nextProps.groupsWithGroupsChildren) {
    //         return {
    //             groupsWithGroupsChildren: nextProps.groupsWithGroupsChildren,
    //         };
    //     }
    //     return null;
    // }

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

    private getGroupOptionalParents = ()=>{
        this.props.onGetGroupOptionalParents();
    };

    componentDidMount(){
        this.getGroupOptionalParents();
    }

    private onCreateNewGroup = () => {
        this.props.onCreateNewGroup(this.state.group);
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
                            groups={this.props.groupsWithGroupsChildren}/>
                    <p hidden={!this.props.createNewErrorMsg}>{this.props.createNewErrorMsg}</p>
                    <button onClick={this.onCreateNewGroup} className="create-new-group-btn"
                            disabled={!this.state.group.name || this.state.group.parentId == "select"} type="button">Create</button>
                </div>
            </>
        )
    }
}

export default NewGroup;