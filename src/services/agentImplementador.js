import openaiClient from './openaiClient.js';

/**
 * Agente 4: Implementador
 * Toma el prompt del Agente 2 y las recomendaciones del Agente 3
 * para crear la versión final mejorada del prompt
 */
class AgentImplementador {
  constructor() {
    this.nombre = "Agente Implementador";
    this.especialidad = "Implementación de mejoras y optimización final de prompts";
  }

  async implementarMejoras(promptBase, recomendaciones, especialidad, modeloSeleccionado) {
    const promptSistema = this.construirPromptSistema(especialidad, modeloSeleccionado);
    const promptUsuario = this.construirPromptUsuario(promptBase, recomendaciones);

    try {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: promptSistema },
          { role: "user", content: promptUsuario }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      const contenido = response.choices[0].message.content;
      return this.procesarRespuesta(contenido);
    } catch (error) {
      console.error('Error en Agente Implementador:', error);
      throw new Error(`Error del Agente Implementador: ${error.message}`);
    }
  }

  construirPromptSistema(especialidad, modelo) {
    const conocimientoModelos = {
      'gpt-4': {
        fortalezas: ['razonamiento lógico', 'instrucciones paso a paso', 'análisis complejo', 'estructuración clara'],
        optimizaciones: ['usar numeración clara', 'dividir en pasos lógicos', 'proporcionar contexto detallado', 'especificar formato de salida'],
        estilo: 'estructurado y metodológico'
      },
      'claude-3-opus': {
        fortalezas: ['creatividad', 'comunicación persuasiva', 'narrativa', 'análisis ético'],
        optimizaciones: ['usar lenguaje narrativo', 'incluir ejemplos creativos', 'fomentar exploración', 'considerar múltiples perspectivas'],
        estilo: 'creativo y conversacional'
      },
      'gemini-1.5-pro': {
        fortalezas: ['información actual', 'respuestas concisas', 'multimodalidad', 'eficiencia'],
        optimizaciones: ['ser específico y directo', 'usar bullets y listas', 'solicitar información actualizada', 'optimizar para velocidad'],
        estilo: 'directo y eficiente'
      },
      'deepseek': {
        fortalezas: ['análisis técnico', 'programación', 'matemáticas', 'investigación científica'],
        optimizaciones: ['incluir especificaciones técnicas', 'usar terminología precisa', 'proporcionar datos cuantitativos', 'estructurar lógicamente'],
        estilo: 'técnico y preciso'
      }
    };

    const modeloInfo = conocimientoModelos[modelo] || conocimientoModelos['gpt-4'];

    return `Eres el AGENTE IMPLEMENTADOR, especialista en crear la versión final y optimizada de prompts.

Tu MISIÓN es tomar un prompt base y las recomendaciones de mejora para crear la versión FINAL y MEJORADA.

ESPECIALIDAD DEL PROYECTO: ${especialidad}
MODELO DE IA SELECCIONADO: ${modelo}

CARACTERÍSTICAS DEL MODELO ${modelo.toUpperCase()}:
- Fortalezas: ${modeloInfo.fortalezas.join(', ')}
- Optimizaciones clave: ${modeloInfo.optimizaciones.join(', ')}
- Estilo preferido: ${modeloInfo.estilo}

PROCESO DE IMPLEMENTACIÓN:
1. Analizar el prompt base y identificar sus elementos clave
2. Evaluar cada recomendación de mejora
3. Implementar las mejoras de forma coherente
4. Optimizar específicamente para el modelo ${modelo}
5. Asegurar claridad, precisión y efectividad

CRITERIOS DE CALIDAD:
- Claridad: El prompt debe ser fácil de entender
- Precisión: Instrucciones específicas y sin ambigüedad
- Completitud: Incluir todo el contexto necesario
- Optimización: Adaptado al modelo ${modelo}
- Efectividad: Diseñado para obtener los mejores resultados

FORMATO DE RESPUESTA (JSON):
{
  "promptFinal": "El prompt mejorado y optimizado listo para usar",
  "mejoras_implementadas": [
    "Lista de mejoras específicas que implementaste"
  ],
  "optimizaciones_modelo": [
    "Optimizaciones específicas para ${modelo}"
  ],
  "explicacion_cambios": "Explicación clara de por qué estos cambios mejoran el prompt",
  "consejos_uso": [
    "Consejos para usar este prompt de manera efectiva"
  ]
}

IMPORTANTE: El prompt final debe ser SIGNIFICATIVAMENTE mejor que el original, incorporando todas las mejoras relevantes y optimizado específicamente para ${modelo}.`;
  }

  construirPromptUsuario(promptBase, recomendaciones) {
    return `PROMPT BASE A MEJORAR:
${promptBase}

RECOMENDACIONES DE MEJORA:
${Array.isArray(recomendaciones) ? recomendaciones.join('\n') : recomendaciones}

Tu tarea es crear la versión FINAL y OPTIMIZADA de este prompt, implementando todas las mejoras relevantes y asegurando la máxima efectividad.

ANALIZA:
1. ¿Qué elementos del prompt base funcionan bien?
2. ¿Cuáles recomendaciones son más importantes?
3. ¿Cómo puedes optimizar para el modelo seleccionado?
4. ¿Qué elementos nuevos debes agregar?

IMPLEMENTA las mejoras de forma inteligente y coherente.`;
  }

  procesarRespuesta(contenido) {
    try {
      // Intentar extraer JSON del contenido
      const jsonMatch = contenido.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No se encontró JSON válido en la respuesta");
      }

      const resultado = JSON.parse(jsonMatch[0]);
      
      // Validar estructura
      if (!resultado.promptFinal) {
        throw new Error("Respuesta inválida: falta promptFinal");
      }

      return {
        success: true,
        promptFinal: resultado.promptFinal,
        mejorasImplementadas: resultado.mejoras_implementadas || [],
        optimizacionesModelo: resultado.optimizaciones_modelo || [],
        explicacionCambios: resultado.explicacion_cambios || '',
        consejosUso: resultado.consejos_uso || [],
        agente: this.nombre
      };
    } catch (error) {
      console.error('Error procesando respuesta:', error);
      // Respuesta de fallback
      return {
        success: false,
        error: `Error procesando respuesta del ${this.nombre}: ${error.message}`,
        promptFinal: contenido, // Usar el contenido completo como fallback
        mejorasImplementadas: ['Error en el procesamiento - se proporciona respuesta completa'],
        explicacionCambios: 'Hubo un error procesando la respuesta estructurada',
        agente: this.nombre
      };
    }
  }
}

export default new AgentImplementador();
