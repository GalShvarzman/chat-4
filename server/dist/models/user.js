"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
class User {
    constructor(username, age) {
        this.name = username;
        this.age = parseInt(age);
        this.id = uuidv4();
    }
}
exports.default = User;
//# sourceMappingURL=user.js.map