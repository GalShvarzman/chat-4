import * as express from 'express';
import * as routes from '../routes';

const app = express();

app.use(express.json());

app.use('/users', routes.usersRouter);

app.use('/groups', routes.groupsRouter);

app.get('/', (req, res) => res.send('Hello World!'));

export default app;