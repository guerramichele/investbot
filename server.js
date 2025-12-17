const express = require('express');
const path = require('path');
const app = express();

// Serve i file statici dalla cartella build
app.use(express.static(path.join(__dirname, 'build')));

// Gestisci tutte le route con React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server avviato sulla porta ${PORT}`);
});
