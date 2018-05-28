import * as React from 'react';
import LeftTree from "./left-tree";
import ChatMassages from "./chat-massages";
import MassageTextArea from "./massage-textarea";
import './chat.css';
import {IUsersDb} from "../models/users";
import {ERROR_MSG} from "../App";
import IUser from "../models/user";
import {stateStoreService} from "../state/state-store";
import IGroup from "../models/group";

interface IChatProps {
    data:{
        users: IUsersDb,
        loggedInUser: string | null,
        errorMsg: ERROR_MSG,
        counter: number,
        redirect:boolean
    }
}

interface IChatState {
    selected? : IGroup | IUser,
    massage:string,
    loggedInUser:IUser
}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);
        if(this.props.data.loggedInUser){
            const user = stateStoreService.getUser(this.props.data.loggedInUser);
            if(user){
                this.state = {massage:'', loggedInUser:user}
            }
        }
    }

    public getSelected = (event:any) => {debugger
        const matchGroups:IGroup[] = stateStoreService.search(event.target.innerHTML.substr(1));
        const matchUser:IUser|undefined = stateStoreService.getUser(event.target.innerHTML.substr(1));
        // fixme
        if(matchGroups){
            this.setState({selected: matchGroups[0]});
        }
        else if(matchUser) {
            this.setState({selected: matchUser});
        }
        else{
            // fixme
        }
    };

    public handleChange = (event: any):void => {
        this.setState({massage : event.target.value})
    };

    public keyUpListener = (event:any) => {
        if(event.key === 'Enter'){
            stateStoreService.addMassage(this.state.massage, this.state.selected, this.state.loggedInUser);
        }
    };

    public render() {
        return (
            <div className="chat">
                <div className="chat-left">
                    <LeftTree getSelected={this.getSelected}/>
                </div>
                <div className="chat-right">
                    <div className="massages">
                        <ChatMassages/>
                    </div>
                    <div className="massage-text-area">
                        <MassageTextArea data={this.props.data} handleChange={this.handleChange} keyUpListener={this.keyUpListener}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;