const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware pour traiter les données JSON
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Créer ou ouvrir une base de données SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à SQLite', err);
  } else {
    console.log('Connecté à la base de données SQLite.');

    // Créer une table 
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);
    
  }
});

// Route de test
app.get('/', (req, res) => {
  res.send('Hello from Express with SQLite!');
});

// Ajouter un utilisateur
app.post('/users', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  const params = [name, email, password];
  
  db.run(sql, params, function (err) {
      if (err) {
          console.error(err.message);
          return res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'utilisateur' });
      }
      res.json({
          id: this.lastID,
          name,
          email
      });
  });
  
});


// Récupérer tous les utilisateurs
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
    res.json(rows);
  });
});

//Récupérer un utilisateur par ID
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM users WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(row);
  });
});


// Mettre à jour un utilisateur par ID
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
  db.run(sql, [name, email, password, id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur mis à jour avec succès' });
  });
});


// Supprimer un utilisateur par ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM users WHERE id = ?';
  db.run(sql, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  });
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur http://localhost:${port}`);
});
