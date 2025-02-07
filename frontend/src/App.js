import React from 'react';
import UserList from './components/UserList'; // Si vous utilisez ce composant

function App() {
  return (
    <div>
      <h1>Gestion des Utilisateurs</h1>
      <UserList /> {/* Assurez-vous que ce composant existe et affiche des données */}
    </div>
  );
}

export default App;
