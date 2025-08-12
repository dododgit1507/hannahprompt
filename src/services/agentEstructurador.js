// src/services/agentEstructurador.js
import openai from './openaiClient.js';

export const agentEstructuradorIA = {
  analizarEstructura: async (especialidad, modelo, consulta) => {
    const prompt = `Eres un EXPERTO ANALISTA DE ESTRUCTURAS DE PROMPTS con conocimiento profundo y actualizado de todos los modelos de IA y sus características específicas, limitaciones y fortalezas.

MISIÓN CRÍTICA: Analizar exhaustivamente la consulta del usuario y diseñar la estructura de prompt más efectiva y optimizada para el modelo de IA seleccionado.

DATOS DE ENTRADA:
ESPECIALIDAD: ${especialidad}
MODELO OBJETIVO: ${modelo}
CONSULTA DEL USUARIO: "${consulta}"

CONOCIMIENTO AVANZADO Y ACTUALIZADO DE MODELOS IA:

🤖 GPT-4 / GPT-4o (OpenAI):
- Ventana de contexto: 128k tokens
- Arquitectura: Transformer multimodal avanzado (texto, imagen, audio)
- Fortalezas ÚNICAS: Razonamiento lógico superior, coherencia excepcional, programación avanzada, seguimiento de instrucciones complejas multinivel
- Limitaciones CRÍTICAS: Alto costo por token ($0.03-0.06/1k), velocidad moderada, tendencia a "alucinar" datos específicos
- Estructura ÓPTIMA: System/User messages claros + instrucciones paso a paso numeradas + ejemplos específicos + validaciones
- Formato PREFERIDO: Rol definido + Contexto detallado + Tarea específica + Ejemplos concretos + Formato de salida + Restricciones

🧠 Claude 3 Opus (Anthropic):
- Ventana de contexto: 200k tokens (ideal para análisis extensos y documentos largos)
- Fortalezas ÚNICAS: Comprensión contextual excepcional, tareas complejas multipasos, respuestas éticas y seguras, análisis profundo
- Limitaciones CRÍTICAS: Menos creativo que GPT, API más compleja, puede ser excesivamente conservador
- Estructura ÓPTIMA: XML tags estructurados + jerarquía clara + contexto narrativo extenso
- Formato PREFERIDO: <rol></rol> + <contexto></contexto> + <tarea></tarea> + <ejemplos></ejemplos> + <formato></formato>

🦙 Llama 3 (Meta):
- Ventana de contexto: 8k tokens (CRÍTICO: extremadamente limitada)
- Fortalezas ÚNICAS: Código abierto, personalizable, buen razonamiento matemático, costo-efectivo
- Limitaciones CRÍTICAS: Contexto muy pequeño, rendimiento variable, requiere instrucciones ultra-específicas
- Estructura ÓPTIMA: Formato ultra-conciso, eliminación de redundancias, instrucciones directas
- Formato PREFERIDO: ### Instrucción: [directa] ### Contexto: [mínimo] ### Tarea: [específica] ### Respuesta:

💎 Gemini 1.5 Pro (Google):
- Ventana de contexto: 1 MILLÓN de tokens (capacidad masiva sin precedentes)
- Arquitectura: Mixture-of-Experts (MoE) multimodal extremo (texto, imagen, audio, video, documentos)
- Fortalezas ÚNICAS: Extremadamente eficiente, velocidad superior, análisis de archivos enormes, datos actualizados
- Limitaciones CRÍTICAS: Puede ser superficial sin instrucciones de profundidad específicas
- Estructura ÓPTIMA: Markdown estructurado + aprovechamiento de contexto masivo + instrucciones de profundidad
- Formato PREFERIDO: Conversacional + markdown + contexto extenso + ejemplos múltiples

🔬 DeepSeek:
- Fortalezas ÚNICAS: Razonamiento científico avanzado, análisis matemático preciso, precisión técnica extrema
- Limitaciones CRÍTICAS: Menos creativo, enfoque muy literal, dificultad con tareas abstractas
- Estructura ÓPTIMA: Lenguaje técnico claro + datos concretos + metodología paso a paso + validación numérica
- Formato PREFERIDO: Rol técnico + problema bien definido + metodología + datos + ejemplos numéricos

ANÁLISIS EXHAUSTIVO REQUERIDO:
Basándote en la especialidad "${especialidad}" y el modelo "${modelo}", debes realizar un análisis profundo y determinar:
- Fortalezas: Código abierto, personalizable, buen razonamiento
- Limitaciones: Contexto pequeño, rendimiento variable
- Estructura preferida: Instrucciones muy específicas, formato ### Instrucción: ### Contexto: ### Respuesta:

Gemini 1.5 Pro (Google):
1. ESTRUCTURA IDEAL ESPECÍFICA para maximizar el rendimiento del modelo elegido
2. ELEMENTOS CRÍTICOS que debe contener obligatoriamente el prompt
3. NIVEL DE COMPLEJIDAD apropiado para la tarea y modelo
4. NECESIDAD DE EJEMPLOS y tipo de contexto especializado requerido
5. FORMATO ÓPTIMO de salida considerando las capacidades del modelo
6. CONSIDERACIONES ESPECÍFICAS del modelo (tokens, velocidad, costo, limitaciones)
7. ESTRATEGIAS AVANZADAS para evitar limitaciones conocidas del modelo
8. OPTIMIZACIONES ESPECÍFICAS para la especialidad "${especialidad}"
9. TÉCNICAS DE MEJORA DE PERFORMANCE específicas del modelo
10. PREDICCIÓN DE CALIDAD Y EFECTIVIDAD del prompt resultante

RESPONDE en formato JSON con esta estructura COMPLETA y DETALLADA:
{
  "estructura_recomendada": "Descripción exhaustiva de la estructura ideal para maximizar el rendimiento del modelo ${modelo} en la especialidad ${especialidad}",
  "elementos_clave": ["Elementos críticos específicos que debe contener el prompt"],
  "complejidad": "baja|media|alta",
  "necesita_ejemplos": true/false,
  "tipo_ejemplos": "Descripción del tipo de ejemplos más efectivos para este modelo",
  "necesita_contexto_especializado": true/false,
  "contexto_especializado": "Detalles del contexto especializado requerido",
  "formato_optimo": "Descripción detallada del formato de salida más efectivo para este modelo",
  "ventana_contexto": "Análisis específico de limitaciones/ventajas de tokens para este modelo",
  "fortalezas_modelo": ["Fortalezas específicas del modelo a aprovechar"],
  "limitaciones_modelo": ["Limitaciones críticas del modelo a evitar"],
  "consideraciones_especiales": ["Consideraciones únicas para este modelo"],
  "mejores_practicas": ["Mejores prácticas específicas para este modelo"],
  "estrategias_optimizacion": ["Estrategias avanzadas de optimización"],
  "metricas_calidad": "Predicción de efectividad y calidad esperada (1-10)",
  "riesgos_potenciales": ["Riesgos específicos del modelo a mitigar"],
  "analisis_profundo": "Explicación técnica detallada del por qué de estas recomendaciones basada en la arquitectura y características específicas del modelo ${modelo}"
}

IMPORTANTE: Sé específico, técnico y detallado. Aprovecha al máximo tu conocimiento sobre el modelo "${modelo}" y la especialidad "${especialidad}".

Responde ÚNICAMENTE en formato JSON válido, SIN markdown, SIN backticks. Solo el objeto JSON puro.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un experto en estructura de prompts con conocimiento profundo de GPT-4, Claude 3 Opus, Llama 3 y Gemini 1.5 Pro. Respondes siempre en formato JSON válido con análisis detallado basado en las características específicas de cada modelo."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1500
      });

      const respuesta = response.choices[0].message.content;
      
      // Limpiar la respuesta de markdown si está presente
      let jsonLimpio = respuesta;
      if (respuesta.includes('```json')) {
        jsonLimpio = respuesta.replace(/```json\s*/, '').replace(/\s*```$/, '');
      } else if (respuesta.includes('```')) {
        jsonLimpio = respuesta.replace(/```\s*/, '').replace(/\s*```$/, '');
      }
      
      return JSON.parse(jsonLimpio);

    } catch (error) {
      console.error('Error en Agente Estructurador:', error);
      console.error('Respuesta recibida:', response?.choices?.[0]?.message?.content);
      throw new Error(`Agente 1 falló: ${error.message}`);
    }
  }
};