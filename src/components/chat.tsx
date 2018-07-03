import * as React from 'react';
import LeftTree from "./left-tree";
import ChatMessages from "./chat-messages";
import MessageTextarea from "./message-textarea";
import './chat.css';
import {ERROR_MSG} from "../App";
import {stateStoreService} from "../state/store";
import {IMessage} from "../models/message";
import {Message} from '../models/message';
import {listItem} from './left-tree';
import {socket} from '../App';
import {addMessageToConversation, getSelectedMessagesHistory} from "../state/actions";
import {connect} from "react-redux";

interface IChatProps {
    data:{
        loggedInUser: {name:string, id:string} | null,
        errorMsg: ERROR_MSG,
        counter: number,
        redirect:boolean
    },
    tree:listItem[],
    onAddMessage(selectedType:string,selectedId:string, message:IMessage, loggedInUser:{name:string, id:string}):void,
    onSelectConversation(selectedId:string):Promise<void>,
    selectedMessages:IMessage[]
}

interface IChatState {
    selectedName? : string,
    selectedId?:string,
    selectedType?:string,
    message:IMessage,
    selectedMessages:IMessage[],
    previousSelectedId?:string,
    previousSelectedType?:string,
    isAllowedToJoinTheGroup : boolean
}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);
            this.state = {
                message:{message:''},
                isAllowedToJoinTheGroup:false,
                selectedMessages:this.props.selectedMessages
            };
    }

    public logOut = () => {
        this.setState({selectedId:"", selectedType:"", selectedName:""});
    };

    public getSelectedConversationMessagesHistory = (eventTarget:any) => {
        if (eventTarget.tagName !== 'UL' && eventTarget.tagName !== 'LI' && this.props.data.loggedInUser) {
            this.setStateOnSelected(eventTarget);
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

    static getDerivedStateFromProps(nextProps:IChatProps, prevState:IChatState) {
        if (prevState.selectedMessages !== nextProps.selectedMessages) {
            return {
                selectedMessages: nextProps.selectedMessages,
            };
        }
        return null;
    }

    private getSelectedMessageHistory = async() => {
        if(this.state.selectedId && this.props.data.loggedInUser){
            let selectedId;
            const loggedInUserName = this.props.data.loggedInUser.name;
            const loggedInUserId = this.props.data.loggedInUser.id;
            if(this.state.previousSelectedId){
                socket.emit('leave-group', loggedInUserName, this.state.previousSelectedId);
            }
            if(this.state.selectedType === 'user'){
                selectedId = [this.state.selectedId , loggedInUserId].sort().join('_');
                socket.emit('join-group', loggedInUserName, selectedId);
                this.getSelectedMessages(selectedId);
            }
            else{
                selectedId = this.state.selectedId;
                if(stateStoreService.isUserExistInGroup(selectedId, loggedInUserId)){
                    socket.emit('join-group', loggedInUserName, selectedId);
                    this.getSelectedMessages(selectedId);
                }
                else{
                    this.setState({isAllowedToJoinTheGroup:false});
                }
            }
        }
    };

    private getSelectedMessages = async(selectedId:string)=>{
        await this.props.onSelectConversation(selectedId);
        this.setState({message:{message:""}, isAllowedToJoinTheGroup:true});
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
            this.setState((prevState)=>{
                return {
                    selectedMessages: [
                        ...prevState.selectedMessages, msg
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
            await this.props.onAddMessage(this.state.selectedType, this.state.selectedId, this.state.message, this.props.data.loggedInUser);
            this.setState((prevState)=>{
                return{
                    selectedMessages:[
                        ...prevState.selectedMessages, this.state.message
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
                                      messages={this.state.selectedMessages}/>
                    </div>
                    <div className="massage-text-area">
                        <MessageTextarea onClickSend={this.onClickSend} message={this.state.message}
                                         selectedName={this.state.selectedName} data={this.props.data}
                                         handleChange={this.handleChange} keyDownListener={this.keyDownListener}
                                         isAllowedToJoinTheGroup={this.state.isAllowedToJoinTheGroup}/>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state:any, ownProps:any) => {
    return {
        tree:state.tree,
        selectedMessages:state.selectedMessages
    }
};

const mapDispatchToProps = (dispatch:any, ownProps:any) => {
    return {
        onAddMessage: (selectedType:string, selectedId:string, msg:IMessage, loggedInUser:{name:string, id:string}) => {
            dispatch(addMessageToConversation(selectedType, selectedId, msg, loggedInUser))
        },
        onSelectConversation:(selectedId:string)=>{
            dispatch(getSelectedMessagesHistory(selectedId));
        }
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps)(Chat);