import * as React from 'react';
import {Link} from "react-router-dom";
import ReactTable from "react-table";
import 'react-table/react-table.css';
import './group-admin.css';

interface IGroupAdminProps {
    groups:{name:string, id:string}[],
    deleteGroup(group:{id:string, name:string}):void
}

interface IGroupAdminState {
    columns:any[]
}

class GroupAdmin extends React.Component<IGroupAdminProps,IGroupAdminState>{
    constructor(props:IGroupAdminProps){
        super(props);
        this.state = {
            columns : [
                {
                    Header: 'ID',
                    accessor: 'id',
                    Cell:(props:any) => (<div className="group-id-trash">
                        <button className="delete-group-btn"><i className="fa fa-trash"/></button>
                        <span>{props.value}</span>
                    </div>)
                }, {
                    Header: 'Name',
                    accessor: 'name',
                    Cell: (props: any) => (
                        <Link className="group-name" to={{pathname: `/groups/${props.original.id}/edit`,
                            state:{group:props.original}}}>
                            {props.value}
                            </Link>)
                }]
        }
    }

    private onClickEvent = (state:any, rowInfo:any, column:any, instance:any) => {
        return {
            onClick: (e:any, handleOriginal:any) => {
                if(e.target.className === "fa fa-trash"){
                    this.props.deleteGroup(rowInfo.original);
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
                <Link to='/groups/new'><button className='admin-create-new-group-btn'>Create new group</button></Link>
                <h1 className="groups-header">Groups</h1>
                <ReactTable getTdProps={this.onClickEvent} filterable={true} defaultSortDesc={true}
                            defaultPageSize={9} minRows={9} className="groups-table" data={this.props.groups}
                            columns={this.state.columns}/>
            </>
        )
    }

}

export default GroupAdmin;