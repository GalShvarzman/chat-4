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
class GroupsService {
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            const tree = yield tree_1.nTree.getTree();
            tree.data = this.internalSearchAllGroups(tree.data);
            return tree;
        });
    }
    internalSearchAllGroups(node) {
        const results = [];
        if (node.children) {
            node.children.forEach((child) => {
                if (child.type === 'group') {
                    results.push(child);
                }
                if (child.children) {
                    results.push(...this.internalSearchAllGroups(child));
                }
            });
        }
        return results;
    }
}
const groupsService = new GroupsService();
exports.default = groupsService;
//# sourceMappingURL=groups-service.js.map