import * as express from 'express';
import * as routes from '../routes';
import * as controllers from "../controllers";
import * as mongoose from 'mongoose';

const app = express();

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true });

app.use(express.json());

app.use('/users', routes.usersRouter);

app.use('/messages', routes.messagesRouter);

app.use('/groups', routes.groupsRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.use(controllers.errorHandlerController.errorHandler);

export default app;