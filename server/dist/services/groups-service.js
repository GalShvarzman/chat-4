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
const tree_1 = require("../models/tree");
const users_1 = require("../models/users");
const uuidv4 = require("uuid/v4");
class GroupsService {
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tree_1.nTree.getGroups();
        });
    }
    getGroupsWithGroupsChildren() {
        return __awaiter(this, void 0, void 0, function* () {
            const allGroups = yield tree_1.nTree.getGroups();
            const connectorsList = yield this.getConnectorsList();
            const groupsConnectors = connectorsList.data.filter((connector) => {
                return connector.type === 'group';
            });
            const groupsWithGroupsChildrenIds = [];
            groupsConnectors.forEach((groupConnector) => {
                const connectorChildren = this.getDirectChildrenConnectors(groupConnector.id, connectorsList);
                if (connectorChildren.length && connectorChildren[0].type === 'group' || connectorChildren.length == 0) {
                    groupsWithGroupsChildrenIds.push(groupConnector.id);
                }
            });
            return {
                data: this.getObjData(allGroups.data, groupsWithGroupsChildrenIds, ['name', 'id'])
            };
        });
    }
    saveGroupDetails(groupNewDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = yield tree_1.nTree.getGroups();
            const groupIndex = yield tree_1.nTree.getGroupIndexById(groups, groupNewDetails.id);
            groups.data[groupIndex].name = groupNewDetails.name;
            yield tree_1.nTree.updateFile(groups, 'groups.json');
            return ({ group: { name: groups.data[groupIndex].name, id: groups.data[groupIndex].id } });
        });
    }
    addUsersToGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newConnectors = data.usersIds.map((id) => {
                return {
                    type: 'user',
                    id,
                    pId: data.groupId
                };
            });
            yield tree_1.nTree.addConnectors(newConnectors);
            const usersList = yield users_1.default.getUsersList();
            return this.getObjData(usersList.data, data.usersIds, ['name', 'id', 'age'], 'user');
        });
    }
    createNewGroup(newGroupDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupParentId = newGroupDetails.parent;
            const newId = uuidv4();
            return Promise.all([tree_1.nTree.createNew({ type: 'group', id: newId, pId: groupParentId }, 'connectors.json'),
                tree_1.nTree.createNew({ name: newGroupDetails.name, id: newId }, 'groups.json')])
                .then((results) => {
                return results[1];
            });
        });
    }
    deleteGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectorsList = yield this.getConnectorsList();
            const allChildrenConnectors = this.getAllChildrenConnectors(connectorsList, groupId);
            const childrenConnectorsTypeGroup = allChildrenConnectors.filter(child => child.type === 'group');
            const childrenConnectorsTypeGroupIds = childrenConnectorsTypeGroup.map(connector => connector.id);
            yield tree_1.nTree.removeMultipleGroups([...childrenConnectorsTypeGroupIds, groupId]);
            const groupConnector = this.getGroupConnector(groupId, connectorsList);
            yield tree_1.nTree.removeMultipleConnectors([...allChildrenConnectors, groupConnector]);
        });
    }
    getAllChildrenConnectors(connectorsList, groupId) {
        const result = [];
        const groupDirectChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);
        result.push(...groupDirectChildrenConnectors);
        if (groupDirectChildrenConnectors[0].type === 'group') {
            groupDirectChildrenConnectors.forEach((child) => {
                result.push(...this.getAllChildrenConnectors(connectorsList, child.id));
            });
        }
        return result;
    }
    getGroupData(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectorsList = yield this.getConnectorsList();
            const groupConnector = this.getGroupConnector(groupId, connectorsList);
            const groups = yield this.getAllGroups();
            let groupParentDetails = groups.data.find((group) => {
                return group.id === groupConnector.pId;
            });
            if (!groupParentDetails) {
                groupParentDetails = { name: 'No parent', id: "" };
            }
            const groupChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);
            const groupChildrenIds = groupChildrenConnectors.map((child) => {
                return child.id;
            });
            if (groupChildrenConnectors.length) {
                let groupChildren;
                if (groupChildrenConnectors[0].type === 'user') {
                    const usersList = yield users_1.default.getUsersList();
                    groupChildren = this.getObjData(usersList.data, groupChildrenIds, ['name', 'id', 'age'], 'user');
                }
                else {
                    groupChildren = this.getObjData(groups.data, groupChildrenIds, ['name', 'id'], 'group');
                }
                return ({ data: [{ groupParent: groupParentDetails }, { groupChildren }] });
            }
            return ({ data: [{ groupParent: groupParentDetails }, { groupChildren: [] }] });
        });
    }
    getConnectorsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tree_1.nTree.getConnectorsList();
        });
    }
    getGroupConnector(id, connectorsList) {
        return connectorsList.data.find((obj) => {
            return obj.id === id;
        });
    }
    getDirectChildrenConnectors(id, connectorsList) {
        return connectorsList.data.filter((el) => {
            return el.pId === id;
        });
    }
    deleteUserFromGroup(groupId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectorsList = yield this.getConnectorsList();
            const connectorToDeleteIndex = connectorsList.data.findIndex((connector) => {
                return connector.id === userId && connector.pId === groupId;
            });
            connectorsList.data.splice(connectorToDeleteIndex, 1);
            tree_1.nTree.updateFile(connectorsList, 'connectors.json');
        });
    }
    getGroupOptionalChildren(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectorsList = yield this.getConnectorsList();
            const groupChildrenConnectors = this.getDirectChildrenConnectors(groupId, connectorsList);
            let usersListFullData = yield users_1.default.getUsersList();
            const usersList = usersListFullData.data.map((user) => {
                return { "name": user.name, "age": user.age, "id": user.id };
            });
            if (groupChildrenConnectors.length) {
                const groupChildrenIds = groupChildrenConnectors.map((child) => {
                    return child.id;
                });
                return usersList.filter((user) => {
                    return groupChildrenIds.indexOf(user.id) == -1;
                });
            }
            else {
                return usersList;
            }
        });
    }
    getObjData(arr, idsArr, keysToExtract, type) {
        const result = [];
        for (let i = 0; i < arr.length; i++) {
            const el = arr[i];
            if (idsArr.indexOf(el.id) > -1) {
                const obj = { type };
                keysToExtract.forEach((key) => {
                    obj[key] = el[key];
                });
                result.push(obj);
            }
        }
        return result;
    }
}
const groupsService = new GroupsService();
exports.default = groupsService;
//# sourceMappingURL=groups-service.js.map