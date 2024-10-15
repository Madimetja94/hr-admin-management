import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

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
        role: "admin",
        employee: {
          create: {
            firstName: "Default",
            lastName: "Admin",
            phoneNumber: "123456789",
            status: "active",
          },
        },
      },
    });

    console.log(`Default user created: ${user.email}`);
  } else {
    console.log("Default user already exists.");
  }

  const departmentNames = [
    "Human Resources",
    "Engineering",
    "Finance",
    "Marketing",
    "Sales",
    "IT",
    "Operations",
  ];

  for (const name of departmentNames) {
    const existingDepartment = await prisma.department.findUnique({
      where: { name },
    });

    if (!existingDepartment) {
      await prisma.department.create({
        data: {
          name,
          status: "active",
        },
      });
      console.log(`Department ${name} created.`);
    } else {
      console.log(`Department ${name} already exists.`);
    }
  }

  const employees = [
    {
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "987654321",
      email: "johndoe@test.com",
      role: "user",
      department: "Human Resources",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      phoneNumber: "123456789",
      email: "janesmith@test.com",
      role: "admin",
      department: "Engineering",
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      phoneNumber: "555555555",
      email: "alicejohnson@test.com",
      role: "user",
      department: "Finance",
    },
    {
      firstName: "Bob",
      lastName: "Williams",
      phoneNumber: "444444444",
      email: "bobwilliams@test.com",
      role: "user",
      department: "Marketing",
    },
    {
      firstName: "Emily",
      lastName: "Clark",
      phoneNumber: "333333333",
      email: "emilyclark@test.com",
      role: "admin",
      department: "Sales",
    },
  ];

  for (const employee of employees) {
    const existingUser = await prisma.user.findUnique({
      where: { email: employee.email },
    });

    if (!existingUser) {
      const department = await prisma.department.findUnique({
        where: { name: employee.department },
      });

      if (department) {
        await prisma.employee.create({
          data: {
            firstName: employee.firstName,
            lastName: employee.lastName,
            phoneNumber: employee.phoneNumber,
            status: "active",
            departments: {
              create: {
                department: { connect: { id: department.id } },
              },
            },
            user: {
              create: {
                email: employee.email,
                password: hashedPassword,
                role: employee.role,
              },
            },
          },
        });
        console.log(
          `Employee ${employee.firstName} ${employee.lastName} created.`,
        );
      } else {
        console.log(`Department ${employee.department} not found.`);
      }
    } else {
      console.log(`User with email ${employee.email} already exists.`);
    }
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
