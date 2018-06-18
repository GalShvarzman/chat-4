import * as express from 'express';
import * as controllers from "../controllers";

const groupsRouter = express.Router();

groupsRouter.get('/', controllers.groupsController.getAllGroups);


export default groupsRouter;