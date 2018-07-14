import * as React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import CheckBox from './checkbox';
import {Link} from "react-router-dom";
import {stateStoreService} from "../state/store";
import './select-users.css';

interface ISelectUsersProps {
    handelAddUsersToGroup(data:{usersIds:string[], groupId:string}):Promise<{name:string, age:string, _id:string}[]>,
    location:any
}

interface ISelectUsersState {
    columns:any[],
    message?:string,
    users:{name:string, age:string, _id:string}[],
}

class SelectUsers extends React.Component<ISelectUsersProps, ISelectUsersState>{
    private selectedUsers:any;

    constructor(props:ISelectUsersProps){
        super(props);
        debugger;
        this.state = {
            users:[],
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

    async componentDidMount(){
        try {
            const optionalUsers = await stateStoreService.getOptionalUsers(this.props.location.state.group.id);
            this.setState({users: optionalUsers});
        }
        catch (e) {
            this.setState({message:"Failed to fetch users"});
        }
    }

    private handleFormSubmit = async (e:React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        //try {
            const selectedUsersIterator = this.selectedUsers.values();
            await this.props.handelAddUsersToGroup({
                usersIds: Array.from(selectedUsersIterator),
                groupId: this.props.location.state.group.id
            });
         //   this.setState({message: 'Users added successfully'})
        // }
        // catch (e) {
        //     this.setState({message: 'Adding users to the group failed'});
        // }
    };

    render(){
        return(
            <>
                <Link to={{pathname:`/groups/${this.props.location.state.group.id}/edit`, state:{group:this.props.location.state.group}}}><button className="select-users-back-btn">Back</button></Link>
                <h1 className="select-users-group-name-header">{this.props.location.state.group.name}</h1>
                <h2 className="select-users-header">Select users</h2>
                <form onSubmit={this.handleFormSubmit}>
                    <ReactTable filterable={true} defaultSortDesc={true} defaultPageSize={8}
                                minRows={8} className="users-select-table" data={this.state.users}
                                columns={this.state.columns}/>
                    <button className="select-users-save-btn" type='submit'>Save</button>
                    <p className="select-users-message" hidden={!this.state.message}>{this.state.message}</p>
                </form>
            </>
        )
    }
}

export default SelectUsers;