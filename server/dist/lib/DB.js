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
const fs = require("fs");
const path = require("path");
const client_error_1 = require("../utils/client-error");
class DB {
    readFile(fileName) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, fileName), (err, res) => {
                if (err)
                    reject(err);
                else {
                    resolve(JSON.parse(res.toString()));
                }
            });
        });
    }
    writeFile(data, fileName) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, fileName), JSON.stringify(data), (err) => {
                if (err)
                    reject(err);
                console.log('The file has been saved!');
                resolve(true);
            });
        });
    }
    getFullData(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.readFile(fileName);
            }
            catch (e) {
                throw new client_error_1.ClientError(500, "getDataFailed");
            }
        });
    }
    getObjIndexById(result, id) {
        const index = result.data.findIndex((obj) => {
            return obj.id === id;
        });
        if (index !== -1) {
            return index;
        }
        else {
            throw new client_error_1.ClientError(404, "objDoesNotExist");
        }
    }
    getObjIndex(result, obj) {
        const index = result.data.findIndex((object) => {
            return (JSON.stringify(obj) === JSON.stringify(object));
        });
        if (index !== -1) {
            return index;
        }
        else {
            throw new client_error_1.ClientError(404, "objDoesNotExist");
        }
    }
    isObjExistsByName(result, objName) {
        const index = result.data.findIndex((obj) => {
            return obj.name === objName;
        });
        return (index !== -1);
    }
    updateFile(data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.writeFile(data, fileName);
            }
            catch (e) {
                throw new client_error_1.ClientError(500, "updateDetailsFailed");
            }
        });
    }
    deleteMultipleObj(objects, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.readFile(fileName);
                objects.forEach((obj) => __awaiter(this, void 0, void 0, function* () {
                    const objIndex = this.getObjIndex(result, obj);
                    result.data.splice(objIndex, 1);
                }));
                return yield this.writeFile(result, fileName);
            }
            catch (e) {
                throw new client_error_1.ClientError(500, "deleteFailed");
            }
        });
    }
    deleteMultipleObjById(ids, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.readFile(fileName);
                ids.forEach((id) => __awaiter(this, void 0, void 0, function* () {
                    const objIndex = this.getObjIndexById(result, id);
                    result.data.splice(objIndex, 1);
                }));
                return yield this.writeFile(result, fileName);
            }
            catch (e) {
                throw new client_error_1.ClientError(500, "deleteFailed");
            }
        });
    }
    deleteObj(id, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.readFile(fileName);
                const objIndex = this.getObjIndexById(result, id);
                result.data.splice(objIndex, 1);
                return yield this.writeFile(result, fileName);
            }
            catch (e) {
                throw new client_error_1.ClientError(500, "deleteFailed");
            }
        });
    }
    createNew(obj, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.readFile(fileName);
                result.data.push(obj);
                yield this.writeFile(result, fileName);
                if (fileName === 'users.json') {
                    return { user: { name: obj.name, age: obj.age, id: obj.id } };
                }
                return obj;
            }
            catch (e) {
                throw new client_error_1.ClientError(500, "CreateNewFailed");
            }
        });
    }
    createMultipleNew(data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.readFile(fileName);
                data.forEach((obj) => {
                    result.data.push(obj);
                });
                yield this.writeFile(result, fileName);
            }
            catch (e) {
                throw new client_error_1.ClientError(500, "CreateNewFailed");
            }
        });
    }
}
exports.db = new DB();
//# sourceMappingURL=DB.js.map