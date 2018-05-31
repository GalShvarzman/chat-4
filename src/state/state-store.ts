import {IUsersDb, usersDb} from "../models/users";
import IUser from "../models/user";
import User from '../models/user';
import {nTree} from '../models/tree';
import NTree from '../models/tree';
import IGroup from "../models/group";
import Group from '../models/group';
import {IMessage} from '../components/chat';

interface IStateStoreService {
    set(key: string, val: any): void,
    get(key: string): any | null,
    subscribe(listener:any): void,
}

export class StateStoreService implements IStateStoreService{
    listeners: Function[];

    constructor(){
        this.listeners = [];
    }

    public set(key: string, val: any) {
        StateStore.getInstance()[key] = val;
        this.onStoreChanged();
    }

    public get(key: string) {
        return StateStore.getInstance()[key] || null;
    }

    public addMessage(message:IMessage, selected:string|undefined, loggedInUser:string|null){
        message.sender = loggedInUser;
        const selectedObj = this.locatingSelected(selected);
        if(selectedObj instanceof Group){
            selectedObj.addMessage(message);
        }
        else if(selectedObj instanceof User){
            selectedObj.addMessage(message, loggedInUser);
        }
        this.onStoreChanged();
    }

    public locatingSelected (selected:string|undefined) {
        const matchGroups: IGroup[] = this.search(selected);
        const matchUser: IUser | undefined = this.getUser(selected);
        if (matchGroups.length) {
            return matchGroups[0];
            // fixme צריך לבחור את הקבוצה הרלוונטית...
        }
        else if (matchUser) {
            return matchUser
        }
        else return false;
    }

    public getSelectedMessagesHistory(selected:string|undefined, loggedInUser?:string|null){
       if(selected){
           const selectedObj = this.locatingSelected(selected);

           if(selectedObj instanceof Group){
               return this.getMessages(selectedObj);
           }
           else if(selectedObj instanceof User) {
               return this.getMessages(selectedObj, loggedInUser);
           }
           else{
               return [];
           }
       }
        else{
            return [];
        }
    }

    private getMessages(match: IUser | IGroup , loggedInUserName?:string|null){
        if(match){
            if(match instanceof User){
                return match.getMessages(loggedInUserName)
            }
            return match.getMessages();
        }
        return [];
    }

    public getUserName(name: string){
        const user = StateStore.getInstance().users.getUser(name);
        if(user){
            return user.name
        }
        else{
            return false;
        }
    }

    public updateUserMessages(selectedUser:IUser, chatWith:string){
        if(chatWith && selectedUser){
            const chatWithUserObj = this.getUser(chatWith);
            (chatWithUserObj as IUser).messages[selectedUser.name] = selectedUser.messages[chatWith];
        }

    }

    private getUser(name:string|undefined){
        return StateStore.getInstance().users.getUser(name);
    }

    public search(name:string|undefined){
        return StateStore.getInstance().tree.search(name);
    }

    public auth(user:{name:string, password:string}){
        const currentUser = StateStore.getInstance().users.getUser(user.name);
        if(currentUser) {
            return currentUser.auth(user.password)
        }
        else{
            return false
        }
    }

    public subscribe(listener:any){
        this.listeners.push(listener);
    }

    private onStoreChanged(){
        for(const listener of this.listeners){
            listener();
        }
    }
}

interface IStateStore {
    users : IUsersDb,
    tree:NTree
}


class StateStore implements IStateStore {
    public users:IUsersDb = usersDb;
    public tree:NTree = nTree;

    static instance: IStateStore;

    static getInstance() {
        if (!StateStore.instance) {
            StateStore.instance = new StateStore();
        }

        return StateStore.instance;
    }
}

export default StateStore;

export const stateStoreService: StateStoreService = new StateStoreService();
