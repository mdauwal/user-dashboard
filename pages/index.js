import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

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
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      const response = await axios.put(`${API_URL}/${editingUser.id}`, editingUser);
      setUsers(users.map((user) => (user.id === editingUser.id ? response.data : user)));
      setEditingUser(null);
    } catch (err) {
      setError("Failed to update user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-pink-400 to-pink-600 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-8">User Management Dashboard</h1>
      {loading && <p className="text-center">Loading users...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {editingUser && (
        <div className="bg-white p-4 rounded-lg shadow-lg mb-6 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Edit User</h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter name"
            />
            <input
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              placeholder="Enter email"
            />
            <button
              onClick={handleUpdate}
              className="bg-pink-700 hover:bg-pink-800 text-white font-semibold px-4 py-2 rounded transition-all duration-300"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="bg-pink-700 text-white">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-white text-black hover:bg-pink-100 transition-all">
                <td className="px-4 py-2 border">{user.id}</td>
                <td className="px-4 py-2 border">{user.name}</td>
                <td className="px-4 py-2 border">{user.email}</td>
                <td className="px-4 py-2 border flex flex-wrap gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded transition-all duration-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-1 rounded transition-all duration-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
