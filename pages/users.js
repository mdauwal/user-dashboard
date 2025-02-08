import React, { useEffect, useState } from "react";
import { fetchUsers } from "../utils/api";
import UserTable from "../components/UserTable";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>
      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <UserTable users={users} />
    </div>
  );
};

export default Users;
