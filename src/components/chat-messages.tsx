import * as React from 'react';
import MessageListItem from "./message-list-item";
import './chat-messages.css';

interface IChatMessagesProps {
    messages:any[],
    selectedName:string|undefined,
    loggedInUser: string|null
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
        if(this.props.messages.length){
             messagesHistory = this.props.messages.map((message, idx)=>{
                 if(message.sender === this.props.loggedInUser){
                     return(<div className='me-left'> <MessageListItem className='me' key={idx} message={message}/></div>)
                 }
                else{
                     return (<div className='others-right'><MessageListItem key={idx} message={message}/></div>)
                 }
            })
        }
        return (
            <div hidden={!this.props.loggedInUser || !this.props.selectedName} className='messages-wrapper'>
                <div hidden={!this.props.selectedName}>
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