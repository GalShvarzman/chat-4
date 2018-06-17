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
const users_1 = require("../models/users");
class UsersService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_1.default.getUsers();
        });
    }
    saveUserDetails(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_1.default.updateUserDetails(userDetails);
        });
    }
    deleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_1.default.deleteUser(user.name);
        });
    }
}
const usersService = new UsersService();
exports.default = usersService;
//# sourceMappingURL=users-service.js.map