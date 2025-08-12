// src/services/agentPrompteador.js
import openai from './openaiClient.js';

export const agentPrompteadorIA = {
  crearPrompt: async (especialidad, modelo, consulta, estructuraAnalisis) => {
    const prompt = `Eres un MAESTRO CREADOR DE PROMPTS con expertise avanzado en optimización para todos los modelos de IA. Tu misión es crear prompts de calidad profesional que maximicen el rendimiento del modelo específico.

MISIÓN CRÍTICA: Crear el prompt MÁS EFECTIVO y OPTIMIZADO basado en el análisis profundo del Agente Estructurador.

DATOS DE ENTRADA COMPLETOS:
- ESPECIALIDAD: ${especialidad}
- MODELO OBJETIVO: ${modelo}
- CONSULTA ORIGINAL: "${consulta}"
- ESTRUCTURA RECOMENDADA: ${estructuraAnalisis.estructura_recomendada}
- ELEMENTOS CLAVE: ${estructuraAnalisis.elementos_clave.join(', ')}
- COMPLEJIDAD: ${estructuraAnalisis.complejidad}
- FORMATO ÓPTIMO: ${estructuraAnalisis.formato_optimo}
- VENTANA CONTEXTO: ${estructuraAnalisis.ventana_contexto}
- FORTALEZAS MODELO: ${estructuraAnalisis.fortalezas_modelo?.join(', ')}
- LIMITACIONES MODELO: ${estructuraAnalisis.limitaciones_modelo?.join(', ')}
- CONSIDERACIONES ESPECIALES: ${estructuraAnalisis.consideraciones_especiales?.join(', ')}
- MEJORES PRÁCTICAS: ${estructuraAnalisis.mejores_practicas?.join(', ')}
- ESTRATEGIAS OPTIMIZACIÓN: ${estructuraAnalisis.estrategias_optimizacion?.join(', ')}

CONOCIMIENTO AVANZADO Y ESPECIALIZADO POR MODELO:

🤖 GPT-4 / GPT-4o (OpenAI) - CARACTERÍSTICAS AVANZADAS:
- Tokens: 128k | Multimodal: texto, imagen, audio | Costo: Premium
- ESPECIALISTA EN: Coherencia excepcional, razonamiento lógico complejo, programación avanzada, análisis multipasos
- LIMITACIONES CRÍTICAS: Alto costo por token, velocidad moderada, tendencia a alucinar datos específicos
- CASOS DE USO IDEALES: Análisis complejo, programación, educación avanzada, investigación, content strategy
- FORMATO IDEAL: System/User messages claros + instrucciones step-by-step + ejemplos específicos + validaciones
- TÉCNICAS AVANZADAS: Chain-of-thought, few-shot learning, role prompting, constraint specification

🧠 Claude 3 Opus (Anthropic) - CARACTERÍSTICAS AVANZADAS:
- Tokens: 200k (ideal para análisis extensos) | Enfoque: Seguridad y ética
- ESPECIALISTA EN: Comprensión contextual superior, análisis de documentos largos, tareas complejas multipasos, respuestas seguras y matizadas
- LIMITACIONES CRÍTICAS: Menos creativo que GPT, puede ser excesivamente conservador
- CASOS DE USO IDEALES: Análisis de documentos extensos, investigación ética, consultoría, revisión de contenido
- FORMATO IDEAL: XML tags estructurados + contexto narrativo + jerarquía clara + especificaciones de seguridad
- TÉCNICAS AVANZADAS: <thinking>, <analysis>, <conclusion>, contexto masivo, ethical prompting

🦙 Llama 3 (Meta) - CARACTERÍSTICAS AVANZADAS:
- Tokens: 8k (CRÍTICO: extremadamente limitado) | Enfoque: Eficiencia y personalización
- ESPECIALISTA EN: Razonamiento matemático, tareas específicas, personalización, costo-efectividad
- LIMITACIONES CRÍTICAS: Contexto muy pequeño, requiere instrucciones ultra-específicas, rendimiento variable
- CASOS DE USO IDEALES: Tareas específicas y directas, matemáticas, análisis puntuales, respuestas concisas
- FORMATO IDEAL: ### Instrucción: [ultra-específica] ### Contexto: [mínimo] ### Formato: [claro] ### Respuesta:
- TÉCNICAS AVANZADAS: Concisión extrema, instrucciones directas, eliminación de redundancias

💎 Gemini 1.5 Pro (Google) - CARACTERÍSTICAS AVANZADAS:
- Tokens: 1M (capacidad masiva) | Arquitectura: MoE | Multimodal: texto, imagen, audio, video, documentos
- ESPECIALISTA EN: Eficiencia extrema, análisis de datos masivos, respuestas rápidas, información actualizada
- LIMITACIONES CRÍTICAS: Puede ser superficial sin instrucciones de profundidad específicas
- CASOS DE USO IDEALES: Análisis de big data, research actualizado, procesamiento multimodal, eficiencia
- FORMATO IDEAL: Markdown estructurado + contexto masivo + instrucciones de profundidad + ejemplos múltiples
- TÉCNICAS AVANZADAS: Context utilization, multimodal prompting, depth instructions, structured markdown

🔬 DeepSeek - CARACTERÍSTICAS AVANZADAS:
- ESPECIALISTA EN: Razonamiento científico avanzado, análisis matemático preciso, precisión técnica extrema
- LIMITACIONES CRÍTICAS: Menos creativo, enfoque muy literal, dificultad con abstracciones
- CASOS DE USO IDEALES: Análisis científico, matemáticas, investigación técnica, validación de datos
- FORMATO IDEAL: Rol técnico + problema bien definido + metodología + datos concretos + validación numérica
- TÉCNICAS AVANZADAS: Scientific method, step-by-step analysis, numerical validation, technical precision
- Especialista en: Comprensión contextual, tareas complejas, seguridad
- Limitaciones: Menos creativo, API compleja
- Usos ideales: Análisis de documentos largos, servicio al cliente, escritura
- Formato ideal: XML tags (<rol>, <contexto>, <tarea>, <formato>)

ANÁLISIS ESPECIALIZADO POR ÁREA DE NEGOCIO:

📈 MARKETING Y VENTAS:
- Frameworks clave: AIDA, PAS, Before/After/Bridge, Problem/Solution
- Elementos críticos: CTAs específicos, buyer personas, pain points, value propositions
- Técnicas avanzadas: Persuasión ética, storytelling, emotional triggers, social proof

💻 PROGRAMACIÓN Y DESARROLLO:
- Elementos críticos: Sintaxis específica, best practices, testing approaches, error handling
- Técnicas avanzadas: Code review, debugging steps, optimization patterns, documentation

💰 FINANZAS Y CONTABILIDAD:
- Elementos críticos: Precisión numérica, compliance, risk management, regulatory considerations
- Técnicas avanzadas: Financial modeling, scenario analysis, audit trails, data validation

👥 RECURSOS HUMANOS:
- Elementos críticos: Sensibilidad cultural, legal compliance, comunicación empática, diversidad
- Técnicas avanzadas: Behavioral psychology, change management, conflict resolution

🎧 ATENCIÓN AL CLIENTE:
- Elementos críticos: Empatía, resolución de problemas, escalation paths, brand voice
- Técnicas avanzadas: Active listening, de-escalation, customer journey mapping

📚 EDUCACIÓN Y FORMACIÓN:
- Elementos críticos: Pedagogía clara, progresión lógica, assessment methods, learning styles
- Técnicas avanzadas: Bloom's taxonomy, scaffolding, differentiated instruction

🏥 SALUD Y MEDICINA:
- Elementos críticos: Precisión extrema, disclaimers éticos, evidence-based information
- Técnicas avanzadas: Clinical reasoning, differential diagnosis, risk stratification

🎨 CREATIVIDAD Y DISEÑO:
- Elementos críticos: Inspiración, flexibilidad, principios de diseño, user experience
- Técnicas avanzadas: Design thinking, ideation methods, aesthetic principles

INSTRUCCIONES AVANZADAS DE CREACIÓN:

1. ANALIZA la consulta original "${consulta}" en el contexto de ${especialidad}
2. APLICA las recomendaciones específicas del análisis estructural
3. INCORPORA técnicas avanzadas específicas del modelo ${modelo}
4. MAXIMIZA las fortalezas identificadas del modelo
5. MITIGA las limitaciones conocidas del modelo
6. INCLUYE elementos especializados de la industria ${especialidad}
7. OPTIMIZA para máxima efectividad y claridad
8. VALIDA que el prompt resultante sea completo y accionable

FORMATO DE RESPUESTA JSON COMPLETO:
{
  "prompt_optimizado": "El prompt completo, optimizado y listo para usar con ${modelo}",
  "explicacion_estructura": "Explicación detallada de por qué estructuraste el prompt de esta manera específica",
  "elementos_incluidos": ["Elementos clave incorporados en el prompt"],
  "tecnicas_aplicadas": ["Técnicas específicas aplicadas para ${modelo}"],
  "aprovecha_fortalezas": ["Fortalezas específicas del modelo aprovechadas"],
  "mitiga_limitaciones": ["Limitaciones del modelo mitigadas"],
  "optimizaciones_especialidad": ["Optimizaciones específicas para ${especialidad}"],
  "tokens_estimados": "Estimación precisa de tokens del prompt creado",
  "nivel_calidad": "Predicción de calidad del prompt (1-10)",
  "mejoras_sugeridas": ["Posibles mejoras futuras del prompt"],
  "casos_uso": ["Casos de uso específicos donde este prompt será más efectivo"]
}

Responde ÚNICAMENTE en formato JSON válido, sin markdown ni backticks.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Eres un experto en crear prompts optimizados con conocimiento específico de GPT-4, Claude 3 Opus, Llama 3 y Gemini 1.5 Pro. Conoces sus fortalezas, limitaciones, ventanas de contexto y mejores prácticas. Respondes siempre en formato JSON válido."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
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
      console.error('Error en Agente Prompteador:', error);
      console.error('Respuesta recibida:', response?.choices?.[0]?.message?.content);
      throw new Error(`Agente 2 falló: ${error.message}`);
    }
  }
};