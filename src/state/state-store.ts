import NTree from '../models/tree';
import {IMessage} from "../models/message";
import {messagesDb} from "../models/messages";
import {MessagesDb} from '../models/messages';
// import IGroup from "../models/group";
import {addMessage, getSelectedMessages, getTree, auth, deleteUserFromGroup, getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails, deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup, getGroupsWithGroupsChildren} from '../server-api';

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
        return Promise.all([getGroups(), getUsers(), getTree()])
            .then((results)=>{
                this._set('groups', results[0].data);
                this._set('users', results[1].data);
                this._set('tree', results[2]);
                this.onStoreChanged(['users', 'groups', 'tree']);
        })
    }
    private _set(key: string, val: any) {
        StateStore.getInstance()[key] = val;
    }

    public get(key: string) {
        return StateStore.getInstance()[key] || [];
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

    // public isUserExistInGroup(groupId:string, userId:string){
    //     const group = StateStore.getInstance().tree;
    //     group;
    //     // fixme;
    //     // return (group as IGroup).isNodeExistInGroup(userId);
    // }

    public async addMessage(selectedType:string|undefined, selectedId:string|undefined, message:IMessage, loggedInUser:{name:string, id:string}|null){
        if(loggedInUser && selectedId){
            if(selectedType === 'group'){
                await addMessage(message, selectedId);
            }
            else{
                await addMessage(message, selectedId, loggedInUser.id);
            }
        }
    }

    public async getSelectedMessagesHistory(selectedId:string){
        // fixme bring only if the user is in this group;
        return await getSelectedMessages(selectedId);
    }

    // public search(id:string|undefined){
    //     return StateStore.getInstance().tree.search(id);
    // }

    public async auth(user:{name:string, password:string}):Promise<any>{
        return await auth(user);
    }

    // public getUserId(userName:string){
    //     return StateStore.getInstance().users.getUser(userName).id;
    // }

    // public walkTree(){
    //     const tree = StateStore.getInstance().tree;
    //     debugger;
    //     const treeToPrint = tree.printFullTree();
    //     debugger;
    //     return JSON.stringify(treeToPrint);
    // }

    public getUsers(){
        return StateStore.getInstance().users;
    }

    public getGroups(){
        return StateStore.getInstance().groups;
    }

    public getTree(){
        return StateStore.getInstance().tree;
    }

    async getOptionalGroupParents(){
       const result = await getGroupsWithGroupsChildren();
       return result.data;
    }

    public async saveGroupDetails(group:{name:string, id:string}){
        const updatedGroup = await saveGroupDetails(group);
        const groups = this.get('groups');
        const groupsClone = [...groups];
        const groupIndex = groupsClone.findIndex((group)=>{
           return group.id === updatedGroup.group.id;
        });
        groupsClone[groupIndex] = updatedGroup.group;
        this._set('groups', groupsClone);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['groups', 'tree']);
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
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['users', 'tree']);
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
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['users', 'tree']);
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
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['groups', 'tree']);
    }

    public async getGroupData(groupId:string){
        return await getGroupData(groupId);
    }

    public async createNewUser(user:{name:string, age?:number, password:string}):Promise<{user:{name:string, age:string, id:string}}>{
        const newUser = await createNewUser(user);
        const users = this.get('users');
        this._set('users', users.concat([newUser.user]));
        this.onStoreChanged(['users']);
        return newUser;
    }

    public async createNewGroup(group:{name:string, parent:string}):Promise<{group:{name:string, id:string}}>{
        const newGroup = await createNewGroup(group);
        const groups = this.get('groups');
        this._set('groups', groups.concat([newGroup]));
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['groups', 'tree']);
        return newGroup;
    }

    public async getOptionalUsers(groupId:string){
        return await getGroupOptionalUsers(groupId);
    }

    public async addUsersToGroup(data:{usersIds:string[], groupId:string}){
        await addUsersToGroup(data);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['tree']);
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

    public async deleteUserFromGroup(userId:string, groupId:string){
        await deleteUserFromGroup(userId, groupId);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['tree']);
    }


}

interface IStateStore {
    users : any,
    tree:NTree,
    messagesDb:MessagesDb,
    groups:{name:string, id:string}[]
}


class StateStore implements IStateStore {
    public users:{name:string, age:string, id:string}[];
    public tree:NTree;
    public groups:{name:string, id:string}[];
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