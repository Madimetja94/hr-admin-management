import { z } from "zod";
import bcrypt from "bcryptjs";

import {
  createTRPCRouter,
  roleProtectedProcedure,
} from "~/server/api/trpc";

export const employeeRouter = createTRPCRouter({
  simpleList: roleProtectedProcedure(['user']).query(
    async ({ ctx }) => {
      return "Test Route Works!";
    },
  ),
});

// export const employeeRouter = createTRPCRouter({
//   list: roleProtectedProcedure(["admin", "manager"]).query(
//     async ({ ctx }) => {
//       if (ctx.session.user.role === "admin") {
//         return ctx.db.employee.findMany();
//       } else {
//         return ctx.db.employee.findMany({
//           where: { managerId: ctx.session.user.id },
//         });
//       }
//     },
//   ),

//   create: roleProtectedProcedure(["admin"]).mutation(
//     async ({ ctx, input }) => {
//       const newEmployee = await ctx.db.employee.create({
//         data: { ...input, defaultPassword: bcrypt.hashSync("Password123#") },
//       });
//       return newEmployee;
//     },
//   ),

//   update: roleProtectedProcedure(["admin"]).mutation(
//     async ({ ctx, input }) => {
//       const updatedEmployee = await ctx.db.employee.update({
//         where: { id: input.id },
//         data: { ...input },
//       });
//       return updatedEmployee;
//     },
//   ),
// });

// export const departmentRouter = createTRPCRouter({
//   list: roleProtectedProcedure(["admin", "manager"]).query(
//     async ({ ctx }) => {
//       if (ctx.session.user.role === "admin") {
//         return ctx.db.department.findMany();
//        }// else {
//       //   return ctx.db.department.findMany({
//       //     where: { managerId: ctx.session.user.id },
//       //   });
//       // }
//     },
//   ),

//   create: roleProtectedProcedure(["admin"]).mutation(
//     async ({ ctx, input }) => {
//       const newDepartment = await ctx.db.department.create({
//         data: { ...input },
//       });
//       return newDepartment;
//     },
//   ),

//   update: roleProtectedProcedure(["admin"]).mutation(
//     async ({ ctx, input }) => {
//       const updatedDepartment = await ctx.db.department.update({
//         where: { id: input.id },
//         data: { ...input },
//       });
//       return updatedDepartment;
//     },
//   ),
// });

