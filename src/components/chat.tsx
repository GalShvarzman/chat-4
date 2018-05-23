import * as React from 'react';
import LeftTree from "./left-tree";
import ChatMassages from "./chat-massages";
import MassageTextArea from "./massage-textarea";
import './chat.css'
interface IChatProps {

}
interface IChatState {

}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps){
        super(props)
    }
    public render() {
        return (
            <div className="chat">
                <div className="chat-left">
                    <LeftTree/>
                </div>
                <div className="chat-right">
                    <ChatMassages/>
                    <MassageTextArea/>
                </div>
            </div>
        );
    }
}

export default Chat;