"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_error_1 = require("../utils/client-error");
class ErrorHandlerController {
    errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        if (err instanceof client_error_1.ClientError) {
            res.status(err.status).json({ message: err.message });
        }
        else {
            res.status(500).json({ message: "Something went wrong..." });
        }
    }
}
const errorHandlerController = new ErrorHandlerController();
exports.default = errorHandlerController;
//# sourceMappingURL=error-handler-controller.js.map