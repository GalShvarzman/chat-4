import * as express from 'express';
import * as controllers from "../controllers";

const groupsRouter = express.Router();

groupsRouter.get('/', controllers.groupsController.getGroups);

groupsRouter.post('/:id/users', controllers.groupsController.addUsersToGroup);

groupsRouter.post('/', controllers.groupsController.createNewGroup);

groupsRouter.get('/:id', controllers.groupsController.getGroupData);

groupsRouter.patch('/:id', controllers.groupsController.saveGroupDetails);

groupsRouter.delete('/:id', controllers.groupsController.deleteGroup);

groupsRouter.delete('/:id/users/:userid', controllers.groupsController.deleteUserFromGroup);


export default groupsRouter;