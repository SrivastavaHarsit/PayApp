import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as ctrl from './auth.controller';

const r = Router();
r.post('/signup', ctrl.postSignup);
r.post('/signin', ctrl.postSignin);
r.post('/logout', authMiddleware, ctrl.postLogout);
r.put('/', authMiddleware, ctrl.putUpdate);
r.get('/bulk', ctrl.getBulk);
export default r;