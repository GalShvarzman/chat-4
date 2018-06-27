import * as http from 'http';
import socket from './socket.io';

import app from './app';

const httpServer = http.createServer(app);

socket(httpServer);

httpServer.listen(4000, () => console.log('Example app listening on port 4000!'));