// src/components/forms/PromptForm.jsx
import { useState } from 'react';
import { selectorModelo } from '../../services/selectorModelo';

export default function PromptForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    areaNegocio: '',
    objetivo: '',
    reto: ''
  });

  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [modeloManual, setModeloManual] = useState(''); // Para selección manual

  const areasNegocio = [
    { id: 'marketing', nombre: 'Marketing y Ventas', icon: '📈' },
    { id: 'programacion', nombre: 'Programación y Desarrollo', icon: '💻' },
    { id: 'finanzas', nombre: 'Finanzas y Contabilidad', icon: '💰' },
    { id: 'recursos-humanos', nombre: 'Recursos Humanos', icon: '👥' },
    { id: 'atencion-cliente', nombre: 'Atención al Cliente', icon: '🎧' },
    { id: 'educacion', nombre: 'Educación y Formación', icon: '📚' },
    { id: 'salud', nombre: 'Salud y Medicina', icon: '🏥' },
    { id: 'creatividad', nombre: 'Creatividad y Diseño', icon: '🎨' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.areaNegocio && formData.objetivo) {
      // Selección automática del modelo basada en el contexto
      const seleccion = selectorModelo.analizarYSeleccionar(
        formData.areaNegocio, 
        formData.objetivo, 
        formData.reto
      );
      
      setModeloSeleccionado(seleccion);
      
      // Usar modelo manual si está seleccionado, sino usar la recomendación automática
      const modeloFinal = modeloManual || seleccion.modelo;
      
      // Convertir los datos al formato esperado por el backend
      const datosFormateados = {
        especialidad: formData.areaNegocio,
        modelo: modeloFinal,
        consulta: `OBJETIVO: ${formData.objetivo}${formData.reto ? `\n\nRETO ESPECÍFICO: ${formData.reto}` : ''}`,
        modeloInfo: modeloManual ? { modelo: modeloManual, razon: 'Seleccionado manualmente por el usuario' } : seleccion
      };
      onSubmit(datosFormateados);
    }
  };

  const isValid = formData.areaNegocio && formData.objetivo;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header del formulario */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          🚀 Optimizador de Prompts para tu Negocio
        </h2>
        <p className="text-emerald-100 text-sm">
          Responde 3 preguntas y obtén el prompt perfecto para tu objetivo empresarial
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Pregunta 1: Área Principal del Negocio */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <label className="text-lg font-bold text-gray-900">
              Área Principal de tu Negocio
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {areasNegocio.map((area) => (
              <button
                key={area.id}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, areaNegocio: area.id }))}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md flex items-center gap-3 ${
                  formData.areaNegocio === area.id
                    ? 'border-emerald-500 bg-emerald-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{area.icon}</span>
                <span className="font-medium text-gray-900">{area.nombre}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pregunta 2: Objetivo o Tema Principal */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <label className="text-lg font-bold text-gray-900">
              Describe tu Objetivo o Tema Principal
            </label>
          </div>
          <div className="relative">
            <textarea
              value={formData.objetivo}
              onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
              placeholder="Ejemplo: Crear una estrategia de marketing digital para lanzar un nuevo producto"
              className="w-full h-24 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-emerald-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.objetivo.length} caracteres
            </div>
          </div>
        </div>

        {/* Pregunta 3: Reto Específico (Opcional) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <label className="text-lg font-bold text-gray-900">
              Menciona un Reto Específico 
              <span className="text-sm font-normal text-gray-500 ml-2">(Opcional)</span>
            </label>
          </div>
          <div className="relative">
            <textarea
              value={formData.reto}
              onChange={(e) => setFormData(prev => ({ ...prev, reto: e.target.value }))}
              placeholder="Ejemplo: El producto es innovador pero el mercado es escéptico"
              className="w-full h-20 p-4 border-2 border-gray-200 rounded-xl resize-none focus:border-emerald-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.reto.length} caracteres
            </div>
          </div>
        </div>

        {/* Vista previa del modelo seleccionado automáticamente */}
        {formData.areaNegocio && formData.objetivo && (
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                🤖
              </div>
              <h3 className="font-bold text-purple-800">Modelo IA Recomendado Automáticamente</h3>
            </div>
            {(() => {
              const seleccion = selectorModelo.analizarYSeleccionar(
                formData.areaNegocio, 
                formData.objetivo, 
                formData.reto
              );
              const modelos = {
                'gpt-4': { name: 'GPT-4', description: 'Razonamiento lógico y instrucciones paso a paso' },
                'claude-3-opus': { name: 'Claude 3 Opus', description: 'Creatividad y comunicación persuasiva' },
                'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', description: 'Datos actuales y respuestas concisas' },
                'deepseek': { name: 'DeepSeek', description: 'Análisis técnico y científico' }
              };
              const modeloInfo = modelos[seleccion.modelo];
              
              return (
                <div className="bg-white rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{modeloInfo.name}</span>
                    <span className="text-xs bg-purple-100 px-2 py-1 rounded-full text-purple-700">
                      {modeloManual === seleccion.modelo ? 'También tu elección' : 'Recomendado'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{modeloInfo.description}</p>
                  <p className="text-xs text-purple-600">
                    <strong>Razón:</strong> {seleccion.razon}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Selección manual del modelo */}
        {formData.areaNegocio && formData.objetivo && (
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                ⚙️
              </div>
              <h3 className="font-bold text-blue-800">¿Prefieres otro modelo? (Opcional)</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'gpt-4', name: 'GPT-4', desc: 'Razonamiento lógico', icon: '🧠' },
                { id: 'claude-3-opus', name: 'Claude 3 Opus', desc: 'Creatividad avanzada', icon: '🎨' },
                { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', desc: 'Datos actuales', icon: '🔍' },
                { id: 'deepseek', name: 'DeepSeek', desc: 'Análisis técnico', icon: '⚡' }
              ].map((modelo) => (
                <button
                  key={modelo.id}
                  type="button"
                  onClick={() => setModeloManual(modeloManual === modelo.id ? '' : modelo.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    modeloManual === modelo.id
                      ? 'border-blue-500 bg-blue-100 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{modelo.icon}</span>
                    <span className="font-bold text-sm text-gray-900">{modelo.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{modelo.desc}</p>
                  {modeloManual === modelo.id && (
                    <div className="mt-2 text-xs text-blue-600 font-medium">✓ Seleccionado</div>
                  )}
                </button>
              ))}
            </div>
            
            {modeloManual && (
              <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tu elección:</strong> Usarás {
                    ({ 'gpt-4': 'GPT-4', 'claude-3-opus': 'Claude 3 Opus', 'gemini-1.5-pro': 'Gemini 1.5 Pro', 'deepseek': 'DeepSeek' })[modeloManual]
                  } en lugar de la recomendación automática.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Botón de envío */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={!isValid}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-200 ${
              isValid
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {isValid 
              ? '🚀 Generar Prompt Optimizado con IA Inteligente' 
              : '📝 Completa los campos requeridos'
            }
          </button>
        </div>

        {/* Información adicional */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
            <span>🤖</span> Proceso de Optimización con 4 Agentes IA
          </h3>
          <div className="grid grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs">1</div>
              <div className="font-medium text-emerald-800">Análisis</div>
              <div className="text-emerald-600">Estructuración</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs">2</div>
              <div className="font-medium text-emerald-800">Creación</div>
              <div className="text-emerald-600">Prompt base</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-500 text-white rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs">3</div>
              <div className="font-medium text-emerald-800">Revisión</div>
              <div className="text-emerald-600">Recomendaciones</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-emerald-600 text-white rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-xs">4</div>
              <div className="font-medium text-emerald-800">Implementa</div>
              <div className="text-emerald-600">Versión final</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
