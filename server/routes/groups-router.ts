import * as express from 'express';
import * as controllers from "../controllers";

const groupsRouter = express.Router();

groupsRouter.get('/', controllers.groupsController.getGroups);

groupsRouter.post('/', controllers.groupsController.createNewGroup);

groupsRouter.get('/:id', controllers.groupsController.getGroupData);

groupsRouter.delete('/:id', controllers.groupsController.deleteGroup);

export default groupsRouter;