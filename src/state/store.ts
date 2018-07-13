import {IMessage} from "../models/message";
import {addMessage, getSelectedMessages, getTree, auth, deleteUserFromGroup,
    getGroupOptionalUsers, saveGroupDetails, addUsersToGroup, getUsers, saveUserDetails,
    deleteUser, createNewUser,createNewGroup, getGroups, getGroupData, deleteGroup,
    getGroupsWithGroupsChildren} from '../server-api';
import {IClientGroup, IClientUser, ITree} from "../interfaces";
import { applyMiddleware, createStore, compose  } from 'redux';
import thunk from 'redux-thunk';
import {reducer} from "./reducer";

export interface IState {
    tree:any[],
    users:IClientUser[],
    groups:IClientGroup[],
    selectedMessages:IMessage[],
    loggedInUser:IClientUser,
    loginErrorMsg:string | null,
    updateErrorMsg:string,
    updatedGroup:IClientGroup
}

const initialState:{} = {
    tree:[],
    users:[],
    groups:[],
    selectedMessages:[],
    loggedInUser:null,
    loginErrorMsg:null,
    updatedGroup:null,
    updateErrorMsg:null
};

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));


export class StateStoreService {
    listeners: Function[];

    constructor() {
        this.listeners = [];
    }

    private _set(key: string, val: any) {
        StateStore.getInstance()[key] = val;
    }

    public get(key: string) {
        return StateStore.getInstance()[key] || [];
    }

    //
    // private flatTreeGetAllGroups(items:any){
    //     const result:any[] = [];
    //     items.forEach((item:any)=>{
    //         if(item.type === 'group'){
    //             result.push(item);
    //             if(item.items){
    //                 //result.push(...this.flatTreeGetAllGroups(item.items));
    //             }
    //         }
    //     });
    //     return result;
    // }



    // public getUsers() {
    //     return StateStore.getInstance().users;
    // }

    // public getGroups() {
    //     return StateStore.getInstance().groups;
    // }

    // public getTree() {
    //     return StateStore.getInstance().tree;
    // }

    async getOptionalGroupParents() {
        return await getGroupsWithGroupsChildren();
    }


    public async deleteUser(userToDelete: IClientUser): Promise<void> {
        await deleteUser(userToDelete);
        const users = this.get('users');
        const usersClone = [...users];
        const userIndex = usersClone.findIndex((user) => {
            return user.id === userToDelete._id;
        });
        usersClone.splice(userIndex, 1);
        this._set('users', usersClone);
        const tree = await getTree();
        this._set('tree', tree);
        this.onStoreChanged(['users', 'tree']);
    }

    public async deleteGroup(groupToDelete: any) {
        await deleteGroup(groupToDelete);
        const groups = await getGroups();
        this._set('groups', groups);
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

    // public subscribe(listener: any) {
    //     this.listeners.push(listener);
    // }

    // public unsubscribe(listener: any) {
    //     const index = this.listeners.findIndex(listener);
    //     if (index !== -1) {
    //         this.listeners.splice(index, 1);
    //     }
    // }

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