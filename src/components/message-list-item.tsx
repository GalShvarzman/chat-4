import * as React from 'react';
import './message-list-item.css';
import {IMessage} from "../models/message";

interface IMessageListItemProps {
    className?:string,
    message:IMessage,
    loggedInUser: {name:string, _id:string}|null
}

class MessageListItem extends React.Component<IMessageListItemProps, {}> {
    constructor(props:IMessageListItemProps){
        super(props)
    }

    public render() {
        let meClass;
        if(this.props.className){
            meClass = this.props.className
        }
        return (
            <li key={this.props.message["_id"]}  className="message-li">
                <div className={"message-text "+ meClass}>
                    <div className="user-name" hidden={this.props.message.sender!._id === this.props.loggedInUser!._id}>{this.props.message.sender ? this.props.message.sender.name : ""}</div>
                    {this.props.message.message}
                    <div className="message-date">{new Date(this.props.message.date).toLocaleString().slice(0, -3)}</div>
                </div>
            </li>
        );
    }
}

export default MessageListItem;