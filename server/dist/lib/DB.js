"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
class DB {
    constructor(path) {
        this.readFile(path).then((data) => {
            this.data = data;
        });
    }
    readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err)
                    reject(err);
                resolve(JSON.parse(data.toString()));
            });
        });
    }
    writeFile(data, fileName) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, fileName), data, (err) => {
                if (err)
                    reject(err);
                console.log('The file has been saved!');
                resolve();
            });
        });
    }
    getData() {
        return this.data;
    }
}
exports.usersDb = new DB(path.join(__dirname, 'users.json'));
exports.groupsDb = new DB(path.join(__dirname, 'groups.json'));
exports.messagesDb = new DB(path.join(__dirname, 'messages.json'));
//# sourceMappingURL=DB.js.map