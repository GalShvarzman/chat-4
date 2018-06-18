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
const uuid_1 = require("../utils/uuid");
const hash_1 = require("../utils/hash");
const client_error_1 = require("../utils/client-error");
class UsersService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_1.default.getUsersList();
        });
    }
    saveUserDetails(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersData = yield users_1.default.getUsersFullData();
            const userIndex = users_1.default.getUserIndexById(usersData, userDetails.id);
            if (userDetails.age) {
                usersData.data[userIndex].age = userDetails.age;
            }
            if (userDetails.password) {
                usersData.data[userIndex].password = yield hash_1.createHash(userDetails.password); // fixme
            }
            return yield users_1.default.updateUserDetails(usersData);
        });
    }
    deleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_1.default.deleteUser(user.id);
        });
    }
    createNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersData = yield users_1.default.getUsersList();
            if (yield users_1.default.isUserExists(usersData, user.name)) {
                throw new client_error_1.ClientError(400, "usernameAlreadyExist"); // fixme status??
            }
            else {
                user.password = yield hash_1.createHash(user.password);
                user.id = uuid_1.create_UUID();
                return yield users_1.default.createNewUser(user);
            }
        });
    }
}
const usersService = new UsersService();
exports.default = usersService;
//# sourceMappingURL=users-service.js.map