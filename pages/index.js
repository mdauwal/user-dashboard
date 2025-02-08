import React, { useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners"; // Loader
import { Dialog } from "@headlessui/react"; // Modal

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError("Failed to delete user");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true); // Open modal for editing
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingUser.id}`, editingUser);
      setUsers(users.map((user) => (user.id === editingUser.id ? response.data : user)));
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) return;
    try {
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, response.data]);
      setNewUser({ name: "", email: "" });
    } catch (err) {
      setError("Failed to add user");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-pink-400 to-pink-600 min-h-screen text-white">
      <h1 className="text-3xl font-bold text-center mb-6">User Management Dashboard</h1>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      ) : (
        <>
          {error && <p className="text-red-300">{error}</p>}

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded-lg border border-pink-300 bg-pink-100 text-black"
            />
          </div>

          {/* Add User Form */}
          <div className="mb-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="p-2 rounded-lg border border-pink-300 bg-pink-100 text-black flex-1"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="p-2 rounded-lg border border-pink-300 bg-pink-100 text-black flex-1"
            />
            <button
              onClick={handleAddUser}
              className="bg-pink-700 hover:bg-pink-800 text-white font-bold py-2 px-4 rounded-lg"
            >
              Add User
            </button>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-pink-200">
              <thead>
                <tr className="bg-pink-500">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-pink-400">
                    <td className="border px-4 py-2">{user.id}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2 text-center">
                      <div className="flex flex-col md:flex-row gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal for Editing User */}
      <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <Dialog.Title className="text-lg font-bold text-black">Edit User</Dialog.Title>
            <div className="mt-4">
              <input
                type="text"
                value={editingUser?.name || ""}
                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                className="w-full p-2 rounded-lg border border-gray-300 mb-4"
              />
              <input
                type="email"
                value={editingUser?.email || ""}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="w-full p-2 rounded-lg border border-gray-300 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};

export default UserManagement;
