import * as express from 'express';
import * as http from 'http';
import * as socketio from 'socket.io';
import routes from './routers';

const app = express();
const httpServer = http.createServer(app);
const io = socketio(httpServer);

io.on('connection', (socket)=>{
    socket.on('msg', (msg)=>{
        console.log(msg);
    })
});

app.use(express.json());

app.use('/users', routes.usersRouter);

app.use('/groups', routes.groupsRouter);

app.get('/', (req, res) => res.send('Hello World!'));

httpServer.listen(4000, () => console.log('Example app listening on port 4000!'));