import * as React from 'react';
import Field from "./field";
import {Link} from "react-router-dom";
import './new-user.css';
import './new-group.css';
import Select from "./select";
import {IClientGroup} from "../interfaces";
import {store} from "../state/store";
import {setErrorMsg} from "../state/actions";

interface INewGroupProps {
    history:any;
    onCreateNewGroup(group:IClientGroup):IClientGroup,
    onGetGroupOptionalParents():void,
    groupsWithGroupsChildren:IClientGroup[],
    errorMsg:string|null
}

interface INewGroupState {
    group: IClientGroup
}

class NewGroup extends React.PureComponent<INewGroupProps,INewGroupState>{
    constructor(props:INewGroupProps){
        super(props);
        this.state = {
            group: {name: '', parentId: 'select'}
        };
    }

    componentWillUnmount(){
        store.dispatch(setErrorMsg(null));
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
                    <p hidden={!this.props.errorMsg}>{this.props.errorMsg}</p>
                    <button onClick={this.onCreateNewGroup} className="create-new-group-btn"
                            disabled={!this.state.group.name || this.state.group.parentId == "select"} type="button">Create</button>
                </div>
            </>
        )
    }
}

export default NewGroup;