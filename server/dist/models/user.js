"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
class User {
    constructor(username, age, password) {
        this.id = uuidv4();
        this.name = username;
        this.age = parseInt(age);
        this.password = password;
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map