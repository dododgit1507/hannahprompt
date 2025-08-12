// src/services/openaiClient.js
import OpenAI from 'openai';

// Usando variable de entorno para la API key
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('VITE_OPENAI_API_KEY no está configurada en las variables de entorno');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Para uso en el navegador
});

export default openai;