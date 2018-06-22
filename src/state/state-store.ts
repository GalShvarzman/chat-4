import {IUsersDb} from "../models/users";
import {nTree} from '../models/tree';
import NTree from '../models/tree';
import {IMessage} from "../models/message";
import {messagesDb} from "../models/messages";
import {MessagesDb} from '../models/messages';
import IGroup from "../models/group";
import {getUsers, saveUserDetails, deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup} from '../server-api';

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

    // public addNewUser(newUser:{name:string, age?:number, password:string}){
    //     if(StateStore.getInstance().users.isUserExists(newUser.name)){
    //         return false;
    //     }
    //     else{
    //         StateStore.getInstance().users.addUser(new User(newUser.name, newUser.age!, newUser.password));
    //         return true;
    //     }
    // }

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
        // fixme לאמת את היוזר בשרת....
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
        // return StateStore.getInstance().users;
    }

    public async getGroups(){
        const res = await getGroups();
        return res.data;
        // return StateStore.getInstance().groups;
    }

    public async saveUserDetails(user:{name:string, age?:number, password?:string, id:string}){
       return await saveUserDetails(user);
    }

    public async deleteUser(user:{name:string, age:number, id:string}):Promise<void>{
        return await deleteUser(user);
    }

    public async deleteGroup(group:{id:string, name:string}){
        return await deleteGroup(group);
    }

    public async getGroupData(groupId:string){
        return await getGroupData(groupId);
    }

    public async createNewUser(user:{name:string, age?:number, password:string}):Promise<{user:{name:string, age?:string, id:string}}>{
        return await createNewUser(user);
    }

    public async createNewGroup(group:{name:string, parent:string}):Promise<{group:{name:string, id:string}}>{
        return await createNewGroup(group);
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
    messagesDb:MessagesDb,
    groups:{name:string, id:string}[]
}


class StateStore implements IStateStore {
    public users:any;
    public tree:NTree = nTree;
    public groups:{name:string, id:string}[];
    public messagesDb:MessagesDb = messagesDb;

    constructor(){
        this.getGroups();
        this.getUsers();
    }

    public async getGroups(){
        const res = await getGroups();
        this.groups = res.data;
    }

    public async getUsers(){
        const res = await await getUsers();
        this.users = res.data;
    }

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