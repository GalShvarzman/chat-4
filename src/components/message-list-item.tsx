import * as React from 'react';
import IMessage from '../components/chat';

interface IMassageListItemProps {
    message:IMessage
}
interface IChatMassageListItemState {

}


class MassageListItem extends React.Component<IMassageListItemProps, IChatMassageListItemState> {
    constructor(props:IMassageListItemProps){
        super(props)
    }

    public liStyle = {
        overflow:'auto',
        paddingLeft:'1em'
    };

    public messageStyle = {
        backgroundColor: '#bddfdc',
        padding: '0.2em 0.4em',
        borderRadius:'10px',
        fontSize: '1.2em'
    };

    public dateStyle = {
        fontSize: '0.6em'
    };

    public render() {
        return (
            <li style={this.liStyle}>
                <span style={this.messageStyle}>
                    {this.props.message}
                    <span style={this.dateStyle}>{this.props.message}</span>
                </span>
            </li>
        );
    }
}

export default MassageListItem;