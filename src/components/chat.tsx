import * as React from 'react';
import LeftTree from "./left-tree";
import ChatMassages from "./chat-massages";
import MassageTextArea from "./massage-textarea";
import './chat.css';
import {ERROR_MSG} from "../App";
import {stateStoreService} from "../state/state-store";

export interface IMessage{
    message:string,
    date:string
}

interface IChatProps {
    data:{
        loggedInUser: string | null,
        errorMsg: ERROR_MSG,
        counter: number,
        redirect:boolean
    }
}

interface IChatState {
    selected? : string,
    message:IMessage,
    selectedMassages:IMessage[],
}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);
            this.state = {message:{message:'', date:''}, selectedMassages: []}
    }

    public getSelected = (event:any) => {debugger
        this.setState({selected: event.target.innerHTML.substr(1)}, ()=>{
            this.getSelectedMessageHistory();
        });
    };

    private getSelectedMessageHistory = () => {
        if(this.state.selected){
            const messagesList:IMessage[] = stateStoreService.getSelectedMessagesHistory(this.state.selected, this.props.data.loggedInUser);
            this.setState({selectedMassages:messagesList});
        }
    };

    public handleChange = (event: any):void => {
        this.setState({message : {message: event.target.value, date:''}});
    };

    public keyDownListener = (event:any) => {
        if(this.props.data.loggedInUser && this.state.selected){
            if(event.keyCode == 10 || event.keyCode == 13){
                event.preventDefault();
                this.addMessage();
            }
        }
    };

    public onClickSend = (event:React.MouseEvent<HTMLButtonElement>) => {
        if(this.props.data.loggedInUser && this.state.selected){
            this.addMessage();
        }
    };

    public addMessage = ()=>{
        this.setState({message:{message:this.state.message.message, date:new Date().toLocaleString().slice(0, -3)}}, ()=>{
            stateStoreService.addMessage(this.state.message, this.state.selected, this.props.data.loggedInUser);
            const messagesList = stateStoreService.getSelectedMessagesHistory(this.state.selected, this.props.data.loggedInUser);
            this.setState({selectedMassages:messagesList, message:{message:'', date:''}});
        });
    };

    public render() {
        return (
            <div className="chat">
                <div className="chat-left">
                    <LeftTree getSelected={this.getSelected}/>
                </div>
                <div className="chat-right">
                    <div className="massages">
                        <ChatMassages loggedInUser={this.props.data.loggedInUser} selected={this.state.selected} messages={this.state.selectedMassages}/>
                    </div>
                    <div className="massage-text-area">
                        <MassageTextArea onClickSend={this.onClickSend} message={this.state.message} selected={this.state.selected} data={this.props.data} handleChange={this.handleChange} keyDownListener={this.keyDownListener}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;