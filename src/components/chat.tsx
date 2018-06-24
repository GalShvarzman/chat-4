import * as React from 'react';
import LeftTree from "./left-tree";
import ChatMessages from "./chat-messages";
import MessageTextarea from "./message-textarea";
import './chat.css';
import {ERROR_MSG} from "../App";
import {stateStoreService} from "../state/state-store";
import {IMessage} from "../models/message";
import {Message} from '../models/message';
import {listItem} from './left-tree';

interface IChatProps {
    data:{
        loggedInUser: {name:string, id:string} | null,
        errorMsg: ERROR_MSG,
        counter: number,
        redirect:boolean
    },
    tree:listItem[]
}

interface IChatState {
    selectedName? : string,
    selectedId?:string,
    selectedType?:string,
    message:IMessage,
    selectedMassages?:IMessage[],
}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);
            this.state = {message:{message:''}};
    }

    public logOut = () => {
        this.setState({selectedId:"", selectedType:"", selectedName:""})
    };

    public getSelected = (eventTarget:any) => {
        if(this.props.data.loggedInUser) {
            if (eventTarget.tagName !== 'UL' && eventTarget.tagName !== 'LI') {
                // if(eventTarget.type === 'group'){
                //     if(stateStoreService.isUserExistInGroup(eventTarget.id, this.props.data.loggedInUser.id)){
                //         this.setStateOnSelected(eventTarget);
                //     }
                // }
                // else{
                //     this.setStateOnSelected(eventTarget);
                // } // fixme להציג למשתמש את היסטוריית ההודעות רק כשהוא שייך לקבוצה....
                this.setStateOnSelected(eventTarget);
            }
        }
        else{
            alert("You need to login first...")
        }
    };

    private setStateOnSelected = (eventTarget:any) => {
        this.setState({
            selectedName: eventTarget.innerHTML.substr(1),
            selectedId: eventTarget.id,
            selectedType:eventTarget.type
        }, () => {
            this.getSelectedMessageHistory();
        });
    };

    private getSelectedMessageHistory = () => {
        if(this.state.selectedId && this.props.data.loggedInUser){
            const messagesList:IMessage[] = stateStoreService.getSelectedMessagesHistory(this.state.selectedType, this.state.selectedId, this.props.data.loggedInUser.id);
            this.setState({selectedMassages:messagesList, message:{message:""}});
        }
    };

    public handleChange = (event: any):void => {
        this.setState({message : {message: event.target.value}});
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
        this.setState({message : new Message(this.state.message.message, new Date().toLocaleString().slice(0, -3))}, ()=>{
            stateStoreService.addMessage(this.state.selectedType, this.state.selectedId, this.state.message, this.props.data.loggedInUser);
            this.getSelectedMessageHistory();
        });
    };

    public render() {
        return (
            <div className="chat">
                <div className="chat-left">
                    <LeftTree tree={this.props.tree} getSelected={this.getSelected}/>
                </div>
                <div className="chat-right">
                    <div className="massages">
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