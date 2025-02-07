import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  // Charger la liste des utilisateurs au chargement de la page
  useEffect(() => {
    axios.get('http://localhost:3000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      });
  }, []);

  // Ajouter un utilisateur
  const handleAddUser = () => {
    if (!name || !email || !password) {
      alert("Tous les champs sont requis !");
      return;
    }
    axios.post('http://localhost:3000/users', { name, email, password })
      .then(response => {
        setUsers([...users, response.data]); // Ajouter l'utilisateur à la liste
        setName('');
        setEmail('');
        setPassword('');
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  // Modifier un utilisateur
  const handleUpdateUser = () => {
    if (!name || !email || !password) {
      alert("Tous les champs sont requis !");
      return;
    }
    if (selectedUser) {
      axios.put(`http://localhost:3000/users/${selectedUser.id}`, { name, email, password })
        .then(response => {
          const updatedUsers = users.map(user =>
            user.id === selectedUser.id ? response.data : user
          );
          setUsers(updatedUsers);
          resetForm();
        })
        .catch(error => {
          console.error('Erreur:', error);
        });
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = (id) => {
    axios.delete(`http://localhost:3000/users/${id}`)
      .then(response => {
        setUsers(users.filter(user => user.id !== id)); // Supprimer de la liste
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setSelectedUser(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="user-management">
      <h1>Gestion des Utilisateurs</h1>

      {/* Formulaire pour Ajouter ou Modifier un Utilisateur */}
      <div className="user-form">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Nom"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mot de passe"
        />
        <button onClick={selectedUser ? handleUpdateUser : handleAddUser}>
          {selectedUser ? "Mettre à jour" : "Ajouter"}
        </button>
        {selectedUser && (
          <button onClick={resetForm}>Annuler</button>
        )}
      </div>

      {/* Liste des Utilisateurs */}
      <h2>Liste des Utilisateurs</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <span>{user.name} ({user.email})</span>
            <button onClick={() => setSelectedUser(user)}>Modifier</button>
            <button onClick={() => handleDeleteUser(user.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;
