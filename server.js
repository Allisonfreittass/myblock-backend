require('dotenv').config();
const express = require('express');
const path = require('path')
const cors = require('cors');
const contractRouter = require('./routes/contract-routes');
const authRouter = require('./routes/auth-routes');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());


app.use('/api', contractRouter);
app.use('/auth', authRouter);
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

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
