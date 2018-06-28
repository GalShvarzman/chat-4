import * as socketio from 'socket.io';

export default function socket(httpServer){
    const io = socketio.listen(httpServer);
    io.on('connection', (socket)=>{
        console.log('a user connected');

        socket.on('login', (username)=>{
            socket.username = username;
            console.log(`username ${username} was logged in!`);
            socket.broadcast.emit('connections', username);
        });

        socket.on('join-group', (username, groupId)=>{
            console.log(`username: ${username} has joined ${groupId}`);
            socket.join(groupId);
        });

        socket.on('msg', (id, msg)=>{
            socket.broadcast.to(id).emit('msg', msg);
        });

        socket.on('leave-group', (username, groupId)=>{
            socket.leave(groupId);
            console.log(`username: ${username} left ${groupId}`);
        });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });
}