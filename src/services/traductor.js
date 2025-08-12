// src/services/traductor.js
import openai from './openaiClient.js';

export const traductorPrompts = {
  traducirAlIngles: async (prompt) => {
    const promptTraduccion = `Traduce este prompt al inglés de manera profesional y técnica, manteniendo:

1. TODAS las instrucciones específicas
2. La estructura exacta del prompt
3. Los términos técnicos apropiados
4. El tono y estilo profesional
5. Las llamadas a la acción específicas

PROMPT A TRADUCIR:
${prompt}

INSTRUCCIONES:
- Mantén la misma estructura y formato
- Usa terminología técnica precisa en inglés
- Conserva todos los elementos funcionales
- Optimiza para reducir tokens sin perder funcionalidad
- NO agregues explicaciones adicionales
- Responde SOLO con la traducción del prompt

TRADUCCIÓN:`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: promptTraduccion }],
        temperature: 0.1, // Muy determinístico para traducciones precisas
        max_tokens: 2000
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error en traducción:', error);
      throw new Error(`Error al traducir: ${error.message}`);
    }
  },

  // Función para estimar tokens ahorrados
  estimarTokensAhorrados: (textoEspanol, textoIngles) => {
    // Estimación aproximada: español suele usar más tokens que inglés
    const tokensEspanol = Math.ceil(textoEspanol.length / 3.5); // Aproximación para español
    const tokensIngles = Math.ceil(textoIngles.length / 4); // Aproximación para inglés
    const tokensAhorrados = tokensEspanol - tokensIngles;
    const porcentajeAhorro = ((tokensAhorrados / tokensEspanol) * 100).toFixed(1);
    
    return {
      tokensEspanol,
      tokensIngles,
      tokensAhorrados,
      porcentajeAhorro
    };
  }
};
