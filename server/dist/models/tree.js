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
    removeGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteObj(id, groupsFile);
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
        });
    }
    removeMultipleConnectors(connectors) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteMultipleObj(connectors, connectorsFile);
        });
    }
    getGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.getFullData(groupsFile);
        });
    }
    getConnectorsList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.getFullData(connectorsFile);
        });
    }
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
//# sourceMappingURL=tree.js.map