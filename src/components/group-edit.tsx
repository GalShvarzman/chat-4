import * as React from 'react';
import Field from "./field";
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './group-edit.css';
import {store} from "../state/store";
import {IClientGroup} from "../interfaces";
import {onDeleteUserFromGroup} from "../state/actions";
import {setErrorMsg} from "../state/actions";

interface IGroupEditProps {
    groups:IClientGroup[],
    location: any,
    saveGroupNewName(group: { name: string, id: string }): void,
    deleteGroup(group:IClientGroup):void,
    onSelectGroupToEdit(groupId:string):void,
    selectedGroupData:{}|null,
    errorMsg:string|null,
}

interface IGroupEditState {
    group: {
        name:string,
        _id:string,
        children?:any[],
        parentId?:any
    },
    columns:any[],
    addNewUserBtnIsHidden:boolean
}

class GroupEdit extends React.PureComponent<IGroupEditProps, IGroupEditState>{
    constructor(props:IGroupEditProps){
        super(props);

        this.state = {
            group:{
                name:props.location.state.group.name,
                _id:props.location.state.group._id || props.location.state.group.id
            },
            columns : [
                {
                    Header: 'ID',
                    accessor: 'childId._id',
                    Cell:(props:any)=> (<div className="delete-child-btn"><button className="delete-child-btn"><i className="fa fa-trash"/></button><span>{props.value}</span></div>)
                }, {
                    Header: 'Name',
                    accessor: 'childId.name',
                },
                {
                    Header: 'Kind',
                    accessor: 'kind',
                }],

            addNewUserBtnIsHidden:false
        }

    }

    public saveGroupNewName = () => {
        this.props.saveGroupNewName({id: this.state.group._id, name: this.state.group.name});
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

    async componentDidMount(){
       this.props.onSelectGroupToEdit(this.state.group._id);
    }

    static getDerivedStateFromProps(nextProps:IGroupEditProps, prevState:IGroupEditState) {
        if (nextProps.selectedGroupData !== null && nextProps.selectedGroupData !== prevState.group) {
            return {
                group:{
                    ...prevState.group,
                    children:nextProps.selectedGroupData["children"],
                    parentId:nextProps.selectedGroupData["parentId"]
                }
            }
        }
        return null;
    }

    componentDidUpdate(prevProps:IGroupEditProps, prevState:IGroupEditState){
        if(this.props.groups !== prevProps.groups){
            this.props.onSelectGroupToEdit(this.state.group._id);
        }
        this.groupChildrenCheck();
    }

    groupChildrenCheck = () => {
        if(this.props.selectedGroupData["children"].length && this.props.selectedGroupData["children"][0].kind === 'Group'){
            this.setState({addNewUserBtnIsHidden : true});
        }
    };

    private onClickEvent = (state:any, rowInfo:any, column:any, instance:any) => {
        return {
            onClick: (e:any, handleOriginal:any) => {
                if(e.target.className === "fa fa-trash"){
                    if(rowInfo.original.kind === 'User'){
                         store.dispatch(onDeleteUserFromGroup(rowInfo.original.childId._id, this.state.group._id));
                    }
                    else{
                        this.props.deleteGroup(rowInfo.original);
                    }
                }
                if (handleOriginal) {
                    handleOriginal();
                }
            }
        };
    };

    componentWillUnmount(){
        store.dispatch(setErrorMsg(null));
    }

    render(){
        return(
            <div>
                <Link to='/groups'><button className="edit-group-back-btn">Back</button></Link>
                <div className="edit-group-wrapper">
                    <h2 className="edit-group-header">Edit group details</h2>
                    <p className="parent-wrapper">
                        <span className="group-id">Id:</span>
                        <span className="id">{this.state.group._id}</span>
                    </p>
                    <Field name={'name'} type={'text'} group={this.state.group.name} onChange={this.updateField}/>
                    <button onClick={this.saveGroupNewName} className="edit-group-save-btn" type="button">Save</button>
                    <div>
                        <p className="parent-wrapper">
                            <span className="parent">Parent:</span><span className="parent-name">
                                {this.state.group.parentId ? (this.state.group.parentId.name + " " + this.state.group.parentId._id) : ("No Parent")}
                            </span>
                        </p>
                        <div className="children-wrapper">
                            {!this.state.addNewUserBtnIsHidden && <Link to={{pathname:`/groups/${this.state.group._id}/add-users`, state:{group:this.state.group}}}><button className="add-children-btn">Add users to group</button></Link>}
                            <h2 className="children-header">Children</h2>
                            <ReactTable getTdProps={this.onClickEvent} filterable={true} defaultSortDesc={true} defaultPageSize={4}
                                        minRows={4} className="children-table" data={this.state.group.children}
                                        columns={this.state.columns}/>
                        </div>
                        <p hidden={!this.props.errorMsg}>{this.props.errorMsg}</p>
                    </div>
                </div>
            </div>
        )
    }

}

export default GroupEdit;