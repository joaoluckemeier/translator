import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/api/translate', async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Translate Brazilian Portuguese to natural conversational English. Return ONLY the translation.'
          },
          { role: 'user', content: text }
        ]
      })
    });

    const data = await response.json();
    const translation = data.choices?.[0]?.message?.content || 'Translation error';
    res.json({ translation });
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ translation: '⚠ Erro no servidor' });
  }
});

app.listen(3000, () => {
  console.log('🟢 Rodando em http://localhost:3000');
});