"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const socket_io_1 = require("./socket.io");
const app_1 = require("./app");
const httpServer = http.createServer(app_1.default);
socket_io_1.default(httpServer);
httpServer.listen(4000, () => console.log('Example app listening on port 4000!'));
//# sourceMappingURL=index.js.map