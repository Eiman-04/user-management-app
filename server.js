const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Middleware pour traiter les données JSON
app.use(express.json());

// Créer ou ouvrir une base de données SQLite
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Erreur de connexion à SQLite', err);
  } else {
    console.log('Connecté à la base de données SQLite.');

    // Créer une table 'users' si elle n'existe pas
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

// a) Create (Ajouter un utilisateur)
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


// b) Read (Récupérer tous les utilisateurs)
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
    res.json(rows);
  });
});

// c) Read (Récupérer un utilisateur par ID)
app.get('/users/:id', (req, res) => {
  const query = 'SELECT * FROM users WHERE id = ?';
  db.get(query, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la récupération de l\'utilisateur' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(row);
  });
});

// d) Update (Mettre à jour un utilisateur par ID)
app.put('/users/:id', (req, res) => {
  const { name, email, password } = req.body;

  // Validation des champs requis
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
  db.run(query, [name, email, password, req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur mis à jour avec succès' });
  });
});

// e) Delete (Supprimer un utilisateur par ID)
app.delete('/users/:id', (req, res) => {
  const query = 'DELETE FROM users WHERE id = ?';
  db.run(query, [req.params.id], function (err) {
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
