import Group from './group';
import IGroup from './group';
import IUser from "./user";
import users from "./users";
import User from "./user";
import {db} from "../lib/DB";
const groupFile = 'groups.json';

export class NTree{
    public root:IGroup;
    constructor(){
        this.root = new Group(this.root, "treeRoot", []);
    }

    public add(node:IGroup| IUser, parentNode?:IGroup){
        this.root.add(node, parentNode);
    }
    public search(nodeId:string|undefined){
        return this.root.search(nodeId)
    }
    public removeGroup(node:IGroup){
        return this.root.removeGroup(node);
    }

    public printFullTree(){
        return this.root.printFullTree();
    }
    public async getGroups(){
        // return this.root.getGroups();
        return await db.getData(groupFile);
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

