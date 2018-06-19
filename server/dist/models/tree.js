"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const group_1 = require("./group");
const DB_1 = require("../lib/DB");
const groupsFile = 'groups.json';
const connectorsFile = 'connectors.json';
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
    getGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.root.getGroups();
            return yield DB_1.db.getData(groupsFile);
        });
    }
    getConnectorsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.getData(connectorsFile);
        });
    }
    isNodeExistInGroup(name) {
        return this.root.isNodeExistInGroup(name);
    }
}
exports.NTree = NTree;
exports.nTree = new NTree();
// const friends = new Group(nTree.root, "Friends", []);
// const bestFriends = new Group(friends, "Best Friends", []);
//
// nTree.add(friends);
// nTree.add(bestFriends, friends);
// nTree.add(new User("Tommy", 27, "123"), bestFriends);
// nTree.add(new User("Ori", 27, "123"), bestFriends);
// nTree.add(new User("Roni", 27, "123"));
// nTree.add(new User("Udi", 27, "123"));
//# sourceMappingURL=tree.js.map