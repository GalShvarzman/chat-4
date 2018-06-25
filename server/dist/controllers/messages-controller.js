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
const services = require("../services");
class MessagesController {
    getMessages(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                const messages = yield services.messagesService.getConversationMessages(req.params.id);
                res.status(200).json(messages);
            }));
        });
    }
    saveMessage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return tryCatch(next, () => __awaiter(this, void 0, void 0, function* () {
                const message = yield services.messagesService.saveMessage(req.body, req.params.id);
                res.status(201).json(message);
            }));
        });
    }
}
function tryCatch(next, func) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield func();
        }
        catch (err) {
            next(err);
        }
    });
}
const messagesController = new MessagesController();
exports.default = messagesController;
//# sourceMappingURL=messages-controller.js.map