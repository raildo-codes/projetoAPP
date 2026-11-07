const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'barbearia.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erro ao conectar ao SQLite:', err.message);
  else console.log('Banco de dados FUNCIONANDO!');//aparece no terminal
});



db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS agendamentos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      
      barbeiro TEXT NOT NULL,
      horario TEXT NOT NULL,
      dia TEXT NOT NULL,
      status TEXT DEFAULT 'aguardando'
    )
  `);


  

  db.run(`
    CREATE TABLE IF NOT EXISTS barbeiros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS servicos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      preco REAL NOT NULL
    )
  `);
});

module.exports = db;