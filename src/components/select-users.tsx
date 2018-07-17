import * as React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import CheckBox from './checkbox';
import {Link} from "react-router-dom";
import './select-users.css';
import {IClientUser} from "../interfaces";
import {store} from "../state/store";
import {setAddUsersToGroupErrorMsg, setErrorMsg} from "../state/actions";

interface ISelectUsersProps {
    handelAddUsersToGroup(data:{usersIds:string[], groupId:string}):Promise<{name:string, age:string, _id:string}[]>,
    location:any,
    groupOptionalUsers:IClientUser[]|null,
    getGroupOptionalUsers(groupId:string):void,
    addUsersToGroupErrorMsg:string|null,
    errorMsg:string|null
}

interface ISelectUsersState {
    columns:any[],
}

class SelectUsers extends React.Component<ISelectUsersProps, ISelectUsersState>{
    private selectedUsers:any;

    constructor(props:ISelectUsersProps){
        super(props);

        this.state = {
            columns : [
                    {
                        Header: 'ID',
                        accessor: '_id',
                        Cell:(props:any)=> (<div className="check-box-wrapper">
                            <CheckBox label={props.value} handleCheckboxChange={this.toggleCheckbox}
                            key={props.value}/>
                        </div>)
                    }, {
                        Header: 'Name',
                        accessor: 'name',
                    }, {
                        Header: 'Age',
                        accessor: 'age'
                    }
                ]
        }
    }

    componentWillMount(){
        this.selectedUsers = new Set();
    };

    private toggleCheckbox = (label:string) => {
        if (this.selectedUsers.has(label)) {
            this.selectedUsers.delete(label);
        } else {
            this.selectedUsers.add(label);
        }
    };

    componentDidMount(){
        this.props.getGroupOptionalUsers(this.props.location.state.group._id);
    }

    componentWillUnmount(){
        store.dispatch(setAddUsersToGroupErrorMsg(null));
        store.dispatch(setErrorMsg(null));
    }

    componentDidUpdate(prevProps:ISelectUsersProps, prevState:ISelectUsersState){
        if(this.props.groupOptionalUsers !== prevProps.groupOptionalUsers){
            this.props.getGroupOptionalUsers(this.props.location.state.group._id);
        }
    }

    private handleFormSubmit = async (e:React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        const selectedUsersIterator = this.selectedUsers.values();
        await this.props.handelAddUsersToGroup({
            usersIds: Array.from(selectedUsersIterator),
            groupId: this.props.location.state.group._id
        });
    };

    render(){
        return(
            <>
                <Link to={{pathname:`/groups/${this.props.location.state.group._id}/edit`, state:{group:this.props.location.state.group}}}><button className="select-users-back-btn">Back</button></Link>
                <h1 className="select-users-group-name-header">{this.props.location.state.group.name}</h1>
                <h2 className="select-users-header">Select users</h2>
                <form onSubmit={this.handleFormSubmit}>
                    <ReactTable filterable={true} defaultSortDesc={true} defaultPageSize={7}
                                minRows={7} className="users-select-table" data={this.props.groupOptionalUsers}
                                columns={this.state.columns}/>
                    <button className="select-users-save-btn" type='submit'>Save</button>
                    <p className="select-users-message" hidden={!this.props.addUsersToGroupErrorMsg && !this.props.errorMsg}>{this.props.addUsersToGroupErrorMsg || this.props.errorMsg}</p>
                </form>
            </>
        )
    }
}

export default SelectUsers;