import {IMessage} from "../models/message";
import {addMessage, getSelectedMessages, getTree, auth, deleteUserFromGroup,
    getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails,
    deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup,
    getGroupsWithGroupsChildren} from '../server-api';
import {IClientGroup, IClientUser, ITree} from "../interfaces";

interface IStateStoreService {
    get(key: string): any | null,
    subscribe(listener:any): void,
    unsubscribe(listener:any):void
}

export class StateStoreService implements IStateStoreService {
    listeners: Function[];

    constructor() {
        this.listeners = [];
        this.init()
    }

    private async init() {
        return Promise.all([getGroups(), getUsers(), getTree()])
            .then((results) => {
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

    public async addMessage(selectedType: string | undefined, selectedId: string | undefined, message: IMessage, loggedInUser: { name: string, id: string } | null) {
        if (loggedInUser && selectedId) {
            let conversationId;
            if (selectedType === 'group') {
                conversationId = selectedId;
            }
            else {
                conversationId = [selectedId,loggedInUser.id].sort().join("_");
            }
            await addMessage(message, conversationId);
        }
    }

    public isUserExistInGroup(selectedId:string, loggedInUserId:string){
        const tree = this.get('tree');
        const allGroups = this.flatTreeGetAllGroups(tree.items);
        const selectedGroup = allGroups.find((group)=>{
            return group.id === selectedId
        });
        if(selectedGroup.items) {
            const userIndex = selectedGroup.items.findIndex((item: any) => {
                return item.id === loggedInUserId
            });
            return (userIndex !== -1);
        }
        else{
            return false;
        }
    }

    public async getSelectedMessagesHistory(selectedId: string) {
        return await getSelectedMessages(selectedId);
    }

    private flatTreeGetAllGroups(items:any){
        const result:any[] = [];
        items.forEach((item:any)=>{
            if(item.type === 'group'){
                result.push(item);
                if(item.items){
                    result.push(...this.flatTreeGetAllGroups(item.items));
                }
            }
        });
        return result;
    }

    public async auth(user: { name: string, password: string }): Promise<any> {
        return await auth(user);
    }

    public getUsers() {
        return StateStore.getInstance().users;
    }

    public getGroups() {
        return StateStore.getInstance().groups;
    }

    public getTree() {
        return StateStore.getInstance().tree;
    }

    async getOptionalGroupParents() {
        const result = await getGroupsWithGroupsChildren();
        return result.data;
    }

    public async saveGroupDetails(group: { name: string, id: string }) {
        const updatedGroup = await saveGroupDetails(group);
        const groups = this.get('groups');
        const groupsClone = [...groups];
        const groupIndex = groupsClone.findIndex((group) => {
            return group.id === updatedGroup.group.id;
        });
        groupsClone[groupIndex] = updatedGroup.group;
        this._set('groups', groupsClone);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['groups', 'tree']);
    }

    public async saveUserDetails(user: IClientUser): Promise<void> {
        const updatedUser = await saveUserDetails(user);
        const users = this.get('users');
        const usersClone = [...users];
        const userIndex = usersClone.findIndex((user) => {
            return user.id === updatedUser.user.id;
        });
        usersClone[userIndex] = updatedUser.user;
        this._set('users', usersClone);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['users', 'tree']);
    }

    public async deleteUser(userToDelete: IClientUser): Promise<void> {
        await deleteUser(userToDelete);
        const users = this.get('users');
        const usersClone = [...users];
        const userIndex = usersClone.findIndex((user) => {
            return user.id === userToDelete.id;
        });
        usersClone.splice(userIndex, 1);
        this._set('users', usersClone);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['users', 'tree']);
    }

    public async deleteGroup(groupToDelete: IClientGroup) {
        await deleteGroup(groupToDelete);
        const groups = await getGroups();
        this._set('groups', groups.data);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['groups', 'tree']);
    }

    public async getGroupData(groupId: string) {
        return await getGroupData(groupId);
    }

    public async createNewUser(user: IClientUser): Promise<{ user: IClientUser }> {
        const newUser = await createNewUser(user);
        const users = this.get('users');
        this._set('users', users.concat([newUser.user]));
        this.onStoreChanged(['users']);
        return newUser;
    }

    public async createNewGroup(group: { name: string, parent: string }): Promise<{ group: IClientGroup }> {
        const newGroup = await createNewGroup(group);
        const groups = this.get('groups');
        this._set('groups', groups.concat([newGroup]));
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['groups', 'tree']);
        return newGroup;
    }

    public async getOptionalUsers(groupId: string) {
        return await getGroupOptionalUsers(groupId);
    }

    public async addUsersToGroup(data: { usersIds: string[], groupId: string }) {
        await addUsersToGroup(data);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['tree']);
    }

    public subscribe(listener: any) {
        this.listeners.push(listener);
    }

    public unsubscribe(listener: any) {
        const index = this.listeners.findIndex(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    private onStoreChanged(whatChanged: string[]) {
        const event = {changed: whatChanged};
        for (const listener of this.listeners) {
            listener(event);
        }
    }

    public async deleteUserFromGroup(userId: string, groupId: string) {
        await deleteUserFromGroup(userId, groupId);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['tree']);
    }

}

interface IStateStore {
    users : IClientUser[],
    tree:ITree,
    groups:IClientGroup[]
}


class StateStore implements IStateStore {
    public users:IClientUser[];
    public tree:ITree;
    public groups:IClientGroup[];

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