import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const UserDetail = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/users/${id}`)
      .then((response) => setUser(response.data))
      .catch((error) => console.error(error));
  }, [id]);

  if (!user) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h1>Détails de l'utilisateur</h1>
      <p>Nom : {user.name}</p>
      <p>Email : {user.email}</p>
    </div>
  );
};

export default UserDetail;
