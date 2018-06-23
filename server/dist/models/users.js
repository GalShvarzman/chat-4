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
const DB_1 = require("../lib/DB");
const usersFile = 'users.json';
class Users {
    isUserExists(data, username) {
        return DB_1.db.isObjExistsByName(data, username);
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.deleteObj(id, usersFile);
        });
    }
    // public async getUser(userName:string){
    //     const users:{data:any[]} = await this.getUsersList();
    //     const user = users.data.find((user)=>{
    //         return user.name === userName;
    //     });
    //     if(user){
    //         return user;
    //     }
    //     else{
    //         throw new Error("No user was Found");
    //     }
    // }
    getUsersList() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.getFullData(usersFile);
        });
    }
    updateUsersFile(newData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.updateFile(newData, usersFile);
        });
    }
    getUserIndexById(data, id) {
        return DB_1.db.getObjIndexById(data, id);
    }
    createNewUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.createNew(user, usersFile);
        });
    }
    getUsersFullData() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield DB_1.db.getFullData(usersFile);
        });
    }
}
const users = new Users();
exports.default = users;
//# sourceMappingURL=users.js.map