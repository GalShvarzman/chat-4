"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const routers_1 = require("./routers");
const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);
io.on('connection', (socket) => {
    socket.on('msg', (msg) => {
        console.log(msg);
    });
});
app.use(express.json());
app.use('/users', routers_1.default.usersRouter);
app.use('/groups', routers_1.default.groupsRouter);
app.get('/', (req, res) => res.send('Hello World!'));
httpServer.listen(4000, () => console.log('Example app listening on port 4000!'));
//# sourceMappingURL=app.js.map