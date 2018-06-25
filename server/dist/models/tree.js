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
const DB_1 = require("../lib/DB");
const groupsFile = 'groups.json';
const connectorsFile = 'connectors.json';
class NTree {
    constructor() {
        // this.root = new Group(this.root, "treeRoot", []);
    }
    // public add(node:IGroup| IUser, parentNode?:IGroup){
    //     this.root.add(node, parentNode);
    // }
    createNew(newDetails, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.createNew(newDetails, fileName);
        });
    }
    addConnectors(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_1.db.createMultipleNew(data, 'connectors.json');
        });
    }
    // public search(nodeId:string|undefined){
    //     return this.root.search(nodeId)
    // }
    removeGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteObj(id, groupsFile);
            // return this.root.removeGroup(node);
        });
    }
    removeMultipleGroups(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteMultipleObjById(ids, groupsFile);
        });
    }
    removeConnector(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteObj(id, connectorsFile);
            // return this.root.removeGroup(node);
        });
    }
    removeMultipleConnectors(connectors) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteMultipleObj(connectors, connectorsFile);
            // return this.root.removeGroup(node);
        });
    }
    //
    // public printFullTree(){
    //     return this.root.printFullTree();
    // }
    getGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.root.getGroups();
            return yield DB_1.db.getFullData(groupsFile);
        });
    }
    getConnectorsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.getFullData(connectorsFile);
        });
    }
    // public isNodeExistInGroup(name:string){
    //     return this.root.isNodeExistInGroup(name);
    // }
    getGroupIndexById(groups, groupId) {
        return DB_1.db.getObjIndexById(groups, groupId);
    }
    updateFile(newData, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_1.db.updateFile(newData, fileName);
        });
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