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
    getGroupData(groupId) {
        return __awaiter(this, void 0, void 0, function* () {
            const connectorsList = yield tree_1.nTree.getConnectorsList();
            const groupConnector = connectorsList.data.find((obj) => {
                return obj.id === groupId;
            });
            const groups = yield tree_1.nTree.getGroups();
            let groupParent = groups.data.find((group) => {
                return group.id === groupConnector.pId;
            });
            if (!groupParent) {
                groupParent = 'root';
            }
            const groupChildrenConnectors = connectorsList.data.filter((obj) => {
                return obj.pId === groupId;
            });
            const groupChildrenIds = groupChildrenConnectors.map((child) => {
                return child.id;
            });
            let groupChildren;
            if (groupChildrenConnectors[0].type === 'user') {
                const usersList = yield users_1.default.getUsersList(); // fixme האם זה בסדר לגשת מפה ליוזרים?
                groupChildren = this.arrayDiff(usersList.data, groupChildrenIds);
            }
            return ({ data: [{ groupParent }, { groupChildren }] });
        });
    }
    arrayDiff(arr1, arr2) {
        const result = [];
        arr1.sort();
        arr2.sort();
        for (let i = 0; i < arr1.length; i += 1) {
            if (arr2.indexOf(arr1[i].id) > -1) {
                result.push({ name: arr1[i].name, age: arr1[i].age, id: arr1[i].id });
            }
        }
        return result;
    }
    ;
}
const groupsService = new GroupsService();
exports.default = groupsService;
//# sourceMappingURL=groups-service.js.map