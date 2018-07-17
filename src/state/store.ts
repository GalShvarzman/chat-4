import {IMessage} from "../models/message";
import {IClientGroup, IClientUser} from "../interfaces";
import { applyMiddleware, createStore, compose  } from 'redux';
import thunk from 'redux-thunk';
import {reducer} from "./reducer";

export interface IState {
    users:IClientUser[],
    groups:IClientGroup[],
    selectedMessages:IMessage[],
    loggedInUser:IClientUser | null,
    errorMsg:string|null,
    updatedGroup:IClientGroup | null,
    groupsWithGroupsChildren:IClientGroup[],
    selectedGroupData:{}|null,
    newUser:IClientUser|null,
    groupOptionalUsers:IClientUser[]|null
}

const initialState:{} = {
    users:[],
    groups:[],
    selectedMessages:[],
    selectedGroupData:null,
    groupsWithGroupsChildren:[],
    loggedInUser:null,
    updatedGroup:null,
    errorMsg:null,
    newUser:null,
    groupOptionalUsers:[]
};

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));