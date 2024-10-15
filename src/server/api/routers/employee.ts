import { z } from "zod";
import bcrypt from "bcryptjs";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, roleProtectedProcedure } from "~/server/api/trpc";

export const employeeRouter = createTRPCRouter({
 getEmployees: protectedProcedure.query(async ({ ctx }) => {
  try {
    const currentUser = ctx.session.user;

    if (currentUser.role === "admin") {
      const employees = await ctx.db.employee.findMany({
        include: {
          manager: true,
          user: true,
        },
      });

      return employees.map((employee) => ({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.user?.email || "No Email",
        status: employee.status,
        role: employee.user?.role || "No Role",
        phoneNumber: employee.phoneNumber,
        manager: employee.manager
          ? `${employee.manager.firstName} ${employee.manager.lastName}`
          : "No Manager",
      }));
    } else if (currentUser.role === "manager") {
      const employees = await ctx.db.employee.findMany({
        where: {
          managerId: currentUser.id,
        },
        include: {
          manager: true,
          user: true,
          subordinates: true,
        },
      });
      return employees.map((employee) => ({
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.user?.email || "No Email",
        status: employee.status,
        role: employee.user?.role || "No Role",
        phoneNumber: employee.phoneNumber,
        manager: employee.manager
          ? `${employee.manager.firstName} ${employee.manager.lastName}`
          : "No Manager",
      }));
    } else {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You do not have permission to view employees",
      });
    }
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch employees",
    });
  }
}),
  getManagers: protectedProcedure.query(async ({ ctx }) => {
    try {
      const managers = await ctx.db.employee.findMany({
        where: {
          user: {
            role: "manager",
          },
        },
        include: {
          user: true,
        },
      });

      return managers.map((manager) => ({
        id: manager.id,
        name: `${manager.firstName} ${manager.lastName}`,
      }));
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch managers",
      });
    }
  }),

  createEmployee: roleProtectedProcedure(["admin"])
    .input(
      z.object({
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
        email: z.string().email("Invalid email address"),
        phoneNumber: z.string().optional(),
        managerId: z.number().nullable(),
        status: z.enum(["active", "inactive"]).optional().default("active"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, email, phoneNumber, managerId, status } =
        input;

      try {
        const newEmployee = await ctx.db.employee.create({
          data: {
            firstName,
            lastName,
            phoneNumber,
            status: status || "active",
            managerId: managerId || undefined,
          },
        });

        
        const defaultPassword = "Password123#";
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        const newUser = await ctx.db.user.create({
          data: {
            email,
            password: hashedPassword,
            role: "user",
            employeeId: newEmployee.id,
          },
        });

        return {
          employee: newEmployee,
          user: newUser,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create employee and user",
        });
      }
    }),

  updateEmployee: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        email: z.string().email().optional(),
        managerId: z.number().optional(),
        phoneNumber: z.string().optional(),
        status: z.enum(["active", "inactive"]).optional(),
        role: z.enum(["user", "manager","admin"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, firstName, lastName, email, managerId, status, role } = input;

      const updatedEmployee = await ctx.db.employee.update({
        where: { id },
        data: {
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(managerId && { managerId }),
          ...(status && { status }),
          user: {
            update: {
              email: email,
              role: role,
            },
          },
        },
      });

      return updatedEmployee;
    }),

  toggleEmployeeStatus: protectedProcedure
    .input(z.object({ id: z.number(), status: z.enum(["active", "inactive"]) }))
    .mutation(({ input, ctx }) => {
      return ctx.db.employee.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
