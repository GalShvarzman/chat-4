import * as express from 'express';
import {usersDb} from '../lib/DB';

const usersRouter = express.Router();

usersRouter.get('/', (req,res)=>{
   const data = usersDb.getData();
   res.status(200).json(data);
});

export default usersRouter;