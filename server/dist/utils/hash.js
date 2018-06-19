"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const saltRounds = 10;
function createHash(usersPlaintextPassword) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(usersPlaintextPassword, saltRounds, function (err, hash) {
            if (err)
                reject(err);
            resolve(hash);
        });
    });
}
exports.createHash = createHash;
function compareHash(usersPlaintextPassword, hash) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(usersPlaintextPassword, hash, function (err, res) {
            if (err)
                reject(err);
            resolve(res);
        });
    });
}
exports.compareHash = compareHash;
//# sourceMappingURL=hash.js.map