import * as React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import {Link} from "react-router-dom";
import './user-admin.css';

interface IUserAdminProps {
    users:any,
    refMenu:any,
    deleteUser(user:{name: string, age: number, _id: string}):Promise<void>
}

interface IUserAdminState {
    columns:any[],
    message?:string
}

class UserAdmin extends React.PureComponent<IUserAdminProps, IUserAdminState>{
    constructor(props:IUserAdminProps){
        super(props);
        this.state = {
            columns : [
                {
                    Header: 'ID',
                    accessor: '_id',
                    Cell:(props:any)=> (<div className="user-id-trash"><button className="delete-user-btn">
                                            <i className="fa fa-trash"/></button><span>{props.value}</span></div>)
                }, {
                    Header: 'Name',
                    accessor: 'name',
                    Cell: (props: any) => (<Link className="user-name"
                                                 to={{pathname: `/users/${props.original._id}/edit`,
                                                     state:{user:props.original}}}>{props.value}
                                           </Link>)
                }, {
                    Header: 'Age',
                    accessor: 'age',
                    Cell: (props: any) => (<Link className="user-age"
                                                 to={{pathname: `/users/${props.original._id}/edit`,
                                                     state:{user:props.original}}}>{props.value}
                                           </Link>)
                }]
        }
    }

    private onClickEvent = (state:any, rowInfo:any, column:any, instance:any) => {
        return {
            onClick: async (e:any, handleOriginal:any) => {
                if(e.target.className === "fa fa-trash"){
                    try {
                        await this.props.deleteUser(rowInfo.original);
                    }
                    catch (e) {
                        this.setState({message:"Delete user failed"});
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
            <>
                <Link to='/users/new'><button className='admin-create-new-user-btn'>Create new user</button></Link>
                <h1 className="users-header">Users</h1>
                <ReactTable getTdProps={this.onClickEvent} filterable={true} defaultSortDesc={true}
                            defaultPageSize={10} minRows={10} className="users-table" data={this.props.users}
                            columns={this.state.columns}/>
                <p hidden={!this.state.message}>{this.state.message}</p>
            </>
        )
    }
}

export default UserAdmin;