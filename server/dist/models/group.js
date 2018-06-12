"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
const uuid_1 = require("../utils/uuid");
let i = 0;
class Group {
    constructor(parent, name, children) {
        this.array = [];
        this.parent = parent;
        this.name = name;
        this.children = this.array.concat(children || []);
        this.messages = [];
        this.id = uuid_1.create_UUID();
        this.type = 'group';
    }
    flattening() {
        let result = true;
        const parent = this.parent;
        if (parent.children.length === 1) {
            parent.children.length = 0;
            if (this.children) {
                this.children.forEach((child) => {
                    parent.children.push(child);
                    if (child instanceof user_1.default) {
                        const currentResult = child.removeParent(this);
                        if (!currentResult) {
                            result = currentResult;
                        }
                        child.parents.push(parent);
                    }
                    else {
                        child.parent = parent;
                    }
                });
                return result;
            }
            return true;
        }
        else {
            return false;
        }
    }
    getChildrenParentToDetach() {
        return this.walkAllChildrenAndGetParent(this, this.parent);
    }
    walkAllChildrenAndGetParent(node, parent) {
        const childrenParent = [];
        if (node.children) {
            node.children.forEach((child) => {
                if (child instanceof user_1.default) {
                    childrenParent.push({ "user": child, "parent": node });
                }
                if (child.children) {
                    childrenParent.push(...this.walkAllChildrenAndGetParent(child, node));
                }
            });
        }
        return childrenParent;
    }
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
    printFullTree() {
        return [...this.walkTree(this)];
    }
    walkTree(node) {
        const allTree = [];
        if (node.children) {
            node.children.forEach((child) => {
                const node = this.getDetails(child);
                allTree.push(node);
                if (child.children) {
                    this.walkTree(child);
                }
            });
            return allTree;
        }
        return allTree;
    }
    getDetails(child) {
        if (child instanceof Group) {
            const children = child.children.map((child) => {
                return this.getDetails(child);
            });
            return {
                id: child.id,
                type: child.type,
                name: child.name,
                items: children
            };
        }
        else {
            return {
                id: child.id,
                type: child.type,
                name: child.name,
            };
        }
    }
    removeGroup(node) {
        const parent = node.parent;
        const groupIndex = parent.children.findIndex((child) => {
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
    addNodeToSelectedGroup(parentGroup, newNode) {
        const parentGroupChildren = parentGroup.children;
        if (parentGroupChildren.length) {
            const groupFirstChild = parentGroupChildren[0];
            if (groupFirstChild instanceof Group) {
                return this.addNodeToSelectedGroupWhenGroupChildrenAreGroups(parentGroupChildren, newNode, parentGroup);
            }
            else {
                return this.addNodeToSelectedGroupWhenGroupChildrenAreUsers(parentGroupChildren, newNode, parentGroup);
            }
        }
        else {
            return this.addNodeToSelectedGroupWhenGroupHasNoChildren(parentGroupChildren, newNode, parentGroup);
        }
    }
    addNodeToSelectedGroupWhenGroupChildrenAreGroups(parentGroupChildren, newNode, parentGroup) {
        if (newNode instanceof Group) {
            parentGroupChildren.push(newNode);
            newNode.parent = parentGroup;
            return true;
        }
        else {
            return this.checkForOthersGroup(parentGroupChildren, newNode, parentGroup);
        }
    }
    checkForOthersGroup(groupChildren, newNode, parentGroup) {
        const groupOthers = parentGroup.others;
        if (groupOthers) {
            if (groupOthers.isNodeExistInGroup(newNode.id)) {
                return false;
            }
            else {
                groupOthers.children.push(newNode);
                newNode.parents.push(groupOthers);
                return true;
            }
        }
        else {
            parentGroup.others = new Group(parentGroup, "others" + ++i, [newNode]);
            groupChildren.push(parentGroup.others);
            newNode.parents.push(parentGroup.others);
            return true;
        }
    }
    addNodeToSelectedGroupWhenGroupChildrenAreUsers(parentGroupChildren, newNode, parentGroup) {
        if (newNode instanceof user_1.default) {
            parentGroupChildren.push(newNode);
            newNode.parents.push(parentGroup);
        }
        else {
            parentGroup.others = new Group(parentGroup, "others" + ++i, parentGroupChildren);
            parentGroupChildren.length = 0;
            parentGroupChildren.push(parentGroup.others, newNode);
            newNode.parent = parentGroup;
            parentGroup.others.children.forEach((child) => {
                child.removeParent(parentGroup);
                child.parents.push(parentGroup.others);
            });
        }
        return true;
    }
    addNodeToSelectedGroupWhenGroupHasNoChildren(parentGroupChildren, newNode, parentGroup) {
        parentGroupChildren.push(newNode);
        if (newNode instanceof Group) {
            newNode.parent = parentGroup;
        }
        else {
            newNode.parents.push(parentGroup);
        }
        return true;
    }
    add(node, parentNode) {
        if (parentNode) {
            this.addNodeToSelectedGroup(parentNode, node);
        }
        else {
            this.addNodeToSelectedGroup(this, node);
        }
    }
    addUserToGroup(userNode) {
        return this.addNodeToSelectedGroup(this, userNode);
    }
    search(nodeId) {
        return this.internalSearchAll(this, nodeId);
    }
    internalSearchAll(node, nodeId) {
        let result;
        if (node.children) {
            node.children.some((child) => {
                if (child.id === nodeId) {
                    result = child;
                    return true;
                }
                if (child.children) {
                    result = this.internalSearchAll(child, nodeId);
                    if (result) {
                        return true;
                    }
                }
                return false;
            });
        }
        return result;
    }
    myPath() {
        const parents = this.getParents();
        return parents.map((parent) => {
            return parent.name;
        });
    }
    getParents() {
        const parents = [this];
        if (this.parent) {
            parents.unshift(...this.parent.getParents());
        }
        return parents;
    }
    isNodeExistInGroup(nodeId) {
        const nodeIndex = this.children.findIndex((child) => {
            return child.id === nodeId;
        });
        return nodeIndex !== -1;
    }
    getGroupsList() {
        return this.internalSearchAllGroups(this);
    }
    internalSearchAllGroups(node) {
        const results = [];
        if (node.children) {
            node.children.forEach((child) => {
                if (child instanceof Group) {
                    results.push(child);
                }
                if (child.children) {
                    results.push(...this.internalSearchAllGroups(child));
                }
            });
        }
        return results;
    }
    removeUserFromGroup(userName) {
        const userIndex = this.children.findIndex((child) => {
            return child.name === userName;
        });
        if (userIndex !== -1) {
            this.children.splice(userIndex, 1);
            return true;
        }
        else {
            return false;
        }
    }
}
exports.default = Group;
//# sourceMappingURL=group.js.map