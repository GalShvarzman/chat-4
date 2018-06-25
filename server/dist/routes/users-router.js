"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controllers = require("../controllers");
const usersRouter = express.Router();
usersRouter.patch('/:id', controllers.usersController.saveUserDetails);
usersRouter.delete('/:id', controllers.usersController.deleteUser);
usersRouter.get('/', controllers.usersController.getUsers);
usersRouter.post('/', controllers.usersController.createNewUserOrAuth);
exports.default = usersRouter;
//# sourceMappingURL=users-router.js.map