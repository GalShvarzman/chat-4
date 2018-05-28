import {usersDb} from "../models/users";
import IUser, {default as User} from "../models/user";
import {nTree} from '../models/tree';
import NTree from '../models/tree';
import IGroup, {default as Group} from "../models/group";
interface IStateStoreService {
    set(key: string, val: any): void,
    get(key: string): any | null,
    subscribe(listener:any): void,
    // getUser(name: string):IUser
}

export class StateStoreService implements IStateStoreService{
    listeners: Function[];

    constructor(){
        this.listeners = [];
    }

    public set(key: string, val: any) {debugger
        StateStore.getInstance()[key] = val;
        this.onStoreChanged();
    }

    public get(key: string) {
        return StateStore.getInstance()[key] || null;
    }

    public addMassage(massage:string, selected:IGroup|IUser|undefined, loggedInUser:IUser|undefined){debugger
        if(selected instanceof Group){
            selected.addMassage(massage);
        }
        else if(selected instanceof User){
            selected.addMassage(massage, loggedInUser);
        }
        this.onStoreChanged();
    }

    public getMassages(match: IUser | IGroup, loggedInUserName?:string){
        if(match instanceof User){
            return match.getMassages(loggedInUserName)
        }
        return match.getMassages();
    }

    public getUser(name: string){
        return usersDb.getUser(name)
    }

    public search(name:string){
        return nTree.search(name);
    }

    public auth(user:{name:string, password:string}){
        const currentUser = usersDb.getUser(user.name);
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
    users : IUser[],
    tree:NTree,
    // groups:IGroup[]
}


class StateStore implements IStateStore {
    public users:IUser[] = usersDb.getUsers();
    public tree:NTree = nTree;
    // public groups:IGroup[] = nTree.getGroupsList();

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
