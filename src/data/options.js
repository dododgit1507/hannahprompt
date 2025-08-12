// src/data/options.js
export const especialidades = [
  { id: 'marketing', name: 'Marketing Digital', icon: '📊' },
  { id: 'programacion', name: 'Programación', icon: '💻' },
  { id: 'educacion', name: 'Educación', icon: '📚' },
  { id: 'medicina', name: 'Medicina', icon: '🏥' },
  { id: 'finanzas', name: 'Finanzas', icon: '💰' },
  { id: 'creatividad', name: 'Creatividad', icon: '🎨' },
];

export const modelos = [
  { 
    id: 'openai', 
    name: 'GPT-4', 
    provider: 'OpenAI',
    descripcion: '128k tokens • Multimodal • Razonamiento lógico',
    fortalezas: 'Coherencia, programación, análisis avanzado',
    limitaciones: 'Costoso, lento, puede alucinar'
  },
  { 
    id: 'claude', 
    name: 'Claude 3 Opus', 
    provider: 'Anthropic',
    descripcion: '200k tokens • Análisis extensos • Seguridad',
    fortalezas: 'Comprensión contextual, tareas complejas, seguro',
    limitaciones: 'Menos creativo, API compleja'
  },
  { 
    id: 'llama', 
    name: 'Llama 3', 
    provider: 'Meta',
    descripcion: '8k tokens • Código abierto • Personalizable',
    fortalezas: 'Open source, personalizable, gratuito',
    limitaciones: 'Contexto limitado, rendimiento variable'
  },
  { 
    id: 'gemini', 
    name: 'Gemini 1.5 Pro', 
    provider: 'Google',
    descripcion: '1M tokens • Ultra eficiente • Multimodal masivo',
    fortalezas: 'Contexto masivo, velocidad, eficiencia MoE',
    limitaciones: 'Modelo nuevo, integración compleja'
  },
];