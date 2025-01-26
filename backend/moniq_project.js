const express = require('express');
const mysql = require('mysql2/promise');
const os = require('os');
const cors = require('cors'); // Importe le package cors

const app = express();


app.use(
  cors({
    origin: 'http://localhost:3001', // Autorise uniquement ce domaine
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
    credentials: true, // Autorise les cookies et les en-têtes d'authentification
  })
);

app.use(express.json());
// Configuration de la base de données MySQL
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Assurez-vous de mettre un mot de passe si nécessaire
  database: 'moniq_project',
};

let connection;

// Connexion à la base de données et initialisation des tables
(async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connecté à la base de données MySQL.');

    // Création des tables si elles n'existent pas
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        action VARCHAR(20) NOT NULL,
        queries_count INT DEFAULT 0
      );
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Longquery (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query TEXT NOT NULL,
        execution_time FLOAT NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Queries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        query TEXT NOT NULL,
        execution_time FLOAT NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        user_id INT,
        FOREIGN KEY (user_id) REFERENCES Users(id)
      );
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Error (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT NOT NULL,
        timestamp VARCHAR(50) NOT NULL
      );
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS SystemUsage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        timestamp VARCHAR(50) NOT NULL,
        cpu_usage FLOAT NOT NULL,
        memory_usage FLOAT NOT NULL
      );
    `);

    console.log('Tables vérifiées ou créées avec succès.');

    // Remplir les tables avec les données initiales
    await populateTables();

    // Démarrer la surveillance périodique
    startMonitoring();
  } catch (error) {
    console.error('Erreur lors de la connexion ou l\'exécution des requêtes :', error);
    process.exit(1);
  }
})();

// Fonction pour remplir les tables avec les données initiales
async function populateTables() {
  try {
    // Récupérer les utilisateurs MySQL
    const [users] = await connection.execute(`
      SELECT user AS User, host AS Host FROM mysql.user;
    `);
    console.log('Utilisateurs MySQL récupérés :', users);

    for (const user of users) {
      const username = user.User;
      const host = user.Host;

      if (!username || !host) {
        console.warn(`Utilisateur ou hôte non défini : ${JSON.stringify(user)}`);
        continue;
      }

      try {
        const [privileges] = await connection.execute(`
          SHOW GRANTS FOR '${username}'@'${host}';
        `);

        const role = privileges.some(grant => grant.Grants_for.includes('ALL PRIVILEGES')) ? 'admin' : 'user';

        await connection.execute(`
          INSERT INTO Users (name, role, action) VALUES (?, ?, 'connect')
        `, [username, role]);
      } catch (error) {
        console.error(`Erreur lors de la récupération des privilèges pour l'utilisateur '${username}'@'${host}' :`, error);
      }
    }

    console.log('Table Users remplie avec succès.');
  } catch (error) {
    console.error('Erreur lors du remplissage des tables :', error);
  }
}

// Fonction pour démarrer la surveillance périodique
function startMonitoring() {
  setInterval(monitorQueries, 10000); // Surveiller les requêtes toutes les 10 secondes
  setInterval(monitorSystemUsage, 60000); // Surveiller les ressources système toutes les 60 secondes
}

// Fonction pour surveiller les requêtes en cours d'exécution
async function monitorQueries() {
  try {
    // Récupérer les requêtes en cours d'exécution
    const [queries] = await connection.execute(`
      SELECT info AS query, time AS execution_time, now() AS timestamp, user AS user_name
      FROM information_schema.processlist
      WHERE command != 'Sleep' AND info IS NOT NULL;
    `);

    console.log('Requêtes en cours d\'exécution récupérées :', queries);

    for (const query of queries) {
      const userId = await getUserId(query.user_name);
      if (userId !== null) {
        await insertQueryIfNotExists('Queries', query.query, query.execution_time, query.timestamp, userId);

        // Si la requête est longue, l'enregistrer dans la table Longquery
        if (query.execution_time > 10) { // Seuil de 10 secondes pour les longues requêtes
          await insertQueryIfNotExists('Longquery', query.query, query.execution_time, query.timestamp, userId);
        }
      }
    }

    // Nettoyer les anciennes entrées pour éviter une surcharge de la base de données
    await cleanOldEntries('Queries', 1000); // Garder les 1000 dernières entrées
    await cleanOldEntries('Longquery', 500); // Garder les 500 dernières entrées
  } catch (error) {
    console.error('Erreur lors de la surveillance des requêtes :', error);
  }
}

