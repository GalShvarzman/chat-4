import {usersDb} from "../models/users";
import IUser from "../models/user";

interface IStateStoreService {
    set(key: string, val: any): void,
    get(key: string): any | null,
    subscribe(listener:any): void
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
    users : IUser[]
}


class StateStore implements IStateStore {
    users:IUser[] = usersDb.getUsers();

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
