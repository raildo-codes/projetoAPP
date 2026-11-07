const express = require('express');
const cors = require('cors');
const db = require('./database');
// ==============================================================================================================================
const app = express();
app.use(cors());
app.use(express.json());
// ==============================================================================================================================
// Validação do código de ADM
app.post('/admin/auth', (req, res) => {
  const { codigo } = req.body;
  if (codigo === '123456') {
    return res.status(200).json({ autorizado: true });
  }
  
  return res.status(401).json({ autorizado: false, erro: 'Código incorreto' });
});
// ==============================================================================================================================
// Listar fila de espera
app.get('/fila', (req, res) => {
  db.all("SELECT * FROM agendamentos WHERE status = 'aguardando' ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});
// ==============================================================================================================================
// POST CRIAR AGENDAMENTO COM VERIFICAÇÃO DE CONFLITO
app.post('/agendamentos', (req, res) => {
  const { nome, servico, barbeiro, horario, dia } = req.body;

  if (!nome || !barbeiro || !horario || !dia) {
    return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios, incluindo o dia.' });
  }

  // ➔ ADICIONADO: Verifica se já existe um agendamento ativo para o mesmo barbeiro, no mesmo dia e horário
  const queryVerificacao = `
    SELECT * FROM agendamentos 
    WHERE barbeiro = ? AND dia = ? AND horario = ? AND status = 'aguardando'
  `;

  db.get(queryVerificacao, [barbeiro, dia, horario], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }

    // Se encontrar algum registo, significa que o horário já está ocupado
    if (row) {
      return res.status(400).json({ 
        erro: `Este horário (${horario}) na ${dia} com o barbeiro ${barbeiro} já está ocupado!` 
      });
    }

    // Se estiver livre, prossegue com a inserção normal
    const queryInsercao = `
      INSERT INTO agendamentos (nome, servico, barbeiro, horario, dia, status)
      VALUES (?, ?, ?, ?, ?, 'aguardando')
    `;

    db.run(queryInsercao, [nome, servico || 'Corte Cabelo', barbeiro, horario, dia], function (err) {
      if (err) {
        return res.status(500).json({ erro: err.message });
      }
      res.status(201).json({
        mensagem: 'Agendamento criado com sucesso!',
        id: this.lastID,
      });
    });
  });
});
// ==============================================================================================================================
// PATCH ATUALIZAR STATUS
app.patch('/agendamentos/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const query = `UPDATE agendamentos SET status = ? WHERE id = ?`;

  db.run(query, [status, id], function (err) {
    if (err) {
      return res.status(500).json({ erro: err.message });
    }
    res.json({ mensagem: 'Estado atualizado com sucesso!' });
  });
});
// ==============================================================================================================================
// Listar todos os serviços
app.get('/servicos', (req, res) => {
  db.all("SELECT * FROM servicos", (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.post('/servicos', (req, res) => {
  const { nome, preco } = req.body;
  if (!nome || preco === undefined) {
    return res.status(400).json({ erro: 'Nome e preço são obrigatórios.' });
  }
  db.run("INSERT INTO servicos (nome, preco) VALUES (?, ?)", [nome, preco], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ id: this.lastID, mensagem: 'Serviço criado com sucesso!' });
  });
});

app.put('/servicos/:id', (req, res) => {
  const { id } = req.params;
  const { preco } = req.body;
  db.run("UPDATE servicos SET preco = ? WHERE id = ?", [preco, id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Preço atualizado com sucesso!' });
  });
});

app.delete('/servicos/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM servicos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Serviço excluído com sucesso!' });
  });
});
// ==============================================================================================================================
// Listar todos os barbeiros
app.get('/barbeiros', (req, res) => {
  db.all("SELECT * FROM barbeiros", (err, rows) => {
    if (err) return res.status(500).json({ erro: err.message });
    res.json(rows);
  });
});

app.post('/barbeiros', (req, res) => {
  const { nome } = req.body;
  if (!nome) {
    return res.status(400).json({ erro: 'O nome do barbeiro é obrigatório.' });
  }
  db.run("INSERT INTO barbeiros (nome) VALUES (?)", [nome], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.status(201).json({ id: this.lastID, mensagem: 'Barbeiro adicionado com sucesso!' });
  });
});

app.delete('/barbeiros/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM barbeiros WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ erro: err.message });
    res.json({ mensagem: 'Barbeiro excluído com sucesso!' });
  });
});
// ==============================================================================================================================
// Inicialização do servidor acessível na rede local
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`SERVIDOR RODANDO!`);
});