import { Request, Response } from 'express';
import * as svc from './auth.service';
import { signUpBody, signInBody, updateBody } from './auth.schema';
import { AuthRequest } from '../middleware/auth';

export async function postSignup(req: Request, res: Response) {
  const parsed = signUpBody.safeParse(req.body);
  if (!parsed.success) return res.status(411).json({ message: 'Invalid Inputs' });
  const { token } = await svc.signup(parsed.data);
  return res.status(201).json({ message: 'User created successfully', token });
}

export async function postSignin(req: Request, res: Response) {
  const parsed = signInBody.safeParse(req.body);
  if (!parsed.success) return res.status(411).json({ message: 'Invalid Inputs' });
  const { token } = await svc.signin(parsed.data);
  return res.status(200).json({ message: 'SignIn successful', token });
}

export async function putUpdate(req: AuthRequest, res: Response) {
  const parsed = updateBody.safeParse(req.body);
  if (!parsed.success) return res.status(411).json({ message: 'Error while updating information' });
  const user = await svc.updateUser(req.userId!, parsed.data);
  return res.status(200).json({ message: 'User information updated successfully', user });
}

export async function getBulk(req: Request, res: Response) {
  const filter = (req.query.filter as string) || '';
  const users = await svc.searchUsers(filter);
  return res.status(200).json({
    users: users.map(u => ({
      _id: u.id,
      username: u.username,
      firstName: u.firstName,
      lastName: u.lastName
    }))
  });
}