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
const user_1 = require("./user");
const DB_1 = require("../lib/DB");
const usersFile = 'users.json';
class UsersDb {
    constructor() {
        this.users = [new user_1.default("gal", 27, "123"), new user_1.default("Tommy", 24, "123"), new user_1.default("Ori", 30, "123"), new user_1.default("Udi", 34, "123"), new user_1.default("Roni", 5, "123")];
    }
    findUserIndex(username) {
        return this.users.findIndex((user) => {
            return username === user.name;
        });
    }
    isUserExists(data, username) {
        return DB_1.db.isObjExistsByName(data, username);
        // const i = this.findUserIndex(username);
        // return (i !== -1);
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteObj(id, usersFile);
            // const i = this.findUserIndex(username);
            // if(i !== -1){
            //     this.users.splice(i, 1);
            //     return true;
            // }
            // else{
            //     return false;
            // }
        });
    }
    addUser(user) {
        this.users.push(user);
    }
    getUserNamesList() {
        return this.users.map((user) => {
            return user.name;
        });
    }
    getUser(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.getUsersList();
            const user = users.data.find((user) => {
                return user.name === userName;
            });
            if (user) {
                return user;
            }
            else {
                throw new Error("No user was Found");
            }
        });
    }
    getUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.users;
            return yield DB_1.db.getData(usersFile);
        });
    }
    updateUserDetails(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.updateObjDetails(newData, usersFile);
        });
    }
    getUserIndexById(data, id) {
        return DB_1.db.getObjIndexById(data, id);
    }
    createNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.createNew(user, usersFile);
        });
    }
    getUsersFullData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.getFullData(usersFile);
        });
    }
}
const users = new UsersDb();
exports.default = users;
//# sourceMappingURL=users.js.map