// import {listeners} from "cluster";
import {usersDb} from "../models/users";
interface IAppService {
    set(key: string, val: any): void,
    get(key: string): any | null,
    subscribe(listener:any): void
}

export class AppService implements IAppService{
    listeners: Function[];

    constructor(){
        this.listeners = [];
    }

    public set(key: string, val: any) {
        StateStore[key] = val;
        this.onStoreChanged();
    }

    public get(key: string) {
        return StateStore[key] || null;
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
    state : {}
}


class StateStore implements IStateStore {
    state:{} = {users: usersDb.getUsers()};

    static instance: IStateStore;

    static getInstance() {
        if (!StateStore.instance) {
            StateStore.instance = new StateStore();
        }

        return StateStore.instance;
    }
}

export default StateStore;

export const appService: AppService = new AppService();
