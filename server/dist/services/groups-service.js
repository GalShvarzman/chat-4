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
class GroupsService {
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tree_1.nTree.getGroups();
        });
    }
    deleteGroup(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectorsList = yield this.getConnectorsList();
            const allChildrenConnectors = this.getAllChildrenConnectors(connectorsList, groupId);
            const childrenConnectorsTypeGroup = allChildrenConnectors.filter(child => child.type === 'group');
            const childrenConnectorsTypeGroupIds = childrenConnectorsTypeGroup.map(connector => connector.id);
            yield tree_1.nTree.removeMultipleGroups([...childrenConnectorsTypeGroupIds, groupId]);
            // const allChildrenConnectorsIds = allChildrenConnectors.map(connector => connector.id);
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
            let groupChildren;
            if (groupChildrenConnectors[0].type === 'user') {
                const usersList = yield users_1.default.getUsersList();
                groupChildren = this.getChildrenData(usersList.data, groupChildrenIds, 'user');
            }
            else {
                groupChildren = this.getChildrenData(groups.data, groupChildrenIds, 'group');
            }
            return ({ data: [{ groupParent: groupParentDetails }, { groupChildren }] });
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
        return connectorsList.data.filter((obj) => {
            return obj.pId === id;
        });
    }
    getChildrenData(arr1, arr2, type) {
        const result = [];
        for (let i = 0; i < arr1.length; i++) {
            if (arr2.indexOf(arr1[i].id) > -1) {
                result.push({ name: arr1[i].name, id: arr1[i].id, type });
            }
        }
        return result;
    }
}
const groupsService = new GroupsService();
exports.default = groupsService;
//# sourceMappingURL=groups-service.js.map