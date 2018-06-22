// import {IUsersDb} from "../models/users";
import {nTree} from '../models/tree';
import NTree from '../models/tree';
import {IMessage} from "../models/message";
import {messagesDb} from "../models/messages";
import {MessagesDb} from '../models/messages';
import IGroup from "../models/group";
import {getUsers, saveUserDetails, deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup, getGroupsWithGroupsChildren} from '../server-api';

interface IStateStoreService {
    get(key: string): any | null,
    subscribe(listener:any): void,
    unsubscribe(listener:any):void
}

export class StateStoreService implements IStateStoreService{
    listeners: Function[];

    constructor(){
        this.listeners = [];
        this.init()
    }

    private async init(){
        return Promise.all([getGroups(),getUsers(), getGroupsWithGroupsChildren()]).then((results)=>{
            this._set('users', results[1].data);
            this._set('groups', results[0].data);
            this._set('groupsWithGroupsChildren', results[2].data);
            this.onStoreChanged(['users', 'groups', 'groupsWithGroupsChildren']);
        })
    }
    private _set(key: string, val: any) {
        StateStore.getInstance()[key] = val;
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

    public getUsers(){
        return StateStore.getInstance().users;
    }

    public getGroups(){
        return StateStore.getInstance().groups;
    }

    public getGroupsWithGroupsChildren(){
        return StateStore.getInstance().groupsWithGroupsChildren;
    }

    public async saveUserDetails(user:{name:string, age?:number, password?:string, id:string}):Promise<void>{
        const updatedUser = await saveUserDetails(user);
        const users = this.get('users');
        const usersClone = [...users];
        const userIndex = usersClone.findIndex((user)=>{
            return user.id === updatedUser.user.id;
        });
        usersClone[userIndex] = updatedUser.user;
        this._set('users', usersClone);
        this.onStoreChanged(['users']);
    }

    public async deleteUser(userToDelete:{name:string, age:number, id:string}):Promise<void>{
        await deleteUser(userToDelete);
        const users = this.get('users');
        const usersClone = [...users];
        const userIndex = usersClone.findIndex((user)=>{
            return user.id === userToDelete.id;
        });
        usersClone.splice(userIndex, 1);
        this._set('users', usersClone);
        this.onStoreChanged(['users']);
    }

    public async deleteGroup(groupToDelete:{id:string, name:string}){
        await deleteGroup(groupToDelete);
        const groups = this.get('groups');
        const groupsClone = [...groups];
        const groupIndex = groupsClone.findIndex((group)=>{
            return group.id === groupToDelete.id;
        });
        groupsClone.splice(groupIndex, 1);
        this._set('groups', groupsClone);
        this.onStoreChanged(['groups']);
    }

    public async getGroupData(groupId:string){
        return await getGroupData(groupId);
    }

    public async createNewUser(user:{name:string, age?:number, password:string}):Promise<{user:{name:string, age:string, id:string}}>{
        const newUser = await createNewUser(user);
        const users = this.get('users');
        const usersClone = [...users];
        usersClone.push(newUser.user);
        this._set('users', usersClone);
        this.onStoreChanged(['users']);
        return newUser;
    }

    public async createNewGroup(group:{name:string, parent:string}):Promise<{group:{name:string, id:string}}>{
        const newGroup = await createNewGroup(group);
        const groups = this.get('groups');
        const groupsClone = [...groups];
        groupsClone.push(newGroup);
        this._set('groups', groupsClone);
        this.onStoreChanged(['groups']);
        return newGroup;
    }

    public subscribe(listener:any){
        this.listeners.push(listener);
    }

    public unsubscribe(listener:any){
        const index = this.listeners.findIndex(listener);
        if(index !== -1){
            this.listeners.splice(index, 1);
        }
    }

    private onStoreChanged(whatChanged:string[]){
        const event = {changed:whatChanged};
        for(const listener of this.listeners){
            listener(event);
        }
    }

}

interface IStateStore {
    users : any,
    tree:NTree,
    messagesDb:MessagesDb,
    groups:{name:string, id:string}[],
    groupsWithGroupsChildren:{name:string, id:string}[]
}


class StateStore implements IStateStore {
    public users:{name:string, age:string, id:string}[];
    public tree:NTree = nTree;
    public groups:{name:string, id:string}[];
    public messagesDb:MessagesDb = messagesDb;
    public groupsWithGroupsChildren : {name:string, id:string}[];

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