// Fonction pour surveiller les ressources système
async function monitorSystemUsage() {
  try {
    const cpuUsage = os.loadavg()[0]; // Charge moyenne du CPU sur la dernière minute
    const memoryUsage = (os.totalmem() - os.freemem()) / os.totalmem(); // Pourcentage de mémoire utilisée

    await connection.execute(`
      INSERT INTO SystemUsage (timestamp, cpu_usage, memory_usage)
      VALUES (?, ?, ?)
    `, [new Date().toISOString(), cpuUsage, memoryUsage]);

    console.log('Statistiques système enregistrées.');

    // Nettoyer les anciennes entrées pour éviter une surcharge de la base de données
    await cleanOldEntries('SystemUsage', 100); // Garder les 100 dernières entrées
  } catch (error) {
    console.error('Erreur lors de la surveillance des ressources système :', error);
  }
}

// Fonction pour insérer une entrée si elle n'existe pas déjà
async function insertQueryIfNotExists(table, query, execution_time, timestamp, user_id) {
  const [existing] = await connection.execute(`
    SELECT id FROM ${table} WHERE query = ? AND timestamp = ?;
  `, [query, timestamp]);

  if (existing.length === 0) {
    await connection.execute(`
      INSERT INTO ${table} (query, execution_time, timestamp, user_id)
      VALUES (?, ?, ?, ?)
    `, [query, execution_time, timestamp, user_id]);
  }
}

// Fonction pour nettoyer les anciennes entrées
async function cleanOldEntries(table, limit) {
  await connection.execute(`
    DELETE FROM ${table}
    WHERE id NOT IN (
      SELECT id FROM (
        SELECT id FROM ${table}
        ORDER BY timestamp DESC
        LIMIT ?
      ) AS subquery
    );
  `, [limit]);
}

// Fonction pour obtenir l'ID de l'utilisateur
async function getUserId(username) {
  const [rows] = await connection.execute(`
    SELECT id FROM Users WHERE name = ? LIMIT 1;
  `, [username]);
  return rows.length > 0 ? rows[0].id : null;
}

