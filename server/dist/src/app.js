"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes = require("../routes");
const controllers = require("../controllers");
const app = express();
app.use(express.json());
app.use('/users', routes.usersRouter);
app.use('/messages', routes.messagesRouter);
app.use('/groups', routes.groupsRouter);
app.get('/', (req, res) => res.send('Hello World!'));
app.use(controllers.errorHandlerController.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map