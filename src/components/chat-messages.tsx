import * as React from 'react';
import MessageListItem from "./message-list-item";
import './chat-messages.css';
import {IMessage} from "../models/message";

interface IChatMessagesProps {
    messages:IMessage[]|undefined,
    selectedName:string|undefined,
    loggedInUser: {name:string, id:string}|null
}

interface IChatMessagesState {

}

class ChatMessages extends React.Component<IChatMessagesProps, IChatMessagesState> {
    constructor(props:IChatMessagesProps){
        super(props)
    }

    public ulWrapper = {
        width: '100%'
    };




    public render() {
        let messagesHistory;
        if(this.props.messages && this.props.loggedInUser){
             messagesHistory = this.props.messages.map((message, idx)=>{
                 if(this.props.loggedInUser){
                     if(message.sender === this.props.loggedInUser.name){
                         return(<div className='me-left'> <MessageListItem className='me' key={idx} message={message}/></div>)
                     }
                     else{
                         return (<div className='others-right'><MessageListItem key={idx} message={message}/></div>)
                     }
                 }
                 return;
            })
        }
        return (
            <div hidden={!this.props.selectedName || !this.props.loggedInUser} className='messages-wrapper'>
                <div>
                    <h1 className='messages-on'>{this.props.selectedName}</h1>
                 </div>
                <div style={this.ulWrapper}>
                    <ul>{messagesHistory}</ul>
                </div>
            </div>
        );
    }
}

export default ChatMessages;