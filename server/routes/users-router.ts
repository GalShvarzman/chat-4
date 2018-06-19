import * as express from 'express';
import * as controllers from '../controllers';

const usersRouter = express.Router();

usersRouter.patch('/:id', controllers.usersController.saveUserDetails);

usersRouter.delete('/:id', controllers.usersController.deleteUser);

usersRouter.get('/', controllers.usersController.getAllUsers);

usersRouter.post('/', controllers.usersController.createNewUser);


export default usersRouter;