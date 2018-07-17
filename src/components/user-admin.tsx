import * as React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import {Link} from "react-router-dom";
import './user-admin.css';
import {setErrorMsg} from "../state/actions";
import {store} from "../state/store";

interface IUserAdminProps {
    users:any,
    refMenu:any,
    deleteUser(user:{name: string, age: number, _id: string}):void,
    errorMsg:string|null
}

interface IUserAdminState {
    columns:any[]
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
                    this.props.deleteUser(rowInfo.original);
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
            <>
                <Link to='/users/new'><button className='admin-create-new-user-btn'>Create new user</button></Link>
                <h1 className="users-header">Users</h1>
                <ReactTable getTdProps={this.onClickEvent} filterable={true} defaultSortDesc={true}
                            defaultPageSize={9} minRows={9} className="users-table" data={this.props.users}
                            columns={this.state.columns}/>
                <p hidden={!this.props.errorMsg}>{this.props.errorMsg}</p>
            </>
        )
    }
}

export default UserAdmin;