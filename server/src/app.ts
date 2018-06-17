import * as express from 'express';
import * as routes from '../routes';
import errorHandler from "./error-handler";

const app = express();

app.use(express.json());

app.use('/users', routes.usersRouter);

app.use('/groups', routes.groupsRouter);

app.get('/', (req, res) => res.send('Hello World!'));

app.use(errorHandler);


export default app;