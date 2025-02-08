import React, { useState } from "react";
import { createUser } from "../utils/api";

const UserForm = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = { name, email };
    const addedUser = await createUser(newUser);
    onUserAdded(addedUser);
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
        Add User
      </button>
    </form>
  );
};

export default UserForm;
