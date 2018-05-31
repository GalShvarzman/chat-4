import * as React from 'react';
import './message-list-item.css';

interface IMessageListItemProps {
    message:{message:string, date:string},
    className?:string
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
            <li className="message-li">
                <div className={"message-text "+ className}>
                    {this.props.message.message}
                    <div className="message-date">{this.props.message.date}</div>
                </div>
            </li>
        );
    }
}

export default MessageListItem;