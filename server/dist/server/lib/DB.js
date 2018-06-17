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
const fs = require("fs");
const path = require("path");
const hash_1 = require("../utils/hash");
const usersFile = 'users.json';
class DB {
    readFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, fileName), (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(JSON.parse(res.toString()));
                }
            });
        });
    }
    writeFile(data, fileName) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, fileName), JSON.stringify(data), (err) => {
                if (err)
                    reject(err);
                console.log('The file has been saved!');
                resolve(true);
            });
        });
    }
    getUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.readFile(usersFile); // fixme;
            result.data = result.data.map((user) => {
                return { "name": user.name, "age": user.age, "id": user.id };
            });
            return result;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.readFile(usersFile);
            }
            catch (e) {
                throw new Error("getUsersFailed");
            }
        });
    }
    getUserIndexByName(result, userName) {
        return result.data.findIndex((user) => {
            return user.name === userName;
        });
    }
    updateUserDetails(userNewDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getUsers();
            let userIndex = this.getUserIndexByName(result, userNewDetails.name);
            if (userIndex !== -1) {
                if (userNewDetails.age) {
                    result.data[userIndex].age = userNewDetails.age;
                }
                if (userNewDetails.password) {
                    result.data[userIndex].password = yield hash_1.createHash(userNewDetails.password);
                }
                try {
                    return yield this.writeFile(result, usersFile);
                }
                catch (e) {
                    throw new Error("updateUserDetailsFailed");
                }
            }
            else {
                throw new Error("userDoesNotExist");
            }
        });
    }
    deleteUser(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.readFile(usersFile);
            const userIndex = this.getUserIndexByName(result, username);
            if (userIndex !== -1) {
                result.data.splice(userIndex, 1);
                try {
                    return yield this.writeFile(result, usersFile);
                }
                catch (e) {
                    throw new Error("deleteUserFailed");
                }
            }
            else {
                throw new Error("userDoesNotExist");
            }
        });
    }
}
exports.db = new DB();
//# sourceMappingURL=DB.js.map