import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import * as ctrl from './account.controller';

const r = Router();
r.get('/balance', authMiddleware, ctrl.getBalance);
r.post('/transfer', authMiddleware, ctrl.postTransfer);
export default r;