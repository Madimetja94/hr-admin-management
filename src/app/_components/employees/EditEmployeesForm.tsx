"use client";

import { api } from "~/trpc/react";
import React, { useState, useEffect } from "react";

const EditEmployeeForm = ({ employee, onClose }) => {
  const [firstName, setFirstName] = useState(employee.firstName);
  const [lastName, setLastName] = useState(employee.lastName);
  const [email, setEmail] = useState(employee.email);
  const [phoneNumber, setPhoneNumber] = useState(employee.phoneNumber);
  const [status, setStatus] = useState(employee.status);
  const [selectedManager, setSelectedManager] = useState(employee.managerId);
  const [role, setRole] = useState(employee.role);

  const { data: managerList } = api.employee.getManagers.useQuery();
  const editEmployeeMutation = api.employee.updateEmployee.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await editEmployeeMutation.mutateAsync({
        id: employee.id,
        firstName,
        lastName,
        email,
        phoneNumber,
        status,
        managerId: selectedManager,
        role,
      });
      alert("Employee updated successfully!");
    } catch (error) {
      alert("Failed to update employee: " + error.message);
    }
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded border border-gray-300 bg-gray-50 p-4"
    >
      <h2 className="mb-2 text-xl">Edit Employee</h2>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="First Name"
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="Last Name"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="Email"
      />
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="Phone Number"
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
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-2 w-full rounded border p-2"
      >
        <option value="user">User</option>
        <option value="manager">Manager</option>
        <option value="admin">Admin</option>
      </select>
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Update
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

export default EditEmployeeForm;
