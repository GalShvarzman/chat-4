"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.status = status;
    }
}
exports.ClientError = ClientError;
//# sourceMappingURL=client-error.js.map