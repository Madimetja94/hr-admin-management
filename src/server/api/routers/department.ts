import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  roleProtectedProcedure,
} from "~/server/api/trpc";

export const departmentsRouter = createTRPCRouter({
  getDepartments: protectedProcedure.query(async ({ ctx }) => {
    try {
      const currentUser = ctx.session.user;

      if (currentUser.role === "admin") {
        const departments = await ctx.db.department.findMany({
          include: {
            manager: true,
            employees: {
              include: {
                employee: true,
              },
            },
          },
        });

        return departments.map((department) => ({
          id: department.id,
          name: department.name,
          manager: department.manager
            ? `${department.manager.firstName} ${department.manager.lastName}`
            : "No Manager",
          status: department.status,
        }));
      } else if (currentUser.role === "manager") {
        const departments = await ctx.db.department.findMany({
          where: { managerId: currentUser.id },
          include: {
            manager: true,
            employees: {
              include: {
                employee: true,
              },
            },
          },
        });
        console.log("DE", typeof currentUser.id);
        return departments.map((department) => ({
          id: department.id,
          name: department.name,
          manager: department.manager
            ? `${department.manager.firstName} ${department.manager.lastName}`
            : "No Manager",
          status: department.status,
        }));
      } else {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view departments",
        });
      }
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch departments",
      });
    }
  }),
  createDepartment: roleProtectedProcedure(["admin"])
    .input(
      z.object({
        name: z.string().min(1, "Department name is required"),
        status: z.enum(["active", "inactive"]),
        managerId: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { name, status, managerId } = input;

        const department = await ctx.db.department.create({
          data: {
            name,
            status,
            managerId: managerId || undefined,
          },
        });

        return department;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create department",
        });
      }
    }),

  updateDepartment: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        managerId: z.number().optional(),
        status: z.enum(["active", "inactive"]).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, managerId, status } = input;

      const updatedDepartment = await ctx.db.department.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(managerId && { managerId }),
          ...(status && { status }),
        },
      });

      return updatedDepartment;
    }),
  toggleDepartmentStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["active", "inactive"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;
      return ctx.db.department.update({
        where: { id },
        data: { status },
      });
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
});
