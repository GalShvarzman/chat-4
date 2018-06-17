"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const controllers = require("../controllers");
const errorRouter = express.Router();
errorRouter.use(controllers.errorHandlerController.errorHandler);
exports.default = errorRouter;
//# sourceMappingURL=error-router.js.map