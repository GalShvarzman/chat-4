import Group from './group';
import IGroup from './group';
import IUser from "./user";
import {usersDb} from "./users";

export default class NTree{
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
    public getGroupsList(){
        return this.root.getGroupsList();
    }
    public isNodeExistInGroup(name:string){
        return this.root.isNodeExistInGroup(name);
    }
}

export const nTree:NTree = new NTree();

const friends = new Group(nTree.root, "Friends", []);
const bestFriends = new Group(friends, "Best Friends", []);

nTree.add(friends);
nTree.add(bestFriends, friends);
nTree.add(usersDb.getUser('Tommy'), bestFriends);
nTree.add(usersDb.getUser('Udi'), bestFriends);
nTree.add(usersDb.getUser('Ori'));
nTree.add(usersDb.getUser('Roni'));
