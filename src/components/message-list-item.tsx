import * as React from 'react';
import './chat-messages.css';
interface IMessageListItemProps {
    message:{message:string, date:string}
}
interface IChatMessageListItemState {

}


class MessageListItem extends React.Component<IMessageListItemProps, IChatMessageListItemState> {
    constructor(props:IMessageListItemProps){
        super(props)
    }

    public liStyle = {
        paddingLeft:'1em',
        paddingBottom: '1em',
        paddingTop: '0.5em',
        width: "100%"
    };

    public messageStyle = {
        backgroundColor: '#bddfdc',
        padding: '0.3em 0.5em',
        borderRadius:'5px',
        border: 'transparent',
        fontSize: '1.4em'
    };

    public dateStyle = {
        fontSize: '0.5em'
    };

    public render() {
        return (
            <li style={this.liStyle}>
                <span style={this.messageStyle}>
                    {this.props.message.message}
                    <span style={this.dateStyle}>{this.props.message.date}</span>
                </span>
            </li>
        );
    }
}

export default MessageListItem;