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
                resolve();
            });
        });
    }
    getUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.readFile('users.json');
            result.data = result.data.map((user) => {
                return { "name": user.name, "age": user.age, "id": user.id };
            });
            return result;
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.readFile('users.json');
        });
    }
    updateUserDetails(userNewDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.getUsers();
            let userIndex = result.data.findIndex((user) => {
                return user.name === userNewDetails.name;
            });
            if (userNewDetails.age) {
                result.data[userIndex].age = userNewDetails.age;
            }
            if (userNewDetails.password) {
                result.data[userIndex].password = yield hash_1.createHash(userNewDetails.password);
            }
            return yield this.writeFile(result, 'users.json');
        });
    }
}
exports.db = new DB();
//# sourceMappingURL=DB.js.map