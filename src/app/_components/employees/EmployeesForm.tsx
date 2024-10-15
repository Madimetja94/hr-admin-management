"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

const CreateEmployeeForm = ({ onClose }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState<number | null>(null);

  const { data: managerList } = api.employee.getManagers.useQuery();
  const createEmployeeMutation = api.employee.createEmployee.useMutation();

  const handleManagerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedManager(Number(e.target.value));
  };

   useEffect(() => {
     if (managerList) {
       setManagers(managerList);
     }
   }, [managerList]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !email || !phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      await createEmployeeMutation.mutateAsync({
        firstName,
        lastName,
        email,
        phoneNumber,
        status: "active",
        managerId: selectedManager ?? null,
      });

      alert("Employee created successfully!");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setSelectedManager(null);
    } catch (error) {
      alert("Failed to create employee: " + error.message);
    }
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 rounded border border-gray-300 bg-gray-50 p-4"
    >
      <h2 className="mb-2 text-xl">Create Employee</h2>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="First Name"
        required
      />
      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="Last Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="mb-2 w-full rounded border p-2"
        placeholder="Phone Number"
        required
      />
      <select
        value={selectedManager ?? ""}
        onChange={handleManagerChange}
        className="mb-2 w-full rounded border p-2"
      >
        <option value="">Select Manager</option>
        {managerList?.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.name}
          </option>
        ))}
      </select>
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

export default CreateEmployeeForm;
