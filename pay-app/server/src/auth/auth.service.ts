import jwt from 'jsonwebtoken';
import { prisma } from '../prisma';
import { env } from '../env';
import { hashPassword, verifyPassword } from '../utils/password';

export function createToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: '7d' });
}

export async function signup(data: { username: string; firstName: string; lastName: string; password: string; }) {
  const exists = await prisma.user.findUnique({ where: { username: data.username } });
  if (exists) {
    const err: any = new Error('User already exists');
    err.status = 409;
    throw err;
  }

  const password = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      username: data.username,
      password,
      firstName: data.firstName,
      lastName: data.lastName,
      account: { create: { balance: (Math.floor(Math.random() * 10000) + 1).toFixed(2) } }
    }
  });

  const token = createToken(user.id);
  return { token, user };
}

export async function signin(data: { username: string; password: string; }) {
  const user = await prisma.user.findUnique({ where: { username: data.username } });
  if (!user) {
    const err: any = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  const ok = await verifyPassword(data.password, user.password);
  if (!ok) {
    const err: any = new Error('Invalid username or password');
    err.status = 401;
    throw err;
  }

  const token = createToken(user.id);
  return { token, user };
}

export async function updateUser(userId: string, data: { firstName?: string; lastName?: string; password?: string; }) {
  const payload: any = { ...data };
  if (payload.password) {
    payload.password = await hashPassword(payload.password);
  }
  const user = await prisma.user.update({
    where: { id: userId },
    data: payload
  });
  return user;
}

export async function searchUsers(filter: string): Promise<{
  id: string;
  username: string;
  firstName: string;
  lastName: string;
}[]> {
  if (!filter) {
    return prisma.user.findMany({
      select: { id: true, username: true, firstName: true, lastName: true }
    });
  }

  return prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: filter, mode: 'insensitive' } },
        { lastName: { contains: filter, mode: 'insensitive' } }
      ]
    },
    select: { id: true, username: true, firstName: true, lastName: true }
  });
}
