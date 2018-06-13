import * as http from 'http';
import * as socketio from 'socket.io';

import app from './app';

const httpServer = http.createServer(app);

const io = socketio(httpServer);

io.on('connection', (socket)=>{
    socket.on('msg', (msg)=>{
        console.log(msg);
    })
});

httpServer.listen(4000, () => console.log('Example app listening on port 4000!'));

