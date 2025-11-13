import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);
    const u = await prisma.user.create({
    data: {
      username: 'test@example.com',
      password,
      firstName: 'Test',
      lastName: 'User',
      account: { create: { balance: 5000 } },
    },
  });
  console.log('Seeded user:', u.username);
}

main().finally(() => prisma.$disconnect());
