import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ HOMEPAGE (RISOLVE Cannot GET /)
app.get("/", (req, res) => {
  res.send("✅ AI Stock Bot online e funzionante");
});

// 🤖 CHAT BOT
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Sei un assistente AI esperto SOLO di:
- azioni
- investimenti
- mercati finanziari
- analisi a breve e lungo termine

Rispondi nella lingua dell’utente.
Fai analisi, non promesse.
`
        },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server avviato sulla porta", PORT);
});
