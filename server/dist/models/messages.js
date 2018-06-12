"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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