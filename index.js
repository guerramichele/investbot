import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint di base
app.get('/', (req, res) => {
  res.send('AI Stock Bot è attivo!');
});

// Endpoint per la chat
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;

  // Qui implementeremo la memoria e altre funzionalità

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `
Sei un assistente AI esperto di mercati finanziari, azioni, criptovalute e investimenti. Rispondi nella lingua dell'utente e fornisci analisi approfondite.`
        },
        { role: 'user', content: message }
      ]
    });

    res.json({ reply: response.data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
});
