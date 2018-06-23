import * as React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import CheckBox from './checkbox';
import {Link} from "react-router-dom";
import {stateStoreService} from "../state/state-store";

interface ISelectUsersProps {
    handelAddUsersToGroup(data:{usersIds:string[], groupId:string}):Promise<{name:string, age:string, id:string}[]>,
    location:any
}

interface ISelectUsersState {
    columns:any[],
    message?:string,
    users:{name:string, age:string, id:string}[],
}

class SelectUsers extends React.Component<ISelectUsersProps, ISelectUsersState>{
    private selectedUsers:any;

    constructor(props:ISelectUsersProps){
        super(props);
        this.state = {
            users:[],
            columns : [
                {
                    Header: 'ID',
                    accessor: 'id',
                    Cell:(props:any)=> (<><CheckBox label={props.value} handleCheckboxChange={this.toggleCheckbox}
                        key={props.value}/>
                    </>)
                }, {
                    Header: 'Name',
                    accessor: 'name',
                }, {
                    Header: 'Age',
                    accessor: 'age'
                }]
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
        const optionalUsers = await stateStoreService.getOptionalUsers(this.props.location.state.group.id);
        this.setState({users:optionalUsers});
    }
    // private onClickEvent = (state:any, rowInfo:any, column:any, instance:any) => {
    //     return {
    //         onClick: (e:any, handleOriginal:any) => {
    //             if(e.target.type = 'checkbox'){  // fixme
    //                 // this.setState(prevState => {
    //                 //     return{
    //                 //         selectedUsers:[
    //                 //             ...prevState.selectedUsers,
    //                 //             rowInfo
    //                 //         ]
    //                 //     }
    //                 // })
    //             }
    //             if (handleOriginal) {
    //                 handleOriginal();
    //             }
    //         }
    //     };
    // };

    private handleFormSubmit = async (e:React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        const selectedUsersIterator = this.selectedUsers.values();
        await this.props.handelAddUsersToGroup({usersIds:Array.from(selectedUsersIterator), groupId:this.props.location.state.group.id});
        this.setState({message:'Users added successfully'})
    };

    render(){
        return(
            <>
                <Link to={{pathname:`/groups/${this.props.location.state.group.id}/edit`, state:{group:this.props.location.state.group}}}><button>Back</button></Link>
                <h1 className="users-header">Select users</h1>
                <form onSubmit={this.handleFormSubmit}>
                    <ReactTable filterable={true} defaultSortDesc={true} defaultPageSize={10}
                                minRows={10} className="users-select-table" data={this.state.users}
                                columns={this.state.columns}/>
                    <button type='submit'>Save</button>
                    <p hidden={!this.state.message}>{this.state.message}</p>
                </form>
            </>
        )
    }
}

export default SelectUsers;