export default async function handler(req, res) {
  // Basic CORS support for local dev and file:// origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { message, context, history } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing "message" string in body' });
    }

    const API_KEY = process.env.GOOGLE_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: 'Server not configured', message: 'Missing GOOGLE_API_KEY environment variable' });
    }
    const model = 'gemini-2.5-flash-lite';

    const contents = [];
    // System-style context priming
    if (context) {
      contents.push({
        role: 'user',
        parts: [{ text: `You are a helpful AI assistant for the "3D Learning Hub" educational website. Context: ${context}\nAnswer concisely and helpfully.` }]
      });
      contents.push({
        role: 'model',
        parts: [{ text: 'Understood. I will assist with 3D models, anatomy, and engineering topics.' }]
      });
    }

    // Conversation history
    if (Array.isArray(history)) {
      for (const h of history) {
        const role = h.role === 'user' ? 'user' : 'model';
        contents.push({ role, parts: [{ text: String(h.content || '') }] });
      }
    }

    // Current user message
    contents.push({ role: 'user', parts: [{ text: message }] });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;

    const body = {
      contents,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUAL', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_NONE' }
      ]
    };

    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const json = await r.json();
    if (!r.ok) {
      const msg = json?.error?.message || 'Gemini API error';
      // surface more detail to help debugging
      return res.status(r.status).json({ error: msg, details: json });
    }

    const candidate = json?.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const text = parts.map(p => p.text || '').join('') || '...';

    return res.status(200).json({ text });
  } catch (err) {
    console.error('chat proxy error', err);
    return res.status(500).json({ error: 'Internal Server Error', message: String(err?.message || err) });
  }
}
