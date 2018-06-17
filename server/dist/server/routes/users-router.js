"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controllers = require("../controllers");
const usersRouter = express.Router();
usersRouter.put('/:id/edit', controllers.usersController.saveUserDetails);
usersRouter.delete('/:id', controllers.usersController.deleteUser);
usersRouter.get('/', controllers.usersController.getAllUsers);
exports.default = usersRouter;
//# sourceMappingURL=users-router.js.map