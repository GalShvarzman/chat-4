"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controllers = require("../controllers");
const messagesRouter = express.Router();
messagesRouter.get('/:id', controllers.messagesController.getMessages);
messagesRouter.post('/:id', controllers.messagesController.saveMessage);
exports.default = messagesRouter;
//# sourceMappingURL=messages-router.js.map