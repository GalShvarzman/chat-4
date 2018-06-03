import User from './user';
import IUser from './user';
import {IMessage} from "../models/message";
import {create_UUID} from '../utils/uuid';

let i = 0;

export default interface IGroup{
    parent : IGroup,
    name : string,
    children : any[],
    id:string;
    others?:IGroup,
    messages:IMessage[],
    type:string;
    getParents() : IGroup[],
    isNodeExistInGroup(nodeId:string):boolean,
    add(node:IGroup| IUser, parentNode?:IGroup):void,
    search(nodeId:string|undefined): IUser|IGroup,
    removeGroup(node:IGroup):boolean,
    printFullTree():any[],
    getGroupsList():IGroup[]
}

export default class Group implements IGroup{
    public array : any[] = [];
    public id:string;
    public parent: IGroup;
    public name: string;
    public children: any[];
    public messages: IMessage[];
    public type:string;

    constructor(parent:IGroup, name:string, children:IGroup[]|IUser[]) {
        this.parent = parent;
        this.name = name;
        this.children = this.array.concat(children||[]);
        this.messages = [];
        this.id = create_UUID();
        this.type = 'group';
    }

    public flattening() {
        let result:boolean = true;
        const parent:IGroup = this.parent;
        if(parent.children.length === 1) {
            parent.children.length = 0;
            if(this.children){
                this.children.forEach((child)=>{
                    parent.children.push(child);
                    if(child instanceof User){
                        const currentResult = child.removeParent(this);
                        if(!currentResult){
                            result = currentResult;
                        }
                        child.parents.push(parent);
                    }
                    else{
                        (child as IGroup).parent = parent;
                    }
                });
                return result;
            }
           return false // check
        }
        else{
            return false
        }
    }

    public getChildrenParentToDetach(){
        return this.walkAllChildrenAndGetParent(this, this.parent);
    }

    public walkAllChildrenAndGetParent(node:IGroup, parent:IGroup){
        const childrenParent:any[] = [];
        if(node.children){
            node.children.forEach((child)=>{
                if(child instanceof User){
                    childrenParent.push({"user":child, "parent": node});
                }
                if((child as IGroup).children){
                    childrenParent.push(...this.walkAllChildrenAndGetParent(child, node));
                }
            });
            return childrenParent;
        }
        return childrenParent; // check
    }

    public getNumberOfChildren(){
        return this.walkChildren(this);
    }

    public walkChildren(node:any){
        let allChildren = 0;
        if(node.children){
            node.children.forEach((child:any)=>{
                if(child instanceof User){
                    allChildren += 1;
                }
                if(child.children){
                    allChildren += this.walkChildren(child);
                }
            });
            // return allChildren;
        }
        return allChildren;
    }

    public printFullTree(){
        return [...this.walkTree(this)]
    }

    public walkTree(node:IGroup){
        const allTree:any[] = [];
        if(node.children){
            node.children.forEach((child)=>{
                const node = this.getDetails(child);
                allTree.push(node);
                if(child.children){
                    this.walkTree(child)
                }
            });
            return allTree;
        }
        return allTree;
    }

    public getDetails(child:IUser|IGroup){
        if(child instanceof Group){
            const children:any[] = child.children.map((child)=>{
                return this.getDetails(child);
            });
            return{
                id: child.id,
                type:child.type,
                name:child.name,
                items:children
            }
        }
        else{
            return{
                id:child.id,
                type:child.type,
                name:child.name,
            }
        }
    }

    public removeGroup(node:IGroup) {
        const parent:IGroup = node.parent;
        const groupIndex:number = parent.children.findIndex((child) => {
            return child.name === node.name;
        });
        if (groupIndex !== -1) {
            parent.children.splice(groupIndex, 1);
            return true;
        }
        else {
            return false;
        }
    }

    public addNodeToSelectedGroup(parentGroup:IGroup, newNode: IGroup | IUser) {
        const parentGroupChildren: IGroup[]| IUser[] = parentGroup.children;
        if (parentGroupChildren.length) {
            const groupFirstChild: IGroup|IUser = parentGroupChildren[0];
            if (groupFirstChild instanceof Group){
                return this.addNodeToSelectedGroupWhenGroupChildrenAreGroups(parentGroupChildren, newNode, parentGroup);
            }
            else {
                return this.addNodeToSelectedGroupWhenGroupChildrenAreUsers(parentGroupChildren, newNode, parentGroup)
            }
        }
        else {
            return this.addNodeToSelectedGroupWhenGroupHasNoChildren(parentGroupChildren, newNode, parentGroup);
        }
    }

