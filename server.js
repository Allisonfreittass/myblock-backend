require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contractRouter = require('./routes/contract-routes');
const authRouter = require('./routes/auth-routes');
const mongoose = require('mongoose')

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/api', contractRouter);
app.use('/auth', authRouter);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('🟢 Conectado ao MongoDB');
  app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
})
.catch(err => {
  console.error('❌ Erro ao conectar ao MongoDB:', err.message);
});

app.listen(PORT, () => {
  console.log(`Rodando na porta ${PORT}`);
});
