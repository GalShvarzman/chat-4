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
const tree_1 = require("../models/tree");
const user_1 = require("../models/user");
const messages_1 = require("../models/messages");
class UsersService {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const usersList = yield users_1.default.getUsersFullData();
            const result = usersList.data.map((user) => {
                return { "name": user.name, "age": user.age, "id": user.id };
            });
            return { data: result };
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
                usersData.data[userIndex].password = yield hash_1.createHash(userDetails.password);
            }
            yield users_1.default.updateUsersFile(usersData);
            return ({ user: { name: usersData.data[userIndex].name, age: usersData.data[userIndex].age, id: usersData.data[userIndex].id } });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield users_1.default.deleteUser(id);
            const connectorsList = yield tree_1.nTree.getConnectorsList();
            connectorsList.data = connectorsList.data.filter((connector) => {
                return connector.id !== id;
            });
            tree_1.nTree.updateFile(connectorsList, 'connectors.json');
            const allMessages = yield messages_1.messagesDb.getAllMessages();
            const allMessagesKeysArr = Object.keys(allMessages.data);
            const matchConversationKeys = [];
            allMessagesKeysArr.forEach((key) => {
                if (key.includes(id)) {
                    matchConversationKeys.push(key);
                }
            });
            if (matchConversationKeys.length) {
                matchConversationKeys.forEach((key) => {
                    delete allMessages.data[key];
                });
                yield messages_1.messagesDb.updateMessagesFile(allMessages);
            }
        });
    }
    createNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersData = yield users_1.default.getUsersFullData();
            if (yield users_1.default.isUserExists(usersData, user.name)) {
                throw new client_error_1.ClientError(422, "usernameAlreadyExist");
            }
            else {
                const password = yield hash_1.createHash(user.password);
                const newUser = new user_1.default(user.name, user.age, password);
                return yield users_1.default.createNewUser(newUser);
            }
        });
    }
    authUser(userToAuth) {
        return __awaiter(this, void 0, void 0, function* () {
            const usersList = yield users_1.default.getUsersFullData();
            const userIndex = usersList.data.findIndex((user) => {
                return user.name === userToAuth.name;
            });
            if (userIndex !== -1) {
                const userDetails = usersList.data[userIndex];
                try {
                    yield hash_1.compareHash(userToAuth.password, userDetails.password);
                    return ({
                        id: userDetails.id,
                        name: userDetails.name,
                        age: userDetails.age
                    });
                }
                catch (e) {
                    throw new client_error_1.ClientError(404, "authFailed");
                }
            }
            else {
                throw new client_error_1.ClientError(404, "authFailed");
            }
        });
    }
}
const usersService = new UsersService();
exports.default = usersService;
//# sourceMappingURL=users-service.js.map