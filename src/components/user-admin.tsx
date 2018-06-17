import * as React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import {Link} from "react-router-dom";
import './user-admin.css';

interface IUserAdminProps {
    users:any,
    refMenu:any
}

interface IUserAdminState {

}

class UserAdmin extends React.Component<IUserAdminProps, IUserAdminState>{
    constructor(props:IUserAdminProps){
        super(props)
    }

    // componentWillMount(){
    //     this.props.refMenu.closeMenu();
    // }

    // public changeColor=(state:any, rowInfo:any, column:any) => {
    //     return{
    //         style: {
    //             background: rowInfo.row.age > 20 ? "green" : "red"
    //         }
    //     }
    // };

    render(){
        const data = this.props.users;
        const columns = [
            {
                Header: 'ID',
                accessor: 'id',
                Cell:(props:any)=> (<><button className="delete-user-btn"><i className="fa fa-trash"/></button><span>{props.value}</span></>)
            }, {
                Header: 'Name',
                accessor: 'name',
                Cell: (props: any) => <Link className="user-name" to={{pathname: `/users/${props.original.id}/edit`, state:{user:props.original}}}>{props.value}</Link>
            }, {
                Header: 'Age',
                accessor: 'age',
                Cell: (props: any) => <Link className="user-age" to={{pathname: `/users/${props.original.id}/edit`, state:{user:props.original}}}>{props.value}</Link>
        }];

        return(
            <>
                <h1 className="users-header">Users</h1>
                <ReactTable filterable={true} defaultSortDesc={true} defaultPageSize={13} minRows={13} className="table" data={data} columns={columns}/>
            </>
        )
    }
}

export default UserAdmin;