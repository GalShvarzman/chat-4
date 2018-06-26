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
const DB_1 = require("../lib/DB");
const messagesFile = 'messages.json';
class MessagesDb {
    addMessageToConversation(message, conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allMessages = yield DB_1.db.readFile(messagesFile);
            if (allMessages.data[conversationId]) {
                allMessages.data[conversationId].push(message);
            }
            else {
                allMessages.data[conversationId] = [message];
            }
            DB_1.db.writeFile(allMessages, messagesFile);
            return message;
        });
    }
    getConversationMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allMessages = yield DB_1.db.readFile(messagesFile);
            if (allMessages.data[conversationId]) {
                return allMessages.data[conversationId];
            }
            return [];
        });
    }
    getAllMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.readFile(messagesFile);
        });
    }
    updateMessagesFile(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield DB_1.db.updateFile(newData, messagesFile);
        });
    }
}
exports.MessagesDb = MessagesDb;
exports.messagesDb = new MessagesDb();
//# sourceMappingURL=messages.js.map