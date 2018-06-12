"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("../../src/utils/uuid");
class Message {
    constructor(message, date) {
        this.id = uuid_1.create_UUID();
        this.message = message;
        this.date = date;
    }
}
exports.Message = Message;
//# sourceMappingURL=message.js.map