// Routes API
app.get('/api/users', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.HOST,
        u.User AS Name,
        u.Select_priv AS Can_Select,
        u.Insert_priv AS Can_Insert,
        u.Update_priv AS Can_Update,
        u.Delete_priv AS Can_Delete,
        COUNT(es.user) AS Queries_Executed
      FROM 
        mysql.user u
      LEFT JOIN 
        performance_schema.events_statements_summary_by_user_by_event_name es 
        ON u.User = es.user
      GROUP BY 
        u.HOST, u.User, u.Select_priv, u.Insert_priv, u.Update_priv, u.Delete_priv;
    `;

    const [users] = await connection.execute(query);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/queries', async (req, res) => {
  try {
    // Query to get execution time, user ID, and query text
    const query = `
SELECT 
  TIME AS Execution_Time,  -- Execution time in seconds
  USER AS User_ID,         -- User ID
  INFO AS Query_Text       -- Query text
FROM 
  information_schema.PROCESSLIST
WHERE 
  INFO IS NOT NULL         -- Exclude rows with no query text
  AND INFO NOT LIKE '%sdfghjhgfdxcvb%';  -- Exclude queries containing somthing
    `;

    const [queries] = await connection.execute(query);
    res.json(queries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/long-queries', async (req, res) => {
  try {
    // Query to fetch slow queries from the mysql.slow_log table
    const query = `
SELECT 
  query_time AS Execution_Time,  -- Execution time of the query
  user_host AS User_ID,          -- User and host information
  sql_text AS Query_Text         -- The SQL query text
FROM 
  mysql.slow_log
ORDER BY 
  query_time DESC;               -- Order by execution time (longest first)               -- Order by execution time (longest first)
    `;

    const [slowQueries] = await connection.execute(query);
    res.json(slowQueries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/errors', async (req, res) => {
  try {
    const query = `
      SELECT 
        CASE 
          WHEN argument LIKE '%ERROR%' THEN 'Error'
          WHEN argument LIKE '%WARNING%' THEN 'Warning'
          ELSE 'Unknown'
        END AS Level,
        argument AS Message,
        event_time AS Date
      FROM 
        mysql.general_log
      WHERE 
        command_type = 'Query' AND (argument LIKE '%ERROR%' OR argument LIKE '%WARNING%')
      ORDER BY 
        event_time DESC;
    `;

    const [errors] = await connection.execute(query);
    res.json(errors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/system-usage', async (req, res) => {
  try {
    // Get memory usage
    const totalMemory = os.totalmem(); // Total system memory in bytes
    const freeMemory = os.freemem(); // Free system memory in bytes
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = ((usedMemory / totalMemory) * 100).toFixed(2); // Memory usage in percentage

    // Get CPU usage
    const cpus = os.cpus(); // Get CPU information
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });

    const idlePercentage = (totalIdle / totalTick) * 100;
    const cpuUsagePercentage = (100 - idlePercentage).toFixed(2); // CPU usage in percentage

    // Prepare the response
    const systemUsage = {
      memoryUsage: `${memoryUsagePercentage}%`, // Memory usage as a percentage
      cpuUsage: `${cpuUsagePercentage}%`, // CPU usage as a percentage
    };

    res.json(systemUsage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/user-counts', async (req, res) => {
  try {
    // Query to get all users and their privileges
    const [users] = await connection.execute(
      `SELECT 
        User, 
        Select_priv, 
        Insert_priv, 
        Update_priv, 
        Delete_priv, 
        Create_priv, 
        Drop_priv, 
        Reload_priv, 
        Shutdown_priv, 
        Process_priv, 
        File_priv, 
        Grant_priv, 
        References_priv, 
        Index_priv, 
        Alter_priv 
       FROM mysql.user;`
    );

    // Count admin and normal users
    let adminCount = 0;
    let userCount = 0;

    users.forEach((user) => {
      // Check if the user has all privileges
      const isAdmin =
        user.Select_priv === 'Y' &&
        user.Insert_priv === 'Y' &&
        user.Update_priv === 'Y' &&
        user.Delete_priv === 'Y' &&
        user.Create_priv === 'Y' &&
        user.Drop_priv === 'Y' &&
        user.Reload_priv === 'Y' &&
        user.Shutdown_priv === 'Y' &&
        user.Process_priv === 'Y' &&
        user.File_priv === 'Y' &&
        user.Grant_priv === 'Y' &&
        user.References_priv === 'Y' &&
        user.Index_priv === 'Y' &&
        user.Alter_priv === 'Y';

      if (isAdmin) {
        adminCount++;
      } else {
        userCount++;
      }
    });

    // Return the counts
    res.json({
      adminCount,
      userCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/api/system-state', async (req, res) => {
  try {
    // Query to count databases
    const [databaseCountResult] = await connection.execute(
      'SELECT COUNT(*) AS databaseCount FROM information_schema.SCHEMATA;'
    );
    const databaseCount = databaseCountResult[0].databaseCount;

    // Query to count errors and warnings separately
    const [errorResults] = await connection.execute(
      `SELECT 
        CASE 
          WHEN argument LIKE '%ERROR%' THEN 'Error'
          WHEN argument LIKE '%WARNING%' THEN 'Warning'
          ELSE 'Unknown'
        END AS Level,
        COUNT(*) AS count
       FROM 
        mysql.general_log
       WHERE 
        command_type = 'Query' 
        AND (argument LIKE '%ERROR%' OR argument LIKE '%WARNING%')
       GROUP BY 
        Level;`
    );

    // Initialize error and warning counts
    let errorCount = 0;
    let warningCount = 0;

    // Process the results
    errorResults.forEach((row) => {
      if (row.Level === 'Error') {
        errorCount = row.count;
      } else if (row.Level === 'Warning') {
        warningCount = row.count;
      }
    });

    // Query to count users
    const [userCountResult] = await connection.execute(
      'SELECT COUNT(*) AS userCount FROM mysql.user;'
    );
    const userCount = userCountResult[0].userCount;

    // Return the counts
    res.json({
      databaseCount,
      errorCount,
      warningCount,
      userCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});