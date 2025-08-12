// src/services/selectorModelo.js

export const selectorModelo = {
  analizarYSeleccionar: (areaNegocio, objetivo, reto) => {
    const contexto = `${objetivo} ${reto}`.toLowerCase();
    
    // Análisis del contenido para determinar el mejor modelo
    const palabrasClave = {
      // ChatGPT/GPT-4o - Mejor para instrucciones paso a paso y razonamiento lógico
      gpt4: [
        'estrategia', 'plan', 'pasos', 'proceso', 'metodología', 'estructura',
        'análisis lógico', 'razonamiento', 'secuencial', 'sistemático',
        'instrucciones', 'guía', 'tutorial', 'desarrollo', 'implementación'
      ],
      
      // Claude - Mejor para creatividad, textos largos y contexto narrativo
      claude: [
        'creativo', 'narrativa', 'storytelling', 'persuasivo', 'emocional',
        'contenido largo', 'artículo', 'ensayo', 'historia', 'campaña creativa',
        'branding', 'comunicación', 'mensaje', 'tono', 'estilo'
      ],
      
      // Gemini - Mejor para datos frescos, búsquedas y respuestas concisas
      gemini: [
        'actualidad', 'datos actuales', 'investigación', 'mercado actual',
        'tendencias', 'noticias', 'información reciente', 'competencia',
        'benchmark', 'comparación', 'rápido', 'directo', 'conciso'
      ],
      
      // DeepSeek - Mejor para análisis matemático/científico y razonamiento técnico
      deepseek: [
        'cálculo', 'análisis matemático', 'estadística', 'datos numéricos',
        'científico', 'técnico', 'algoritmo', 'modelo matemático',
        'optimización', 'eficiencia', 'métricas', 'roi', 'conversión'
      ]
    };

    // Análisis por área de negocio
    const preferenciasArea = {
      'marketing': {
        principal: 'claude', // Creatividad y persuasión
        alternativo: 'gpt4'
      },
      'programacion': {
        principal: 'deepseek', // Análisis técnico
        alternativo: 'gpt4'
      },
      'finanzas': {
        principal: 'deepseek', // Análisis numérico
        alternativo: 'gpt4'
      },
      'recursos-humanos': {
        principal: 'claude', // Comunicación y contexto humano
        alternativo: 'gpt4'
      },
      'atencion-cliente': {
        principal: 'claude', // Tono y comunicación
        alternativo: 'gpt4'
      },
      'educacion': {
        principal: 'gpt4', // Instrucciones paso a paso
        alternativo: 'claude'
      },
      'salud': {
        principal: 'deepseek', // Precisión científica
        alternativo: 'gpt4'
      },
      'creatividad': {
        principal: 'claude', // Creatividad natural
        alternativo: 'gpt4'
      }
    };

    // Calcular puntuaciones por modelo
    const puntuaciones = {
      'gpt-4': 0,
      'claude-3-opus': 0,
      'gemini-1.5-pro': 0,
      'deepseek': 0
    };

    // Análisis de palabras clave
    Object.entries(palabrasClave).forEach(([modelo, palabras]) => {
      const modeloKey = modelo === 'gpt4' ? 'gpt-4' : 
                       modelo === 'claude' ? 'claude-3-opus' :
                       modelo === 'gemini' ? 'gemini-1.5-pro' : 'deepseek';
      
      palabras.forEach(palabra => {
        if (contexto.includes(palabra)) {
          puntuaciones[modeloKey] += 1;
        }
      });
    });

    // Bonificación por área de negocio
    const preferenciaArea = preferenciasArea[areaNegocio];
    if (preferenciaArea) {
      const modeloPrincipal = preferenciaArea.principal === 'gpt4' ? 'gpt-4' :
                             preferenciaArea.principal === 'claude' ? 'claude-3-opus' :
                             preferenciaArea.principal === 'gemini' ? 'gemini-1.5-pro' : 'deepseek';
      
      const modeloAlternativo = preferenciaArea.alternativo === 'gpt4' ? 'gpt-4' :
                               preferenciaArea.alternativo === 'claude' ? 'claude-3-opus' :
                               preferenciaArea.alternativo === 'gemini' ? 'gemini-1.5-pro' : 'deepseek';
      
      puntuaciones[modeloPrincipal] += 3;
      puntuaciones[modeloAlternativo] += 1;
    }

    // Encontrar el modelo con mayor puntuación
    const modeloSeleccionado = Object.entries(puntuaciones)
      .sort(([,a], [,b]) => b - a)[0][0];

    // Razón de la selección
    const razones = {
      'gpt-4': 'Excelente para instrucciones paso a paso y razonamiento lógico estructurado',
      'claude-3-opus': 'Ideal para creatividad, narrativa y comunicación persuasiva', 
      'gemini-1.5-pro': 'Perfecto para datos actuales, búsquedas rápidas y respuestas concisas',
      'deepseek': 'Especializado en análisis técnico, matemático y razonamiento científico'
    };

    return {
      modelo: modeloSeleccionado,
      razon: razones[modeloSeleccionado],
      puntuaciones,
      analisisContexto: {
        areaNegocio,
        palabrasClave: Object.entries(palabrasClave)
          .flatMap(([modelo, palabras]) => 
            palabras.filter(palabra => contexto.includes(palabra))
              .map(palabra => ({ modelo, palabra }))
          )
      }
    };
  }
};
