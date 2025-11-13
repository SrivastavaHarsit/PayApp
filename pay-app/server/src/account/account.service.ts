import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';

export async function getBalance(userId: string) {
  const account = await prisma.account.findUnique({ where: { userId } });
  if (!account) {
    const err: any = new Error('Account not found');
    err.status = 404;
    throw err;
  }
  return account.balance;
}

export async function transfer(fromUserId: string, toUsername: string, amount: number) {
  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const from = await tx.account.findUnique({ where: { userId: fromUserId } });
    if (!from) {
      const err: any = new Error('Sender Account not found');
      err.status = 404;
      throw err;
    }
    if (Number(from.balance )< amount) {
      const err: any = new Error('Insufficient balance');
      err.status = 400;
      throw err;
    }

    const toUser = await tx.user.findUnique({ where: { username: toUsername } });
    if (!toUser) {
      const err: any = new Error('Receiver User not found');
      err.status = 404;
      throw err;
    }
    const to = await tx.account.findUnique({ where: { userId: toUser.id } });
    if (!to) {
      const err: any = new Error('Receiver Account not found');
      err.status = 404;
      throw err;
    }

    // Deduct and Credit atomically
    await tx.account.update({
      where: { userId: fromUserId },
      data: { balance: (Number(from.balance) - amount) }
    });
    await tx.account.update({
      where: { userId: toUser.id },
      data: { balance: (Number(to.balance )+ amount) }
    });

    return true;
  });
}