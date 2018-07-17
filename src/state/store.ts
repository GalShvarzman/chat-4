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
    errorMsg:string|null,
    createNewErrorMsg:string|null,
    updatedGroup:IClientGroup,
    groupsWithGroupsChildren:IClientGroup[],
    selectedGroupDate:{}|null,
    newUser:IClientUser|null,
    newUserErrorMsg:string|null,
    groupOptionalUsers:IClientUser[]|null,
    addUsersToGroupErrorMsg:string|null
}

const initialState:{} = {
    tree:[],
    users:[],
    groups:[],
    selectedMessages:[],
    selectedGroupData:null,
    groupsWithGroupsChildren:[],
    loggedInUser:null,
    loginErrorMsg:null,
    updatedGroup:null,
    errorMsg:null,
    createNewErrorMsg:null,
    newUser:null,
    newUserErrorMsg:null,
    groupOptionalUsers:[],
    addUsersToGroupErrorMsg:null
};

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));


export class StateStoreService {




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