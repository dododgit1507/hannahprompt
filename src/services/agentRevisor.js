import openai from './openaiClient.js';

export const agentRevisorIA = {
  revisarYOptimizar: async (especialidad, modelo, consulta, promptOptimizado, estructuraAnalisis) => {
    const promptRevisor = `Revisar este prompt optimizado considerando las características específicas del modelo ${modelo}:

CONSULTA ORIGINAL:
${consulta}

PROMPT OPTIMIZADO:
${promptOptimizado}

ANÁLISIS DE ESTRUCTURA PREVIO:
${JSON.stringify(estructuraAnalisis, null, 2)}

CONOCIMIENTO ESPECIALIZADO POR MODELO:

Si es GPT-4:
- Verificar aprovechamiento óptimo del contexto de 128k
- Confirmar uso efectivo de function calling si aplica
- Validar estructura para minimizar alucinaciones
- Considerar costo por token en optimización

Si es Claude 3 Opus:
- Verificar uso correcto de XML tags
- Maximizar aprovechamiento del contexto de 200k
- Enfatizar aspectos de seguridad y precisión
- Optimizar para análisis de documentos extensos

Si es Llama 3:
- CRÍTICO: Reducir tokens al mínimo esencial
- Eliminar redundancias y texto innecesario
- Hacer instrucciones ultra-específicas y directas
- Compensar limitación de contexto con precisión

Si es Gemini 1.5 Pro:
- Aprovechar contexto masivo de 1M tokens
- Optimizar para arquitectura MoE
- Estructurar para máxima eficiencia
- Considerar capacidades multimodales avanzadas

ESPECIALIDAD "${especialidad}" - CONSIDERACIONES DE REVISIÓN:
- Marketing: Verificar frameworks persuasivos, CTAs claros
- Programación: Validar sintaxis, mejores prácticas, testing
- Medicina: Extrema precisión, disclaimers, base en evidencia
- Educación: Pedagogía clara, progresión lógica
- Finanzas: Rigor analítico, gestión de riesgos
- Creatividad: Balance estructura-flexibilidad

FORMATO DE RESPUESTA REQUERIDO:
{
  "evaluacion": {
    "claridad": {
      "puntuacion": 8.5,
      "comentario": "El prompt es claro y específico"
    },
    "estructura": {
      "puntuacion": 7.8,
      "comentario": "Buena organización, puede mejorar"
    },
    "eficiencia": {
      "puntuacion": 9.0,
      "comentario": "Optimizado para el modelo seleccionado"
    }
  },
  "puntuacion_total": 8.4,
  "mejoras_aplicadas": ["Lista de mejoras implementadas"],
  "recomendaciones": ["Lista de recomendaciones futuras"],
  "prompt_mejorado": "Versión final optimizada del prompt",
  "analisis_modelo": "Análisis específico para ${modelo}",
  "resumen_final": "Evaluación general y próximos pasos"
}

Responde SOLO el JSON, sin texto adicional ni markdown.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: promptRevisor }],
      temperature: 0.7,
      max_tokens: 1500
    });

    let content = response.choices[0].message.content.trim();
    
    // Limpiar markdown si está presente
    if (content.includes('```json')) {
      content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    } else if (content.includes('```')) {
      content = content.replace(/```\s*/g, '').replace(/```\s*/g, '');
    }
    
    return JSON.parse(content);
  } catch (error) {
    console.error('Error en el agente revisor:', error);
    throw new Error(`Error en la revisión: ${error.message}`);
  }
  }
};
