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
                     if(message.sender!.id === this.props.loggedInUser.id){
                         return(<div key={idx} className='me-left'><MessageListItem loggedInUser={this.props.loggedInUser} className='me'  message={message}/></div>)
                     }
                     else{
                         return (<div key={idx} className='others-right'><MessageListItem loggedInUser={this.props.loggedInUser}  message={message}/></div>)
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