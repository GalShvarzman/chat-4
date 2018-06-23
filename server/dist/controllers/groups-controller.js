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
const services = require("../services");
class GroupsController {
    getGroups(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                if (req.query['groups_with_children'] == 'true') {
                    res.status(200).json(yield services.groupService.getGroupsWithGroupsChildren());
                }
                else {
                    res.status(200).json(yield services.groupService.getAllGroups());
                }
            }));
        });
    }
    getGroupData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                res.status(200).json(yield services.groupService.getGroupData(req.params.id));
            }));
        });
    }
    deleteGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                yield services.groupService.deleteGroup(req.params.id);
                res.status(204).send("");
            }));
        });
    }
    createNewGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                const group = yield services.groupService.createNewGroup(req.body);
                res.status(200).json(group);
            }));
        });
    }
    addUsersToGroup(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                const addedGroups = yield services.groupService.addUsersToGroup(req.body);
                res.status(200).json(addedGroups);
            }));
        });
    }
}
function tryCatch(next, func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield func();
        }
        catch (err) {
            next(err);
        }
    });
}
const groupsController = new GroupsController();
exports.default = groupsController;
//# sourceMappingURL=groups-controller.js.map