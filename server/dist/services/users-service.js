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
const hash_1 = require("../utils/hash");
const client_error_1 = require("../utils/client-error");
const uuidv4 = require("uuid/v4");
const tree_1 = require("../models/tree");
class UsersService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield users_1.default.getUsersList();
            result.data = result.data.map((user) => {
                return { "name": user.name, "age": user.age, "id": user.id };
            });
            return result;
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
            yield users_1.default.updateUsersFile(usersData);
            return ({ user: { name: usersData.data[userIndex].name, age: usersData.data[userIndex].age, id: usersData.data[userIndex].id } });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // fixme למחוק את היוזר גם מהקונקטורס
            yield users_1.default.deleteUser(id);
            const connectorsList = yield tree_1.nTree.getConnectorsList();
            connectorsList.data = connectorsList.data.filter((connector) => {
                return connector.id !== id;
            });
            tree_1.nTree.updateFile(connectorsList, 'connectors.json');
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
                user.id = uuidv4();
                return yield users_1.default.createNewUser(user);
            }
        });
    }
}
const usersService = new UsersService();
exports.default = usersService;
//# sourceMappingURL=users-service.js.map