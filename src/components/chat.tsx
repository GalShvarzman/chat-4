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

import {socket} from '../App';


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
    previousSelectedId?:string,
    previousSelectedType?:string
}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);
            this.state = {message:{message:''}};
    }

    public logOut = () => {
        this.setState({selectedId:"", selectedType:"", selectedName:""})
    };

    public getSelectedConversationMessagesHistory = (eventTarget:any) => {
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
        let previousSelectedId;
        const previousSelectedType = this.state.selectedType;
        if(previousSelectedType === "user"){
            previousSelectedId = [this.state.selectedId, this.props.data.loggedInUser.id].sort().join("_");
        }
        else{
            previousSelectedId = this.state.selectedId;
        }
        debugger;
        this.setState({
            selectedName: eventTarget.innerHTML.substr(1),
            selectedId: eventTarget.id,
            selectedType:eventTarget.type,
            previousSelectedType,
            previousSelectedId
        }, () => {
            this.getSelectedMessageHistory();
        });
    };

    private getSelectedMessageHistory = async() => {
        if(this.state.selectedId && this.props.data.loggedInUser){
            let selectedId;
            const loggedInUserName = this.props.data.loggedInUser.name;
            if(this.state.previousSelectedId){
                debugger;
                socket.emit('leave-group', loggedInUserName, this.state.previousSelectedId);
            }
            if(this.state.selectedType === 'user'){
                selectedId = [this.state.selectedId , this.props.data.loggedInUser.id].sort().join('_');
                socket.emit('join-group', loggedInUserName, selectedId);
            }
            else{
                selectedId = this.state.selectedId;
                socket.emit('join-group', loggedInUserName, selectedId);
            }
            const messagesList:any = await stateStoreService.getSelectedMessagesHistory(selectedId);
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

    componentDidMount(){
        socket.on('msg', (msg:IMessage)=>{
            debugger;
            this.setState((prevState)=>{
                return {
                    selectedMassages: [
                        ...prevState.selectedMassages, msg
                    ]
                }
            })
        });

        socket.on('connections', (username:string)=>{
            console.log(username+ " logged in");
        })
    }

    public addMessage = ()=>{
        this.setState({message : new Message(this.state.message.message, new Date().toLocaleString().slice(0, -3), this.props.data.loggedInUser)}, async()=>{
            let conversationId;
            if(this.state.selectedType === "user"){
                conversationId = [this.props.data.loggedInUser.id, this.state.selectedId].sort().join("_");
            }
            else{
                conversationId = this.state.selectedId;
            }
            socket.emit('msg', conversationId, this.state.message);
            await stateStoreService.addMessage(this.state.selectedType, this.state.selectedId, this.state.message, this.props.data.loggedInUser);
            this.setState((prevState)=>{
                return{
                    selectedMassages:[
                        ...prevState.selectedMassages, this.state.message
                    ],
                    message:{message:""}
                }
            })
        });
    };

    public render() {
        return (
            <div className="chat">
                <div className="chat-left">
                    <LeftTree tree={this.props.tree} getSelected={this.getSelectedConversationMessagesHistory}/>
                </div>
                <div className="chat-right">
                    <div className="massages">
                        <ChatMessages loggedInUser={this.props.data.loggedInUser} selectedName={this.state.selectedName}
                                      messages={this.state.selectedMassages}/>
                    </div>
                    <div className="massage-text-area">
                        <MessageTextarea onClickSend={this.onClickSend} message={this.state.message}
                                         selectedName={this.state.selectedName} data={this.props.data}
                                         handleChange={this.handleChange} keyDownListener={this.keyDownListener}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;