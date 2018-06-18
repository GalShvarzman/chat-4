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
class UsersController {
    saveUserDetails(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                yield services.usersService.saveUserDetails(req.body);
                res.status(201).json({ message: "User details have been updated successfully" });
            }));
        });
    }
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                res.status(200).json(yield services.usersService.getAllUsers());
            }));
        });
    }
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                yield services.usersService.deleteUser(req.body);
                res.status(200).json({ message: "User deleted successfully" });
            }));
        });
    }
    createNewUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                const user = yield services.usersService.createNewUser(req.body);
                res.status(200).json(user);
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
const usersController = new UsersController();
exports.default = usersController;
//# sourceMappingURL=users-controller.js.map