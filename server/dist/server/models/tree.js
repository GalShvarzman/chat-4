"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = require("./group");
class NTree {
    constructor() {
        this.root = new group_1.default(this.root, "treeRoot", []);
    }
    add(node, parentNode) {
        this.root.add(node, parentNode);
    }
    search(nodeId) {
        return this.root.search(nodeId);
    }
    removeGroup(node) {
        return this.root.removeGroup(node);
    }
    printFullTree() {
        return this.root.printFullTree();
    }
    getGroupsList() {
        return this.root.getGroupsList();
    }
    isNodeExistInGroup(name) {
        return this.root.isNodeExistInGroup(name);
    }
}
exports.default = NTree;
exports.nTree = new NTree();
const friends = new group_1.default(exports.nTree.root, "Friends", []);
const bestFriends = new group_1.default(friends, "Best Friends", []);
// nTree.add(friends);
// nTree.add(bestFriends, friends);
// nTree.add(users.getUser('Tommy'), bestFriends);
// nTree.add(users.getUser('Udi'), bestFriends);
// nTree.add(users.getUser('Ori'));
// nTree.add(users.getUser('Roni'));
//# sourceMappingURL=tree.js.map