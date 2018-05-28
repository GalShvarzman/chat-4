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
    loggedInUser?:IUser,
    selectedMassages?:string[],
}

class Chat extends React.Component<IChatProps, IChatState> {
    constructor(props:IChatProps) {
        super(props);
        if(this.props.data.loggedInUser){
            const user = stateStoreService.getUser(this.props.data.loggedInUser);
            if(user){
                this.state = {massage:'', loggedInUser:user, selectedMassages:[]}
            }
        }
        else{
            this.state = {massage:'', selectedMassages:[]}
        }
    }

    public getSelected = (event:any) => {// fixme את כל התהליך של קבלת נתונים על הקבוצה להביא מהסרביס
        const matchGroups:IGroup[] = stateStoreService.search(event.target.innerHTML.substr(1));
        const matchUser:IUser|undefined = stateStoreService.getUser(event.target.innerHTML.substr(1));
        // fixme
        if(matchGroups.length){debugger
            const massagesList = stateStoreService.getMassages(matchGroups[0]);
                 // fixme צריך לבחור את הקבוצה הרלוונטית...

            this.setState({selected: matchGroups[0], selectedMassages:massagesList});
        }
        else if(matchUser) {
            if(this.state.loggedInUser){
                const massagesList = stateStoreService.getMassages(matchUser, this.state.loggedInUser.name);
                this.setState({selected: matchUser, selectedMassages: massagesList});
            }
        }
        else{
            // fixme
        }
    };

    public handleChange = (event: any):void => {
        this.setState({massage : event.target.value})
    };

    public keyUpListener = (event:any) => {
        if(event.key === 'Enter'){debugger
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
                        <ChatMassages massages={this.state.selectedMassages}/>
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