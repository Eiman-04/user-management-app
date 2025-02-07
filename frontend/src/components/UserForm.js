import React, { useState } from 'react';
import axios from 'axios';

const UserForm = ({ user, onSave }) => {
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = { name, email };

    if (user) {
      // Update existing user
      axios.put(`http://localhost:3000/api/users/${user.id}`, userData)
        .then(() => onSave())
        .catch((error) => console.error(error));
    } else {
      // Create new user
      axios.post('http://localhost:3000/api/users', userData)
        .then(() => onSave())
        .catch((error) => console.error(error));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <button type="submit">{user ? 'Update User' : 'Create User'}</button>
    </form>
  );
};

export default UserForm;
