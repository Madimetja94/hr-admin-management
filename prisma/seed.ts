import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const defaultEmail = "hradmin@test.com";
  const defaultPassword = "TestPass1234";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email: defaultEmail,
        password: hashedPassword,
        role: 'admin',
        employee: {
          create: {
            firstName: 'Default',
            lastName: 'Admin',
            phoneNumber: '123456789',
            status: 'active',
          },
        },
      },
    });

    console.log(`Default user created: ${user.email}`);
  } else {
    console.log('Default user already exists.');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
