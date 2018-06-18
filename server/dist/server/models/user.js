"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../src/utils/uuid");
class User {
    constructor(username, age, password) {
        this.name = username;
        this.age = age;
        this.password = password;
        this.parents = [];
        this.type = 'user';
        this.id = uuid_1.create_UUID();
    }
    removeParent(parentNode) {
        if (this.parents.length) {
            const i = this.parents.findIndex((parent) => {
                return parent === parentNode;
            });
            if (i !== -1) {
                this.parents.splice(i, 1);
                return true;
            }
            else {
                return false;
            }
        }
        return false;
    }
    updateAge(newAge) {
        this.age = newAge;
        return true;
    }
    updatePassword(newPassword) {
        this.password = newPassword;
        return true;
    }
    getParentsToPrint() {
        if (this.parents.length) {
            return this.parents.map((parent) => {
                return parent.name;
            });
        }
        return false;
    }
    auth(enteredPassword) {
        return enteredPassword === this.password;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map