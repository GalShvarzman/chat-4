"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controllers = require("../controllers");
const groupsRouter = express.Router();
groupsRouter.get('/', controllers.groupsController.getGroups);
groupsRouter.post('/:id/users', controllers.groupsController.addUsersToGroup);
groupsRouter.post('/', controllers.groupsController.createNewGroup);
groupsRouter.get('/:id', controllers.groupsController.getGroupData);
groupsRouter.patch('/:id', controllers.groupsController.saveGroupDetails);
groupsRouter.delete('/:id', controllers.groupsController.deleteGroup);
exports.default = groupsRouter;
//# sourceMappingURL=groups-router.js.map