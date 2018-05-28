import * as React from 'react';
import {IUsersDb} from "../models/users";
import {ERROR_MSG} from "../App";

interface IMassageTextAreaProps {
    data: {
        users: IUsersDb,
        loggedInUser: string | null,
        errorMsg: ERROR_MSG,
        counter: number,
        redirect:boolean
    },
    handleChange(event: any):void,
    keyUpListener(event:any):void
}
interface IMassageTextAreaState {

}

class MassageTextArea extends React.Component<IMassageTextAreaProps, IMassageTextAreaState> {
    constructor(props:IMassageTextAreaProps){
        super(props);
    }

    public textAreaStyle = {
        width:'98%',
        padding:0,
        border:'none',
        borderRadius: '5px',
        bottom: 0,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '1em',
        fontSize: '1.2em',
        color: '#483D8B',
        outline: 'none'
    };

    public render() {
        return (
            <textarea disabled={!this.props.data.loggedInUser} onKeyUp={this.props.keyUpListener} onChange={this.props.handleChange} style={this.textAreaStyle} placeholder="Type a message"/>
        );
    }
}

export default MassageTextArea;