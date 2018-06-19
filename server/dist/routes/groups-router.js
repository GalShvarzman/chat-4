"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controllers = require("../controllers");
const groupsRouter = express.Router();
groupsRouter.get('/', controllers.groupsController.getAllGroups);
groupsRouter.get('/:id', controllers.groupsController.getGroupData);
exports.default = groupsRouter;
//# sourceMappingURL=groups-router.js.map