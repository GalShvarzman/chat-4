import Group from './group';
import IGroup from './group';
import IUser from "./user";
import users from "./users";
import User from "./user";
import {db} from "../lib/DB";
const groupsFile = 'groups.json';
const connectorsFile = 'connectors.json';

export class NTree{
    public root:IGroup;
    constructor(){
        this.root = new Group(this.root, "treeRoot", []);
    }

    public add(node:IGroup| IUser, parentNode?:IGroup){
        this.root.add(node, parentNode);
    }

    public async createNew(newDetails, fileName){
        return await db.createNew(newDetails, fileName);
    }

    public async addConnectors(data):Promise<void>{
        await db.createMultipleNew(data, 'connectors.json');
    }

    public search(nodeId:string|undefined){
        return this.root.search(nodeId)
    }

    async removeGroup(id:string){
        return await db.deleteObj(id, groupsFile);
        // return this.root.removeGroup(node);
    }

    async removeMultipleGroups(ids:string[]){
        return await db.deleteMultipleObjById(ids, groupsFile);
    }

    async removeConnector(id:string){
        return await db.deleteObj(id, connectorsFile);
        // return this.root.removeGroup(node);
    }

    async removeMultipleConnectors(connectors:string[]){
        return await db.deleteMultipleObj(connectors, connectorsFile);
        // return this.root.removeGroup(node);
    }


    public printFullTree(){
        return this.root.printFullTree();
    }
    public async getGroups(){
        // return this.root.getGroups();
        return await db.getData(groupsFile);
    }

    public async getConnectorsList():Promise<{data:{type:string, id:string, pId:string}[]}>{
        return await db.getData(connectorsFile);
    }

    public isNodeExistInGroup(name:string){
        return this.root.isNodeExistInGroup(name);
    }
}

export const nTree:NTree = new NTree();

// const friends = new Group(nTree.root, "Friends", []);
// const bestFriends = new Group(friends, "Best Friends", []);
//
// nTree.add(friends);
// nTree.add(bestFriends, friends);
// nTree.add(new User("Tommy", 27, "123"), bestFriends);
// nTree.add(new User("Ori", 27, "123"), bestFriends);
// nTree.add(new User("Roni", 27, "123"));
// nTree.add(new User("Udi", 27, "123"));

