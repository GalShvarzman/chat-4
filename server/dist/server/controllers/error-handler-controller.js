"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorHandlerController {
    errorHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({ message: "There was a problem, try again" });
    }
}
const errorHandlerController = new ErrorHandlerController();
exports.default = errorHandlerController;
//# sourceMappingURL=error-handler-controller.js.map