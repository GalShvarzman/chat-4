"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const socketio = require("socket.io");
const app_1 = require("./app");
const httpServer = http.createServer(app_1.default);
const io = socketio(httpServer);
io.on('connection', (socket) => {
    socket.on('msg', (msg) => {
        console.log(msg);
    });
});
httpServer.listen(4000, () => console.log('Example app listening on port 4000!'));
//# sourceMappingURL=index.js.map