"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("./user");
class UsersDb {
    constructor() {
        this.users = [new user_1.default("gal", 27, "123"), new user_1.default("Tommy", 24, "123"), new user_1.default("Ori", 30, "123"), new user_1.default("Udi", 34, "123"), new user_1.default("Roni", 5, "123")];
    }
    findUserIndex(username) {
        return this.users.findIndex((user) => {
            return username === user.name;
        });
    }
    isUserExists(username) {
        const i = this.findUserIndex(username);
        return (i !== -1);
    }
    deleteUser(username) {
        const i = this.findUserIndex(username);
        if (i !== -1) {
            this.users.splice(i, 1);
            return true;
        }
        else {
            return false;
        }
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
        const user = this.users.find((user) => {
            return user.name === userName;
        });
        if (user) {
            return user;
        }
        else {
            throw new Error("No user was Found");
        }
    }
    getUsers() {
        return this.users;
    }
}
exports.usersDb = new UsersDb();
//# sourceMappingURL=users.js.map