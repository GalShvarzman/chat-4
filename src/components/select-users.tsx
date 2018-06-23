import * as React from 'react';
import ReactTable from "react-table";
import 'react-table/react-table.css'

interface ISelectUsersProps {
    users:{name:string, age:string, id:string}[]
}

interface ISelectUsersState {
    columns:any[],
    selectedUsers:string[]
}

class SelectUsers extends React.Component<ISelectUsersProps, ISelectUsersState>{
    constructor(props:ISelectUsersProps){
        super(props);
        this.state = {
            selectedUsers:[],
            columns : [
                {
                    Header: 'ID',
                    accessor: 'id',
                    Cell:(props:any)=> (<><input type="checkbox" value={props.value}/>
                                            <span>{props.value}</span>
                                        </>)
                }, {
                    Header: 'Name',
                    accessor: 'name',
                    // Cell: (props: any) => (<Link className="user-name"
                    //                              to={{pathname: `/users/${props.original.id}/edit`,
                    //                                  state:{user:props.original}}}>{props.value}
                    // </Link>)
                }, {
                    Header: 'Age',
                    accessor: 'age',
                    // Cell: (props: any) => (<Link className="user-age"
                    //                              to={{pathname: `/users/${props.original.id}/edit`,
                    //                                  state:{user:props.original}}}>{props.value}
                    // </Link>)
                }]
        }
    }


    // public changeColor=(state:any, rowInfo:any, column:any) => {
    //     return{
    //         style: {
    //             background: rowInfo.row.age > 20 ? "green" : "red"
    //         }
    //     }
    // };


    private onClickEvent = (state:any, rowInfo:any, column:any, instance:any) => {
        return {
            onClick: (e:any, handleOriginal:any) => {
                if(e.target.type = 'checkbox'){  // fixme
                    // this.setState(prevState => {
                    //     return{
                    //         selectedUsers:[
                    //             ...prevState.selectedUsers,
                    //             rowInfo
                    //         ]
                    //     }
                    // })
                }
                this.state.selectedUsers;
                debugger;
                if (handleOriginal) {
                    handleOriginal();
                }
            }
        };
    };

    render(){
        return(
            <>
                <h1 className="users-header">Select users</h1>
                <ReactTable getTdProps={this.onClickEvent} filterable={true} defaultSortDesc={true}
                            defaultPageSize={10} minRows={10} className="users-select-table" data={this.props.users}
                            columns={this.state.columns}/>
            </>
        )
    }
}

export default SelectUsers;