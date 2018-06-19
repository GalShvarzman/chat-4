"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuidv4 = require("uuid/v4");
class Message {
    constructor(message, date) {
        this.id = uuidv4();
        this.message = message;
        this.date = date;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map