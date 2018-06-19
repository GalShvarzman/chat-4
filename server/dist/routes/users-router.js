"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controllers = require("../controllers");
const usersRouter = express.Router();
usersRouter.patch('/:id', controllers.usersController.saveUserDetails);
usersRouter.delete('/:id', controllers.usersController.deleteUser);
usersRouter.get('/', controllers.usersController.getAllUsers);
usersRouter.post('/', controllers.usersController.createNewUser);
exports.default = usersRouter;
//# sourceMappingURL=users-router.js.map