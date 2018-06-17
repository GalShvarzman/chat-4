"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const services = require("../services");
class UsersController {
    saveUserDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield services.usersService.saveUserDetails(req.body);
                res.status(200).json({ message: "User details have been updated" });
            }
            catch (e) {
                res.status(500).json({ message: e });
            }
        });
    }
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield services.usersService.getAllUsers();
            res.status(200).json(data);
        });
    }
}
const usersController = new UsersController();
exports.default = usersController;
//# sourceMappingURL=users-controller.js.map