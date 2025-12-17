import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

// Memoria delle conversazioni (semplice esempio in memoria volatile)
const conversationMemory = {};

// Route principale
app.get('/', (req, res) => {
  res.send('AI Stock Bot è attivo e funzionante!');
});

// Endpoint per la chat con memoria
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;

  // Recupera la memoria per l'utente (se esiste)
  const userMemory = conversationMemory[userId] || [];

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Sei un assistente AI esperto di mercati finanziari, azioni, criptovalute e investimenti. Rispondi nella lingua dell’utente e fornisci analisi approfondite.`
        },
        ...userMemory,
        { role: 'user', content: message }
      ]
    });

    const botResponse = response.choices[0].message.content;

    // Aggiorna la memoria con la nuova conversazione
    userMemory.push({ role: 'user', content: message });
    userMemory.push({ role: 'assistant', content: botResponse });
    conversationMemory[userId] = userMemory;

    res.json({ reply: botResponse });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Funzione per ottenere dati finanziari da Alpha Vantage
async function getStockData(symbol) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  return data;
}

// Endpoint per ottenere dati finanziari
app.get('/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;

  try {
    const stockData = await getStockData(symbol);
    res.json(stockData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Inizializzazione del server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
