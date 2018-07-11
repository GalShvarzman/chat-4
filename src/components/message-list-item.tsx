import * as React from 'react';
import './message-list-item.css';
import {IMessage} from "../models/message";

interface IMessageListItemProps {
    className?:string,
    message:IMessage,
    loggedInUser: {name:string, id:string}|null
}

class MessageListItem extends React.Component<IMessageListItemProps, {}> {
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
                    <div className="user-name" hidden={this.props.message.sender!.id === this.props.loggedInUser!.id}>{this.props.message.sender ? this.props.message.sender.name : ""}</div>
                    {this.props.message.message}
                    <div className="message-date">{this.props.message.date.toLocaleString().slice(0, -3)}</div>
                </div>
            </li>
        );
    }
}

export default MessageListItem;