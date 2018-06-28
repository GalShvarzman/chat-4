import * as React from 'react';
import Field from "./field";
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './group-edit.css';
import {stateStoreService} from "../state/state-store";

interface IGroupEditProps {
    location: any,
    saveGroupNewName(group: { name: string, id: string }): { name: string, id: string }
}

interface IGroupEditState {
    group: {
        name:string,
        id:string,
        children?:any[],
        parent?:string
    },
    message?:string,
    columns:any[],
    addNewUserBtnIsHidden:boolean
}

class GroupEdit extends React.Component<IGroupEditProps, IGroupEditState>{
    constructor(props:IGroupEditProps){
        super(props);
        this.state = {
            group:{
                name:props.location.state.group.name,
                id:props.location.state.group.id
            },
            columns : [
                {
                    Header: 'ID',
                    accessor: 'id',
                    Cell:(props:any)=> (<div className="delete-child-btn"><button className="delete-child-btn"><i className="fa fa-trash"/></button><span>{props.value}</span></div>)
                }, {
                    Header: 'Name',
                    accessor: 'name',
                },
                {
                    Header: 'Type',
                    accessor: 'type',
                }],

            addNewUserBtnIsHidden:false
        }

    }

    public save = async () => {
        await this.props.saveGroupNewName({id:this.state.group.id, name:this.state.group.name});
        this.setState({message:"Group updated successfully"});
    };

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

    async componentDidMount(){
        const groupData:{data:[{groupParent:{name:string, id:string}},{groupChildren:any[]}] } = await stateStoreService.getGroupData(this.props.location.state.group.id);
        debugger;

        if(groupData.data[1].groupChildren.length && groupData.data[1].groupChildren[0].type === 'group'){
            this.setState({addNewUserBtnIsHidden : true});
        }
        this.setState(prevState=>{
            return{
                group:{
                    ...prevState.group,
                    children:groupData.data[1].groupChildren,
                    parent:groupData.data[0].groupParent.name + " " + groupData.data[0].groupParent.id
                }
            }
        });

    }

    private onClickEvent = (state:any, rowInfo:any, column:any, instance:any) => {
        return {
            onClick: async(e:any, handleOriginal:any) => {
                if(e.target.className === "fa fa-trash"){
                    try{
                        if(rowInfo.original.type === 'user'){
                            await stateStoreService.deleteUserFromGroup(rowInfo.original.id, this.state.group.id);
                        }
                        else{
                            await stateStoreService.deleteGroup({id:rowInfo.original.id, name:rowInfo.original.name});
                        }
                        const groupChildrenClone = [...this.state.group.children];
                        const deletedGroupId = groupChildrenClone.findIndex((child)=>{
                            return child.id === rowInfo.original.id;
                        });
                        groupChildrenClone.splice(deletedGroupId, 1);
                        this.setState(prevState => {
                            return{
                                group:{
                                    ...this.state.group,
                                    children : groupChildrenClone
                                }
                            }
                        })
                    }
                    catch (e) {
                        // fixme;
                    }

                }
                if (handleOriginal) {
                    handleOriginal();
                }
            }
        };
    };

    render(){
        return(
            <div>
                <Link to='/groups'><button className="edit-group-back-btn">Back</button></Link>
                <div className="edit-group-wrapper">
                    <h2 className="edit-group-header">Edit group details</h2>
                    <p className="parent-wrapper">
                        <span className="group-id">Id:</span>
                        <span className="id">{this.state.group.id}</span>
                    </p>
                    <Field name={'name'} type={'text'} group={this.state.group.name} onChange={this.updateField}/>
                    <button onClick={this.save} className="edit-group-save-btn" type="button">Save</button>
                    <p hidden={!this.state.message}>{this.state.message}</p>
                    <div>
                        <p className="parent-wrapper">
                            <span className="parent">Parent:</span><span className="parent-name">
                            {this.state.group.parent}
                            </span>
                        </p>
                        <div className="children-wrapper">
                            {!this.state.addNewUserBtnIsHidden && <Link to={{pathname:`/groups/${this.state.group.id}/add-users`, state:{group:this.state.group}}}><button className="add-children-btn">Add users to group</button></Link>}
                            <h2 className="children-header">Children</h2>
                            <ReactTable getTdProps={this.onClickEvent} filterable={true} defaultSortDesc={true} defaultPageSize={5}
                                        minRows={5} className="children-table" data={this.state.group.children}
                                        columns={this.state.columns}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default GroupEdit;