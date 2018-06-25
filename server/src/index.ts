import * as http from 'http';
import * as socketio from 'socket.io';

import app from './app';

const httpServer = http.createServer(app);

const io = socketio(httpServer);

io.on('connection', (socket)=>{
    console.log('a user connected');
    // socket.on('msg', (msg)=>{
    //     io.emit('msg', msg, { for: 'everyone' });
    // });

    socket.on('login', (username)=>{
        socket.username = username;
        console.log(`username ${username} was logged in!`);
        socket.broadcast.emit('connections', username);
    });

    socket.on('join-group', (username, groupname)=>{
        console.log(`username: ${username} has joined ${groupname}`);
        socket.join(groupname);

        io.to(groupname).emit('msg', {id:'dfdf2342adf3',message:'hello ' + username, sender:{name:'node', id:123}});
        console.log(Object.keys(socket.rooms));
        io.to(groupname).on('msg', (msg)=>{
            io.emit('msg', msg, { for: 'everyone' });
        });
    });

    socket.on('leave-group', (groupName)=>{
        socket.leave(groupName);
        console.log(`${socket.username} left ${groupName}`)

    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

httpServer.listen(4000, () => console.log('Example app listening on port 4000!'));

