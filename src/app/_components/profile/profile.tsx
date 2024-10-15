import { redirect } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";

const Profile = ({ session }) => {
  if (!session) {
    redirect("/api/auth/signin");
  }

  const userId = session?.user?.id;
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const { data, refetch } = api.user.getUserById.useQuery(userId, {
    enabled: !!userId,
    onSuccess: (data) => {
      if (data) {
        setUserData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
        });
      }
    },
  });

  const updateProfile = api.user.updateUser.useMutation({
    onSuccess: () => {
      refetch(); 
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfile.mutate({
      id: userId, 
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
    
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-bold">Your Profile</h2>
      <form
        onSubmit={handleSubmit}
        className="rounded-lg bg-white p-6 shadow-md"
      >
        <div className="mb-4">
          <label className="mb-2 block text-gray-700" htmlFor="firstName">
            First Name:
          </label>
          <input
            type="text"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700" htmlFor="lastName">
            Last Name:
          </label>
          <input
            type="text"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={data?.email || userData.email}
            readOnly
            className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700" htmlFor="phoneNumber">
            Phone Number:
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-600"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
