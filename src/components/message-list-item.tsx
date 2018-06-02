import * as React from 'react';
import './message-list-item.css';
import {IMessage} from "../models/message";

interface IMessageListItemProps {
    className?:string,
    message:IMessage
}
interface IChatMessageListItemState {

}


class MessageListItem extends React.Component<IMessageListItemProps, IChatMessageListItemState> {
    constructor(props:IMessageListItemProps){
        super(props)
    }

    public render() {
        let className;
        if(this.props.className){
            className = this.props.className
        }
        return (
            <li key={this.props.message.id}  className="message-li">
                <div className={"message-text "+ className}>
                    {this.props.message.message}
                    <div className="message-date">{this.props.message.date}</div>
                </div>
            </li>
        );
    }
}

export default MessageListItem;