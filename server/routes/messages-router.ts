import * as express from 'express';
import * as controllers from '../controllers';

const messagesRouter = express.Router();

messagesRouter.get('/:id', controllers.messagesController.getMessages);

messagesRouter.post('/:id', controllers.messagesController.saveMessage);

export default messagesRouter;