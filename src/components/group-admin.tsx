import * as React from 'react';
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './group-admin.css';

interface IGroupAdminProps {
    groups:any
}

interface IGroupAdminState {

}

class GroupAdmin extends React.Component<IGroupAdminProps,IGroupAdminState>{
    constructor(props:IGroupAdminProps){
        super(props)
    }

    private onClickEvent = (state:any, rowInfo:any, column:any, instance:any) => {
        return {
            onClick: (e:any, handleOriginal:any) => {
                if(e.target.className === "fa fa-trash"){
                    // this.props.deleteUser(rowInfo.original)
                }
                if (handleOriginal) {
                    handleOriginal();
                }
            }
        };
    };

    render(){
        const data = this.props.groups;
        const columns = [
            {
                Header: 'ID',
                accessor: 'id',
                Cell:(props:any)=> (<><button className="delete-group-btn"><i className="fa fa-trash"/></button><span>{props.value}</span></>)
            }, {
                Header: 'Name',
                accessor: 'name',
                Cell: (props: any) => <Link className="group-name" to={{pathname: `/groups/${props.original.id}/edit`, state:{group:props.original}}}>{props.value}</Link>
            }];
        return(
            <>
                <Link to='/groups/new'><button className='admin-create-new-group-btn'>Create new group</button></Link>
                <h1 className="groups-header">Groups</h1>
                <ReactTable getTdProps={this.onClickEvent} filterable={true} defaultSortDesc={true} defaultPageSize={9} minRows={9} className="groups-table" data={data} columns={columns}/>
            </>
        )
    }

}

export default GroupAdmin;