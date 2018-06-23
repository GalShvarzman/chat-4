import * as React from 'react';
import Field from "./field";
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './group-edit.css';
import {stateStoreService} from "../state/state-store";

interface IGroupEditProps {
    location:any,
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
                    Cell:(props:any)=> (<><button className="delete-child-btn"><i className="fa fa-trash"/></button><span>{props.value}</span></>)
                }, {
                    Header: 'Name',
                    accessor: 'name',
                },
                {
                    Header: 'Age',
                    accessor: 'age',
                },
                {
                    Header: 'Type',
                    accessor: 'type',
                }],

            addNewUserBtnIsHidden:false
        }

    }

    // public save = async () => {
    //     const result:{message:string} = await this.props.onEditUserDetails(this.state.user);
    //     this.setState({message:result.message});
    // };

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
        const groupData:{data:[{groupParent:{name:string, id:string}},{groupChildren:any[]}]} = await stateStoreService.getGroupData(this.props.location.state.group.id);
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

    render(){
        return(
            <div>
                <Link to='/groups'><button className="edit-group-back-btn">Back</button></Link>
                <div className="edit-group-wrapper">
                    <h2 className="edit-group-header">Edit group details</h2>
                    <Field name={'name'} type={'text'} group={this.state.group.name} onChange={this.updateField}/>
                    <button className="edit-group-save-btn" type="button">Save</button>
                    <p hidden={!this.state.message}>{this.state.message}</p>
                    <div>
                        <p className="parent-wrapper">
                            <span className="parent">Parent:</span><span className="parent-name">
                            {this.state.group.parent}
                            </span>
                        </p>
                        <div className="children-wrapper">
                            {!this.state.addNewUserBtnIsHidden && <Link to={{pathname:'/users/select', state:{group:this.state.group}}}>Add users to group</Link>}
                            <h2 className="children-header">Children</h2>
                            <ReactTable filterable={true} defaultSortDesc={true} defaultPageSize={5}
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