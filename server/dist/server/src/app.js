"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes = require("../routes");
const app = express();
app.use(express.json());
app.use('/users', routes.usersRouter);
app.use('/groups', routes.groupsRouter);
app.get('/', (req, res) => res.send('Hello World!'));
exports.default = app;
//# sourceMappingURL=app.js.map