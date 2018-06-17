import * as express from 'express';
import * as controllers from '../controllers';

const usersRouter = express.Router();

usersRouter.put('/:id/edit', controllers.usersController.saveUserDetails);

usersRouter.delete('/:id', controllers.usersController.deleteUser);

usersRouter.get('/', controllers.usersController.getAllUsers);


export default usersRouter;