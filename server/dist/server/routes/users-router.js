"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const DB_1 = require("../lib/DB");
const usersRouter = express.Router();
usersRouter.get('/', (req, res) => {
    const data = DB_1.usersDb.getData();
    res.status(200).json(data);
});
exports.default = usersRouter;
//# sourceMappingURL=users-router.js.map