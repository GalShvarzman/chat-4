import * as React from 'react';
import LeftTree from "./left-tree";
import ChatMessages from "./chat-messages";
import MessageTextarea from "./message-textarea";
import './chat.css';
import {ERROR_MSG} from "../App";
import {stateStoreService} from "../state/state-store";

export interface IMessage{
    message:string,
    date:string,
    sender?:string|null
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
    selectedName? : string,
    selectedId?:string,
    // selectedA?:HTMLElement,
    message:IMessage,
    selectedMassages?:IMessage[],
}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);
            this.state = {message:{message:'', date:''}}
    }

    public getSelected = (event:any) => {
        if(event.target.tagName !== 'UL' && event.target.tagName !== 'LI'){
            this.setState({selectedName: event.target.innerHTML.substr(1), selectedId:event.target.id /*selectedA:event.target*/}, ()=>{
                // (this.state.selectedA as HTMLElement).classList.add('active');
                if(this.props.data.loggedInUser){
                    this.getSelectedMessageHistory();
                }
                else{
                    alert("You need to login first...")
                }
            });
        }
        // if(this.state.selectedA && this.state.selectedA != event.target){
        //     (this.state.selectedA as HTMLElement).classList.remove('active');
        // }

    };

    private getSelectedMessageHistory = () => {
        if(this.state.selectedName){debugger
            const messagesList:IMessage[] = stateStoreService.getSelectedMessagesHistory(this.state.selectedId, this.state.selectedName, this.props.data.loggedInUser);
            this.setState({selectedMassages:messagesList, message:{message:'', date:''}});
        }
    };

    public handleChange = (event: any):void => {
        this.setState({message : {message: event.target.value, date:''}});
    };

    public keyDownListener = (event:any) => {
        if(this.props.data.loggedInUser && this.state.selectedName && this.state.message.message.trimLeft().length){
            if(event.keyCode == 10 || event.keyCode == 13){
                event.preventDefault();
                this.addMessage();
            }
        }
    };

    public onClickSend = (event:React.MouseEvent<HTMLButtonElement>) => {
        if(this.props.data.loggedInUser && this.state.selectedName){
            this.addMessage();
        }
    };

    public addMessage = ()=>{
        this.setState({message:{message:this.state.message.message, date:new Date().toLocaleString().slice(0, -3)}}, ()=>{
            stateStoreService.addMessage(this.state.selectedId, this.state.message, this.state.selectedName, this.props.data.loggedInUser);
            this.getSelectedMessageHistory();
        });
    };

    public render() {
        return (
            <div className="chat">
                <div className="chat-left">
                    <LeftTree getSelected={this.getSelected}/>
                </div>
                <div className="chat-right">
                    <div className="massages" hidden={!this.state.selectedId || !this.props.data.loggedInUser}>
                        <ChatMessages loggedInUser={this.props.data.loggedInUser} selectedName={this.state.selectedName} messages={this.state.selectedMassages}/>
                    </div>
                    <div className="massage-text-area">
                        <MessageTextarea onClickSend={this.onClickSend} message={this.state.message} selectedName={this.state.selectedName} data={this.props.data} handleChange={this.handleChange} keyDownListener={this.keyDownListener}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;