const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

// Initialisation de l'application Express
const app = express();
app.use(express.json());

// Configuration de la base de données MySQL
const sequelize = new Sequelize('moniq_project', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

// Modèles des tables

// Longquery Table
const Longquery = sequelize.define('Longquery', {
  query: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  execution_time: {
    type: DataTypes.FLOAT,
    allowNull: false, // Temps en secondes
  },
  timestamp: {
    type: DataTypes.STRING,
    allowNull: false, // Timestamp de la requête
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Le nom de la table
      key: 'id', // Clé primaire de la table User
    },
    allowNull: false, // La clé étrangère
  },
});

// Query Table
const Query = sequelize.define('Query', {
  query_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  execution_time: {
    type: DataTypes.FLOAT,
    allowNull: false, // Temps d'exécution
  },
  timestamp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Le nom de la table
      key: 'id', // Clé primaire de la table User
    },
    allowNull: false, // La clé étrangère
  },
});

// User Table
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false, // admin ou user
  },
  action: {
    type: DataTypes.STRING(20),
    allowNull: false, // login ou logout
  },
  queries_count: {
    type: DataTypes.INTEGER,
    allowNull: false, // Nombre de requêtes effectuées
    defaultValue: 0, // Valeur par défaut
  },
});

// Error Table
const Error = sequelize.define('Error', {
  level: {
    type: DataTypes.STRING(20),
    allowNull: false, // error, warning
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.STRING(50),
    allowNull: false, // Date/heure de l'erreur
  },
  action: {
    type: DataTypes.STRING(100),
    allowNull: true, // Action associée à l'erreur
  },
});

// System Usage Table
const SystemUsage = sequelize.define('SystemUsage', {
  timestamp: {
    type: DataTypes.STRING(50),
    allowNull: false, // Timestamp en format string
  },
  cpu_usage: {
    type: DataTypes.FLOAT,
    allowNull: false, // Utilisation du CPU en pourcentage
  },
  memory_usage: {
    type: DataTypes.FLOAT,
    allowNull: false, // Utilisation de la mémoire en pourcentage
  },
});

// Relations
User.hasMany(Longquery, { foreignKey: 'user_id' });
User.hasMany(Query, { foreignKey: 'user_id' });
Longquery.belongsTo(User, { foreignKey: 'user_id' });
Query.belongsTo(User, { foreignKey: 'user_id' });

// Routes API

// Récupérer la liste des utilisateurs
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    const usersList = users.map((user) => ({
      id: user.id,
      name: user.name,
      role: user.role,
      action: user.action,
      queries: user.queries_count,
    }));
    res.json(usersList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer un utilisateur spécifique par ID
app.get('/api/users/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    const userData = {
      id: user.id,
      name: user.name,
      role: user.role,
      action: user.action,
      queries: user.queries_count,
    };
    res.json(userData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialisation du serveur et de la base de données
const PORT = 3000;
app.listen(PORT, async () => {
  try {
    await sequelize.sync({ force: true }); // Crée toutes les tables
    console.log('Toutes les tables ont été créées avec succès.');
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
  } catch (error) {
    console.error('Erreur lors de la configuration de la base de données :', error);
  }
});

