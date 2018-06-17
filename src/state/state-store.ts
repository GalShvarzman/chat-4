import {IUsersDb} from "../models/users";
import {nTree} from '../models/tree';
import NTree from '../models/tree';
import {IMessage} from "../models/message";
import {messagesDb} from "../models/messages";
import {MessagesDb} from '../models/messages';
import User, {default as IUser} from "../models/user";
import IGroup from "../models/group";
import {getUsers, saveUserDetails} from '../server-api';

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

    public addNewUser(newUser:{name:string, age?:number, password:string}){
        if(StateStore.getInstance().users.isUserExists(newUser.name)){
            return false;
        }
        else{
            StateStore.getInstance().users.addUser(new User(newUser.name, newUser.age!, newUser.password));
            return true;
        }
    }

    public isUserExistInGroup(groupId:string, userId:string){
        const group = StateStore.getInstance().tree.search(groupId);
        return (group as IGroup).isNodeExistInGroup(userId);
    }

    public addMessage(selectedType:string|undefined, selectedId:string|undefined, message:IMessage, loggedInUser:{name:string, id:string}|null){
        if(loggedInUser && selectedId){
            message.sender = loggedInUser;
            if(selectedType === 'group'){
                StateStore.getInstance().messagesDb.addMessageToGroup(message, selectedId);
            }
            else{
                StateStore.getInstance().messagesDb.addMessageUsersConversation(message, selectedId, loggedInUser.id);
            }
            // this.onStoreChanged();
        }
    }

    public getSelectedMessagesHistory(selectedType:string|undefined, selectedId:string|undefined, loggedInUserId?:string|null){
       if(selectedId && selectedType && loggedInUserId){
               if(selectedType === 'group'){
                   return StateStore.getInstance().messagesDb.getGroupMessages(selectedId);
               }
               return StateStore.getInstance().messagesDb.getUsersConversationMessages(selectedId, loggedInUserId);
       }
       return [];
    }

    public search(id:string|undefined){
        return StateStore.getInstance().tree.search(id);
    }

    public auth(user:{name:string, password:string}):string{
        try{
            const currentUser = StateStore.getInstance().users.getUser(user.name);
            if(currentUser.auth(user.password)){
                return currentUser.id;
            }
            else{
                throw new Error("Authentication failed");
            }
        }
        catch(error){
            throw new Error("Authentication failed");
        }
    }

    public getUserId(userName:string){
        return StateStore.getInstance().users.getUser(userName).id;
    }

    public walkTree(){
        const tree = StateStore.getInstance().tree;
        const treeToPrint = tree.printFullTree();
        return JSON.stringify(treeToPrint);
    }

    public async getUsers(){
        const res = await getUsers();
        return res.data;
    }

    public async saveUserDetails(user:IUser){
        const result = await saveUserDetails(user);
        this.onStoreChanged();
        return result;
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
    tree:NTree,
    messagesDb:MessagesDb
}


class StateStore implements IStateStore {
    public users:any;
    public tree:NTree = nTree;
    public messagesDb:MessagesDb = messagesDb;

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