    public addNodeToSelectedGroupWhenGroupChildrenAreGroups(parentGroupChildren:IGroup[]|IUser[], newNode:IGroup | IUser, parentGroup:IGroup){
        if(newNode instanceof Group) {
            (parentGroupChildren as IGroup[]).push(newNode);
            newNode.parent = parentGroup;
            return true;
        }
        else{
            return this.checkForOthersGroup(parentGroupChildren, newNode, parentGroup);
        }
    }

    public checkForOthersGroup(groupChildren:IGroup[]|IUser[], newNode:IUser|IGroup, parentGroup:IGroup){
        const groupOthers = parentGroup.others;
        if (groupOthers) {
            if((groupOthers as IGroup).isNodeExistInGroup(newNode.id)){
                return false;
            }
            else{
                groupOthers.children.push(newNode);
                (newNode as User).parents.push(groupOthers);
                return true;
            }
        }
        else {
            parentGroup.others = new Group(parentGroup, "others" + ++i, [newNode as IUser]);
            (groupChildren as IGroup[]).push(parentGroup.others);
            (newNode as User).parents.push(parentGroup.others);
            return true;
        }

        // if(parentGroup.others){ // fixme
        //     (newNode as User).parents.push(parentGroup.others);
        //     return true;
        // }
        // else{
        //     return false;
        // }
    }


    public addNodeToSelectedGroupWhenGroupChildrenAreUsers(parentGroupChildren:IUser[]|IGroup[], newNode:IGroup|IUser, parentGroup:IGroup){
        if(newNode instanceof User){
            (parentGroupChildren as IUser[]).push(newNode);
            newNode.parents.push(parentGroup);
        }
        else{
            parentGroup.others = new Group(parentGroup, "others" + ++i, parentGroupChildren);
            parentGroupChildren.length = 0;
            (parentGroupChildren as IGroup[]).push(parentGroup.others, newNode as IGroup);
            (newNode as IGroup).parent = parentGroup;

            parentGroup.others.children.forEach((child) => {
                child.removeParent(parentGroup);
                child.parents.push(parentGroup.others);
            });
        }
        return true;
    }

    public addNodeToSelectedGroupWhenGroupHasNoChildren(parentGroupChildren:IGroup[]|IUser[], newNode:IGroup|IUser, parentGroup:IGroup){
        (parentGroupChildren as any[]).push(newNode);
        if (newNode instanceof Group) {
            newNode.parent = parentGroup;
        }
        else {
            (newNode as User).parents.push(parentGroup);
        }
        return true;
    }

    public add(node:IGroup|IUser, parentNode:IGroup) {
        if (parentNode) {
            this.addNodeToSelectedGroup(parentNode, node);
        }
        else {
            this.addNodeToSelectedGroup(this, node);
        }
    }

    public addUserToGroup(userNode:IUser) {
        return this.addNodeToSelectedGroup(this, userNode)
    }


    public search(nodeId:string) {
        return this.internalSearchAll(this, nodeId);
    }

    public internalSearchAll(node:IGroup, nodeId:string) : any{
        let result;
        if (node.children) {
            node.children.some((child) => {
                if (child.id === nodeId) {
                    result = child;
                    return true;
                }
                if(child.children){
                    result = this.internalSearchAll(child, nodeId);
                    if(result){
                        return true;
                    }
                }
                return false;
            });
        }
        return result;
    }

    public myPath() {
        const parents = this.getParents();
        return parents.map((parent) => {
            return parent.name;
        });
    }

    public getParents() {
        const parents:IGroup[] = [this];
        if (this.parent) {
            parents.unshift(...this.parent.getParents());
        }
        return parents;
    }

    public isNodeExistInGroup(nodeId:string) {
        const nodeIndex = this.children.findIndex((child:IGroup|IUser) => {
            return child.id === nodeId;
        });
        return nodeIndex !== -1;
    }

    public getGroupsList() {
        return this.internalSearchAllGroups(this)
    }

    public internalSearchAllGroups(node:IGroup) {
        const results:IGroup[] = [];
        if (node.children) {
            node.children.forEach((child) => {
                if (child instanceof Group) {
                    results.push(child);
                }
                if(child.children){
                    results.push(...this.internalSearchAllGroups(child));
                }
            });
            // return results;
        }
        return results;
    }

    public removeUserFromGroup(userName:string){
        const userIndex = this.children.findIndex((child:IUser)=>{
                    return child.name === userName
                });
        if(userIndex !== -1){
            this.children.splice(userIndex ,1);
            return true;
        }
        else{
            return false;
        }
    }
}