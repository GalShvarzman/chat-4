import * as React from 'react';
import {ERROR_MSG} from "../App";
import {IMessage} from '../components/chat';
import './message-textarea.css';
import send from '../images/send.png';
interface IMassageTextAreaProps {
    data: {
        loggedInUser: string | null,
        errorMsg: ERROR_MSG,
        counter: number,
        redirect:boolean
    },
    selectedName:string|undefined,
    message:IMessage,
    handleChange(event: any):void,
    keyDownListener(event:any):void,
    onClickSend(event:React.MouseEvent<HTMLButtonElement>):void
}
interface IMassageTextAreaState {

}

class MessageTextarea extends React.Component<IMassageTextAreaProps, IMassageTextAreaState> {
    constructor(props:IMassageTextAreaProps){
        super(props);
    }


    public render() {
        return (
            <div className='container'>
                <div className='textarea-wrapper'><textarea className='message-textarea' value={this.props.message['message']} disabled={!this.props.data.loggedInUser || !this.props.selectedName} onKeyDown={this.props.keyDownListener} onChange={this.props.handleChange} placeholder="Type a message"/></div>
                <div className='send-btn-wrapper'>
                    <button disabled={!this.props.data.loggedInUser} className='send-btn' onClick={this.props.onClickSend}>
                        <img src={send}/>
                    </button>
                </div>
            </div>
        );
    }
}

export default MessageTextarea;