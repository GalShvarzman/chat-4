"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const DB_1 = require("../lib/DB");
exports.usersRouter = express.Router();
exports.usersRouter.get('/', (req, res) => {
    const data = DB_1.usersDb.getData();
    res.status(200).json(data);
});
//# sourceMappingURL=users-router.js.map