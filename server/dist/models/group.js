"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const uuidv4 = require("uuid/v4");
let i = 0;
class Group {
    constructor(name) {
        this.name = name;
        this.id = uuidv4();
    }
    // public flattening() {
    //     let result:boolean = true;
    //     const parent:IGroup = this.parent;
    //     if(parent.children.length === 1) {
    //         parent.children.length = 0;
    //         if(this.children){
    //             this.children.forEach((child)=>{
    //                 parent.children.push(child);
    //                 if(child instanceof User){
    //                     const currentResult = child.removeParent(this);
    //                     if(!currentResult){
    //                         result = currentResult;
    //                     }
    //                     child.parents.push(parent);
    //                 }
    //                 else{
    //                     (child as IGroup).parent = parent;
    //                 }
    //             });
    //             return result;
    //         }
    //        return true;
    //     }
    //     else{
    //         return false
    //     }
    // }
    // public getChildrenParentToDetach(){
    //     return this.walkAllChildrenAndGetParent(this, this.parent);
    // }
    //
    // public walkAllChildrenAndGetParent(node:IGroup, parent:IGroup){
    //     const childrenParent:any[] = [];
    //     if(node.children){
    //         node.children.forEach((child)=>{
    //             if(child instanceof User){
    //                 childrenParent.push({"user":child, "parent": node});
    //             }
    //             if((child as IGroup).children){
    //                 childrenParent.push(...this.walkAllChildrenAndGetParent(child, node));
    //             }
    //         });
    //     }
    //     return childrenParent;
    // }
    getNumberOfChildren() {
        return this.walkChildren(this);
    }
    walkChildren(node) {
        let allChildren = 0;
        if (node.children) {
            node.children.forEach((child) => {
                if (child instanceof user_1.default) {
                    allChildren += 1;
                }
                if (child.children) {
                    allChildren += this.walkChildren(child);
                }
            });
        }
        return allChildren;
    }
}
exports.default = Group;
//# sourceMappingURL=group.js.map