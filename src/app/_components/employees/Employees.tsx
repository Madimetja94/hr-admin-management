"use client";

import { api } from "~/trpc/react";
import React, { useState } from "react";
import EmployeeForm from "./EmployeesForm";
import EditEmployeeForm from "./EditEmployeesForm";

const Employees = ({session}) => {
  const {
    data: employees,
    isLoading,
    error,
  } = api.employee.getEmployees.useQuery();

  const isAdmin = session?.user.role === "admin";

  const [isCreating, setIsCreating] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);

  const toggleStatusMutation = api.employee.toggleEmployeeStatus.useMutation();

  const handleCreateToggle = () => {
    setIsCreating(!isCreating);
    setEditEmployeeId(null);
  };

  const handleEditToggle = (employeeId: number) => {
    setEditEmployeeId(editEmployeeId === employeeId ? null : employeeId);
    setIsCreating(false);
  };

  const handleToggleStatus = async (
    employeeId: number,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await toggleStatusMutation.mutateAsync({
        id: employeeId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating employee status", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Employees</h1>

      {isAdmin &&<button
        className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        onClick={handleCreateToggle}
      >
        {isCreating ? "Cancel Create" : "Create Employee"}
      </button>}

      {isCreating && <EmployeeForm onClose={handleCreateToggle} />}

      <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2 text-left">First Name</th>
            <th className="px-4 py-2 text-left">Last Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Manager</th>
            <th className="px-4 py-2 text-left">Status</th>
            {isAdmin && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {employees?.map((employee) => (
            <React.Fragment key={employee.id}>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{employee.firstName}</td>
                <td className="px-4 py-2">{employee.lastName}</td>
                <td className="px-4 py-2">{employee.email}</td>
                <td className="px-4 py-2">{employee.manager}</td>
                <td className="px-4 py-2">{employee.status}</td>
               {isAdmin && <td className="px-4 py-2">
                  <button
                    className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                    onClick={() => handleEditToggle(employee.id)}
                  >
                    {editEmployeeId === employee.id ? "Cancel" : "Edit"}
                  </button>
                  <button
                    className={`${
                      employee.status === "active"
                        ? "bg-red-500"
                        : "bg-green-500"
                    } rounded px-3 py-1 text-white hover:opacity-80`}
                    onClick={() =>
                      handleToggleStatus(employee.id, employee.status)
                    }
                  >
                    {employee.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>}
              </tr>

              {editEmployeeId === employee.id && (
                <tr>
                  <td colSpan="6" className="bg-gray-50 p-4">
                    <EditEmployeeForm
                      employee={employee}
                      onClose={handleEditToggle}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
