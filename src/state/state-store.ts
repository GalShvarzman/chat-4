import {IUsersDb, usersDb} from "../models/users";
import IUser from "../models/user";
import User from '../models/user';
import {nTree} from '../models/tree';
import NTree from '../models/tree';
import IGroup from "../models/group";
import Group from '../models/group';
import {IMessage} from '../components/chat';
import {messagedDb} from "../models/messages";

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

    public addMessage(selectedId:string|undefined, message:IMessage, selected:string|undefined, loggedInUser:string|null){
        message.sender = loggedInUser;
        const selectedObj = this.locatingSelected(selectedId);
        if(selectedObj instanceof Group){
            selectedObj.addMessage(message);
        }
        else if(selectedObj instanceof User && loggedInUser){
            selectedObj.addMessage(message, loggedInUser);
            this.updateOtherUserMessages(selectedObj, loggedInUser)
        }
        this.onStoreChanged();
    }

    public locatingSelected (selectedId:string|undefined) {
        return this.search(selectedId);
    }

    public getSelectedMessagesHistory(selectedId:string|undefined,selected:string|undefined, loggedInUser?:string|null){
       if(selected && selectedId){
           const selectedObj:IUser|IGroup = this.locatingSelected(selectedId);
           if(selectedObj){
               if(selectedObj instanceof Group){
                   return this.getMessages(selectedObj);
               }
               return this.getMessages(selectedObj, loggedInUser);
           }
           throw new Error("Locating selected failed");
       }
       throw new Error("No selected")
    }

    private getMessages(match: IUser | IGroup , loggedInUserName?:string|null){
        if(match){
            if(match instanceof User){
                return match.getMessages(loggedInUserName)
            }
            return match.getMessages();
        }
        throw new Error("No match");
    }


    public updateOtherUserMessages(selectedObj:IUser, loggedInUser:string|null){
        if(loggedInUser){
            const chatWithUserObj = this.getUser(loggedInUser);
            if(!(chatWithUserObj as IUser).messages[selectedObj.name]){}
            (chatWithUserObj as IUser).messages[selectedObj.name] = selectedObj.messages[loggedInUser];
        }
    }

    private getUser(name:string|undefined){
        return StateStore.getInstance().users.getUser(name);
    }

    public search(id:string|undefined){
        return StateStore.getInstance().tree.search(id);
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

    public walkTree(){
        const tree = StateStore.getInstance().tree;
        const treeToPrint = tree.printFullTree();
        return JSON.stringify(treeToPrint);
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
    public messages = messagedDb;

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
