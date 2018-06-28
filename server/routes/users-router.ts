import * as express from 'express';
import * as controllers from '../controllers';

const usersRouter = express.Router();

usersRouter.patch('/:id', controllers.usersController.saveUserDetails);

usersRouter.delete('/:id', controllers.usersController.deleteUser);

usersRouter.get('/', controllers.usersController.getUsers);

usersRouter.post('/', controllers.usersController.createNewUserOrAuth);

export default usersRouter;