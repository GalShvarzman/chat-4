import * as React from 'react';
import {ERROR_MSG} from "../App";
import {IMessage} from '../components/chat';

interface IMassageTextAreaProps {
    data: {
        loggedInUser: string | null,
        errorMsg: ERROR_MSG,
        counter: number,
        redirect:boolean
    },
    selected:string|undefined,
    message:IMessage,
    handleChange(event: any):void,
    keyDownListener(event:any):void,
    onClickSend(event:React.MouseEvent<HTMLButtonElement>):void
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
            <div>
                <textarea value={this.props.message['message']} disabled={!this.props.data.loggedInUser || !this.props.selected} onKeyDown={this.props.keyDownListener} onChange={this.props.handleChange} style={this.textAreaStyle} placeholder="Type a message"/>
                <button onClick={this.props.onClickSend}>send</button>
            </div>
        );
    }
}

export default MassageTextArea;