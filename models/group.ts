//const {User} = require('./user');
let i = 0;
interface IGroup{
    parent : IGroup,
    name : string,
    children : any[],
    others?:IGroup,
    getParents() : IGroup[]
}

class Group implements IGroup{
    public array : any[] = [];
    public parent: IGroup;
    public name: string;
    public children: object[];
    constructor(parent:IGroup, name:string, children:IGroup[]|IUser[]) {
        this.parent = parent;
        this.name = name;
        this.children = this.array.concat(children||[]);
    }

    flattening() {
        let result:boolean = true;
        let parent = this.parent;
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
                        (child as Group).parent = parent;
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

    getChildrenParentToDetach(){
        return this.walkAllChildrenAndGetParent(this, this.parent);
    }

    walkAllChildrenAndGetParent(node:IGroup, parent:IGroup){
        const childrenParent:any[] = [];
        if(node.children){
            node.children.forEach((child)=>{
                if(child instanceof User){
                    childrenParent.push({"user":child, "parent": node});
                }
                if(child.children){
                    childrenParent.push(...this.walkAllChildrenAndGetParent(child, node));
                }
            });
            return childrenParent;
        }
        return childrenParent; //check
    }

    getNumberOfChildren(){
        return this.walkChildren(this);
    }

    walkChildren(node:any){
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
            return allChildren;
        }
        return allChildren;
    }

    printFullTree(){
        return [{"child":this, "step":0} , ...this.walkTree(this, 1)]
    }

    walkTree(node:IGroup, step:number){
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

    removeGroup(node:IGroup) {
        let parent = node.parent;
        let i = parent.children.findIndex((child) => {
            return child.name === node.name;
        });
        if (i !== -1) {
            parent.children.splice(i, 1);
            return true;
        }
        else {
            return false;
        }
    }

    addNodeToSelectedGroup(parentGroup:IGroup, newNode: IGroup | IUser) {
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

    addNodeToSelectedGroupWhenGroupChildrenAreGroups(parentGroupChildren:IGroup[]|IUser[], newNode:IGroup | IUser, parentGroup:IGroup){
        if(newNode instanceof Group) {
            (parentGroupChildren as IGroup[]).push(newNode);
            newNode.parent = parentGroup;
            return true;
        }
        else{
            return this.checkForOthersGroup(parentGroupChildren, newNode, parentGroup);
        }
    }

    checkForOthersGroup(groupChildren:IGroup[]|IUser[], newNode:IUser|IGroup, parentGroup:IGroup){
        const groupOthers = parentGroup.others;
        if (groupOthers) {
            if((groupOthers as Group).isNodeExistInGroup(newNode.name)){
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


    addNodeToSelectedGroupWhenGroupChildrenAreUsers(parentGroupChildren:IUser[]|IGroup[], newNode:IGroup|IUser, parentGroup:IGroup){
        if(newNode instanceof User){
            (parentGroupChildren as IUser[]).push(newNode);
            newNode.parents.push(parentGroup);
        }
        else{
            parentGroup.others = new Group(parentGroup, "others" + ++i, parentGroupChildren);
            parentGroupChildren.length = 0;
            (parentGroupChildren as IGroup[]).push(parentGroup.others, newNode as IGroup);
            (newNode as Group).parent = parentGroup;

            parentGroup.others.children.forEach((child) => {
                child.removeParent(parentGroup);
                child.parents.push(parentGroup.others);
            });
        }
        return true;
    }

    addNodeToSelectedGroupWhenGroupHasNoChildren(parentGroupChildren:IGroup[]|IUser[], newNode:IGroup|IUser, parentGroup:IGroup){
        (parentGroupChildren as any[]).push(newNode);
        if (newNode instanceof Group) {
            newNode.parent = parentGroup;
        }
        else {
            (newNode as User).parents.push(parentGroup);
        }
        return true;
    }

    add(node:IGroup|IUser, parentNode:IGroup) {
        if (parentNode) {
            this.addNodeToSelectedGroup(parentNode, node);
        }
        else {
            this.addNodeToSelectedGroup(this, node);
        }
    }

    addUserToGroup(userNode:IUser) {
        return this.addNodeToSelectedGroup(this, userNode)
    }


    search(nodeName:string) {
        return this.internalSearchAll(this, nodeName);
    }

    internalSearchAll(node:IGroup, nodeName:string) {
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
            //return results;
        }
        return results;
    }

    myPath() {
        const parents = this.getParents();
        return parents.map((parent) => {
            return parent.name;
        });
    }

    getParents() {
        const parents:IGroup[] = [this];
        if (this.parent) {
            parents.unshift(...this.parent.getParents());
        }
        return parents;
    }

    isNodeExistInGroup(name:string) {
        const i = this.children.findIndex((child:IGroup|IUser) => {
            return child.name === name;
        });
        return i !== -1;
    }

    getGroupsList() {
        return this.internalSearchAllGroups(this)
    }

    internalSearchAllGroups(node:IGroup) {
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
            //return results;
        }
        return results;
    }

    removeUserFromGroup(userName:string){
        let i = this.children.findIndex((child:IUser)=>{
                    return child.name === userName
                });
        if(i !== -1){
            this.children.splice(i ,1);
            return true;
        }
        else{
            return false;
        }
    }
}

export default Group;