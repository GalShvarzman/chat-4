"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
class Group {
    constructor(name) {
        this.name = name;
        this.id = uuidv4();
    }
}
exports.default = Group;
//# sourceMappingURL=group.js.map