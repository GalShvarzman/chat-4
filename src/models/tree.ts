import Group from './group';
import IGroup from './group';
import IUser from "./user";

export default class NTree{
    public root:IGroup;
    constructor(){
        this.root = new Group(this.root, "treeRoot", []);
    }

    public add(node:IGroup| IUser, parentNode:IGroup){
        this.root.add(node, parentNode);
    }
    public search(nodeName:string){
        return this.root.search(nodeName)
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