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
class MessagesDb {
    constructor() {
        this.messages = {};
    }
    addMessageToGroup(message, groupId) {
        if (this.messages[groupId]) {
            this.messages[groupId].push(message);
        }
        else {
            this.messages[groupId] = [message];
        }
    }
    addMessageUsersConversation(message, user1Id, user2Id) {
        const conversationId = this.createUniqIdForUsersConversatuin(user1Id, user2Id);
        if (this.messages[conversationId]) {
            this.messages[conversationId].push(message);
        }
        else {
            this.messages[conversationId] = [message];
        }
    }
    getConversationMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allMessages = yield DB_1.db.readFile('messages.json');
            if (allMessages.data[conversationId]) {
                return allMessages.data[conversationId];
            }
            allMessages.data[conversationId] = [];
            return allMessages.data[conversationId];
        });
    }
    getGroupMessages(groupId) {
        if (this.messages[groupId]) {
            return this.messages[groupId];
        }
        return [];
    }
    getUsersConversationMessages(user1Id, user2Id) {
        const conversationId = this.createUniqIdForUsersConversatuin(user1Id, user2Id);
        if (this.messages[conversationId]) {
            return this.messages[conversationId];
        }
        return [];
    }
    createUniqIdForUsersConversatuin(user1Id, user2Id) {
        return [user1Id, user2Id].sort().join("_");
    }
}
exports.MessagesDb = MessagesDb;
exports.messagesDb = new MessagesDb();
//# sourceMappingURL=messages.js.map