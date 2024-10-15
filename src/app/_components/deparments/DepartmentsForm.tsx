"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

const CreateDepartmentForm = ({ onClose }) => {
  const [selectedManager, setSelectedManager] = useState<number | null>(null);
  const [departmentName, setDepartmentName] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const { data: managerList } = api.department.getManagers.useQuery();
  const createDepartmentMutation =
    api.department.createDepartment.useMutation();


  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedManager(Number(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departmentName) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await createDepartmentMutation.mutateAsync({
        name: departmentName,
        status,
        managerId: selectedManager ?? null,
      });

      alert("Department created successfully!");
      setDepartmentName("");
      setSelectedManager(null);
      setStatus("active");
    } catch (error) {
      alert("Failed to create department: " + error.message);
    }
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded border border-gray-300 bg-gray-50 p-4"
    >
      <h2 className="mb-2 text-xl">Create Department</h2>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Department Name
        </label>
        <input
          type="text"
          id="name"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="manager"
          className="block text-sm font-medium text-gray-700"
        >
          Manager
        </label>
        <select
          id="manager"
          value={selectedManager ?? ""}
          onChange={handleManagerChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select Manager</option>
          {managerList?.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {manager.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
      >
        Create
      </button>
      <button
        type="button"
        onClick={onClose}
        className="ml-2 rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
      >
        Cancel
      </button>
    </form>
  );
};

export default CreateDepartmentForm;
