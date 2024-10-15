"use client";

import { api } from "~/trpc/react";
import React, { useState, useEffect } from "react";

const EditDepartmentForm = ({ department, onClose }) => {
  const [departmentName, setDepartmentName] = useState(department.name);
  const [selectedManager, setSelectedManager] = useState(
    department.managerId,
  );
  const [status, setStatus] = useState(department.status);

  const { data: managerList } = api.department.getManagers.useQuery();
  const updateDepartment = api.department.updateDepartment.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await updateDepartment.mutateAsync({
      id: department.id,
      name: departmentName,
      managerId: selectedManager,
      status: status,
    });

    onClose(department.id);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded border border-gray-300 bg-gray-50 p-4"
    >
      <h2 className="mb-2 text-xl">Edit Department</h2>

      <input
        type="text"
        value={departmentName}
        onChange={(e) => setDepartmentName(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        required
      />

      <select
        value={selectedManager ?? ""}
        onChange={(e) => setSelectedManager(Number(e.target.value))}
        className="mb-2 w-full rounded border p-2"
      >
        <option value="">Select Manager</option>
        {managerList?.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.name}
          </option>
        ))}
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="mb-2 w-full rounded border p-2"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => onClose(null)}
        className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
      >
        Cancel
      </button>
    </form>
  );
};

export default EditDepartmentForm;
