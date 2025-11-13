import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { transferBody } from './account.schema';
import * as svc from './account.service';

export async function getBalance(req: AuthRequest, res: Response) {
  const balance = await svc.getBalance(req.userId!);
  return res.status(200).json({ balance });
}

export async function postTransfer(req: AuthRequest, res: Response) {
  const parsed = transferBody.safeParse(req.body);
  if (!parsed.success) return res.status(411).json({ message: 'Invalid Inputs' });
  const { toUsername, amount } = parsed.data;
  await svc.transfer(req.userId!, toUsername, amount);
  return res.status(200).json({ message: 'Transfer successful' });
}