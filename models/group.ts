import User from './user';
import IUser from './user';
let i = 0;
export default interface IGroup{
    parent : IGroup,
    name : string,
    children : any[],
    others?:IGroup,
    getParents() : IGroup[],
    isNodeExistInGroup(name:string):boolean
}

export default class Group implements IGroup{
    public array : any[] = [];
    public parent: IGroup;
    public name: string;
    public children: any[];
    constructor(parent:IGroup, name:string, children:IGroup[]|IUser[]) {
        this.parent = parent;
        this.name = name;
        this.children = this.array.concat(children||[]);
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
        return [{"child":this, "step":0} , ...this.walkTree(this, 1)]
    }

    public walkTree(node:IGroup, step:number){
        const allTree:any[] = [];
        if(node.children){
            node.children.forEach((child)=>{
                allTree.push({child, step});
                if(child.children){
                    allTree.push(...this.walkTree(child, step+1));
                }
            });
            return allTree;
        }
        return allTree;
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
            if((groupOthers as IGroup).isNodeExistInGroup(newNode.name)){
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


    public search(nodeName:string) {
        return this.internalSearchAll(this, nodeName);
    }

    public internalSearchAll(node:IGroup, nodeName:string) {
        const results:IGroup[] = [];
        if (node.children) {
            node.children.forEach((child) => {
                if (child.name === nodeName) {
                    results.push(child);
                }
                if(child.children){
                    results.push(...this.internalSearchAll(child, nodeName))
                }
            });
            // return results;
        }
        return results;
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

    public isNodeExistInGroup(name:string) {
        const nodeIndex = this.children.findIndex((child:IGroup|IUser) => {
            return child.name === name;
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