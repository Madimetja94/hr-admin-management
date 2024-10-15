"use client";

import { api } from "~/trpc/react";
import React, { useState} from "react";
import CreateDepartmentForm from "./DepartmentsForm";
import EditDepartmentForm from "./EditDepartmentForm";

const Departments = ({session}) => {
  const {
    data: departments,
    isLoading,
    error,
  } = api.department.getDepartments.useQuery();

   const isAdmin = session?.user.role === "admin";
  const [isCreating, setIsCreating] = useState(false);
  const [editDepartmentId, setEditDepartmentId] = useState<number | null>(null);

  const toggleStatusMutation =
    api.department.toggleDepartmentStatus.useMutation();

  const handleCreateToggle = () => {
    setIsCreating(!isCreating);
    setEditDepartmentId(null);
  };

  const handleEditToggle = (departmentId: number) => {
    setEditDepartmentId(
      editDepartmentId === departmentId ? null : departmentId,
    );
    setIsCreating(false);
  };

  const handleToggleStatus = async (
    departmentId: number,
    currentStatus: string,
  ) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await toggleStatusMutation.mutateAsync({
        id: departmentId,
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating department status", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-4 text-2xl font-bold">Departments</h1>

      {isAdmin && <button
        className="mb-4 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        onClick={handleCreateToggle}
      >
        {isCreating ? "Cancel Create" : "Create Department"}
      </button>}

      {isCreating && <CreateDepartmentForm onClose={handleCreateToggle} />}

      <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
        <thead>
          <tr className="bg-gray-200 text-gray-700">
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Manager</th>
            <th className="px-4 py-2 text-left">Status</th>
            {isAdmin && <th className="px-4 py-2 text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {departments?.map((department) => (
            <React.Fragment key={department.id}>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{department.name}</td>
                <td className="px-4 py-2">{department.manager}</td>
                <td className="px-4 py-2">{department.status}</td>
                {isAdmin && <td className="px-4 py-2">
                  <button
                    className="mr-2 rounded bg-blue-500 px-3 py-1 text-white hover:bg-blue-600"
                    onClick={() => handleEditToggle(department.id)}
                  >
                    {editDepartmentId === department.id ? "Cancel" : "Edit"}
                  </button>
                  <button
                    className={`${
                      department.status === "active"
                        ? "bg-red-500"
                        : "bg-green-500"
                    } rounded px-3 py-1 text-white hover:opacity-80`}
                    onClick={() =>
                      handleToggleStatus(department.id, department.status)
                    } 
                  >
                    {department.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>}
              </tr>

              {editDepartmentId === department.id && (
                <tr>
                  <td colSpan="4" className="bg-gray-50 p-4">
                    <EditDepartmentForm
                      department={department}
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

export default Departments;
