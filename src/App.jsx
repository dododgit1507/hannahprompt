import { useState } from 'react';
import PromptForm from './components/forms/PromptForm';
import { orquestadorAgentesIA } from './services/orquestadorAgentes';
import { traductorPrompts } from './services/traductor';

function App() {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [procesoActual, setProcesoActual] = useState('');
  const [progreso, setProgreso] = useState([]);
  const [vistaActual, setVistaActual] = useState('formulario'); // 'formulario', 'procesando', 'resultados'

  const handleFormSubmit = async (formData) => {
    setLoading(true);
    setResultado(null);
    setProgreso([]);
    setVistaActual('procesando');
    setProcesoActual('Iniciando procesamiento con IA...');
    
    try {
      // Procesar con agentes IA reales
      const resultado = await orquestadorAgentesIA.procesarSolicitud(
        formData.especialidad,
        formData.modelo, 
        formData.consulta,
        (progresoInfo) => {
          setProcesoActual(progresoInfo.mensaje);
          setProgreso(prev => [...prev, progresoInfo]);
        },
        formData.modeloInfo // Pasar información del modelo seleccionado
      );

      setResultado(resultado);
      setVistaActual('resultados');
    } catch (error) {
      console.error('Error:', error);
      setResultado({
        exito: false,
        error: 'Error al procesar la solicitud con IA',
        detalleError: error.message
      });
      setVistaActual('resultados');
    } finally {
      setLoading(false);
      setProcesoActual('');
    }
  };

  const volverAlFormulario = () => {
    setVistaActual('formulario');
    setResultado(null);
    setProgreso([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            🚀 HannahPrompts
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Crea prompts perfectos con nuestro sistema de 3 agentes especializados que trabajan en secuencia para optimizar tu consulta
          </p>
        </div>

        {vistaActual === 'formulario' && (
          // Vista del formulario en pantalla completa
          <div className="max-w-4xl mx-auto">
            <PromptForm onSubmit={handleFormSubmit} />
          </div>
        )}

        {vistaActual === 'procesando' && (
          // Vista de procesamiento en pantalla completa
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Procesando con IA...</h2>
              <button
                onClick={volverAlFormulario}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Volver al formulario
              </button>
            </div>
            <ProgresoEnTiempoReal procesoActual={procesoActual} progreso={progreso} />
          </div>
        )}

        {vistaActual === 'resultados' && (
          // Vista de resultados en pantalla completa
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Resultados del Optimizador de Prompts</h2>
              <button
                onClick={volverAlFormulario}
                className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                ← Crear nuevo prompt
              </button>
            </div>
            {resultado && <ResultadoCompleto resultado={resultado} />}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para mostrar progreso en tiempo real
function ProgresoEnTiempoReal({ procesoActual, progreso }) {
  return (
    <div className="space-y-6">
      {/* Estado actual */}
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-6 w-6 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <span className="ml-4 font-semibold text-lg text-gray-800">Procesando con IA...</span>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
            <span className="text-sm text-blue-800 font-medium">
              {procesoActual}
            </span>
          </div>
        </div>
      </div>

      {/* Progreso de cada agente */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h3 className="font-bold text-gray-800 flex items-center">
            <span className="mr-2">🤖</span>
            Progreso de Agentes IA
          </h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {progreso.map((paso, index) => (
            <ProgresoAgente key={index} paso={paso} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para cada paso del progreso
function ProgresoAgente({ paso }) {
  const getIcono = (fase) => {
    switch(fase) {
      case 'agente1': return '🔧';
      case 'agente2': return '✍️';
      case 'agente3': return '🔍';
      case 'agente4': return '🚀';
      case 'final': return '🎉';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  const getColor = (estado) => {
    switch(estado) {
      case 'procesando': return 'border-l-blue-500 bg-gradient-to-r from-blue-50 to-white';
      case 'completado': return 'border-l-green-500 bg-gradient-to-r from-green-50 to-white';
      case 'error': return 'border-l-red-500 bg-gradient-to-r from-red-50 to-white';
      case 'finalizado': return 'border-l-purple-500 bg-gradient-to-r from-purple-50 to-white';
      default: return 'border-l-gray-500 bg-gradient-to-r from-gray-50 to-white';
    }
  };

  const getEstadoIcon = (estado) => {
    switch(estado) {
      case 'procesando': return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-300 border-t-blue-600"></div>;
      case 'completado': return <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✓</span></div>;
      case 'error': return <div className="h-4 w-4 bg-red-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">✕</span></div>;
      default: return <div className="h-4 w-4 bg-gray-300 rounded-full"></div>;
    }
  };

  return (
    <div className={`p-6 border-l-4 ${getColor(paso.estado)} border-b border-gray-100 last:border-b-0`}>
      <div className="flex items-start space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getIcono(paso.fase)}</span>
          {getEstadoIcon(paso.estado)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-800 mb-1">{paso.mensaje}</p>
          
          {paso.respuesta && paso.estado === 'completado' && (
            <div className="mt-4 bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
              {paso.fase === 'agente1' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                    <span className="mr-2">🔧</span>
                    Análisis de Estructura
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-semibold text-blue-900 mb-2">Estructura Recomendada:</p>
                      <p className="text-sm text-blue-800 leading-relaxed">{paso.respuesta.estructura_recomendada}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-semibold text-blue-900 mb-2">Complejidad:</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        paso.respuesta.complejidad === 'alta' ? 'bg-red-100 text-red-800 border border-red-200' :
                        paso.respuesta.complejidad === 'media' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-green-100 text-green-800 border border-green-200'
                      }`}>
                        {paso.respuesta.complejidad?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {paso.respuesta.elementos_clave && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-semibold text-blue-900 mb-2">Elementos Clave:</p>
                      <div className="flex flex-wrap gap-2">
                        {paso.respuesta.elementos_clave.map((elemento, idx) => (
                          <span key={idx} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-300">
                            {elemento}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {paso.respuesta.fortalezas_modelo && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-semibold text-blue-900 mb-2">Fortalezas del Modelo:</p>
                      <div className="flex flex-wrap gap-2">
                        {paso.respuesta.fortalezas_modelo.map((fortaleza, idx) => (
                          <span key={idx} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-300">
                            {fortaleza}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {paso.respuesta.analisis && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <p className="font-semibold text-blue-900 mb-2">Análisis:</p>
                      <p className="text-sm text-blue-800 leading-relaxed">{paso.respuesta.analisis}</p>
                    </div>
                  )}
                </div>
              )}
              {paso.fase === 'agente2' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    <span className="mr-2">✍️</span>
                    Creación del Prompt
                  </h4>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="font-semibold text-green-900 mb-2">Técnicas Aplicadas:</p>
                    <div className="flex flex-wrap gap-2">
                      {paso.respuesta.tecnicas_aplicadas?.map((tecnica, idx) => (
                        <span key={idx} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium border border-green-300">
                          {tecnica}
                        </span>
                      ))}
                    </div>
                  </div>
                  {paso.respuesta.aprovecha_fortalezas && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="font-semibold text-green-900 mb-2">Aprovecha Fortalezas:</p>
                      <div className="flex flex-wrap gap-2">
                        {paso.respuesta.aprovecha_fortalezas.map((fortaleza, idx) => (
                          <span key={idx} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-300">
                            {fortaleza}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {paso.respuesta.explicacion && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <p className="font-semibold text-green-900 mb-2">Explicación:</p>
                      <p className="text-sm text-green-800 leading-relaxed">{paso.respuesta.explicacion}</p>
                    </div>
                  )}
                  <details className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <summary className="cursor-pointer font-semibold text-green-900 hover:text-green-700 flex items-center">
                      <span className="mr-2">📝</span>
                      Ver Prompt Creado
                    </summary>
                    <div className="mt-4 bg-white p-4 rounded-lg border border-green-200">
                      <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
                        {paso.respuesta.prompt_optimizado}
                      </div>
                    </div>
                  </details>
                </div>
              )}
              {paso.fase === 'agente3' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-purple-800 mb-3 flex items-center">
                    <span className="mr-2">🔍</span>
                    Revisión y Optimización
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">Puntuación Total:</p>
                      <span className={`text-3xl font-bold ${
                        paso.respuesta.puntuacion_total >= 8 ? 'text-green-600' :
                        paso.respuesta.puntuacion_total >= 6 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {paso.respuesta.puntuacion_total}/10
                      </span>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">Mejoras Aplicadas:</p>
                      <p className="text-sm text-purple-800">{paso.respuesta.mejoras_aplicadas?.length || 0} mejoras</p>
                    </div>
                  </div>
                  
                  {/* Prompt Final Mejorado */}
                  {paso.respuesta.prompt_mejorado && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <details className="cursor-pointer">
                        <summary className="font-semibold text-purple-900 hover:text-purple-700 mb-3 flex items-center">
                          <span className="mr-2">🎯</span>
                          Ver Prompt Final Optimizado
                        </summary>
                        <div className="mt-4 bg-white p-4 rounded-lg border border-purple-200">
                          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
                            {paso.respuesta.prompt_mejorado}
                          </div>
                        </div>
                      </details>
                    </div>
                  )}
                  
                  {paso.respuesta.optimizaciones_modelo && paso.respuesta.optimizaciones_modelo.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">Optimizaciones Específicas del Modelo:</p>
                      <ul className="text-sm text-purple-800 space-y-1">
                        {paso.respuesta.optimizaciones_modelo.map((opt, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-600 mr-2">🎯</span>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {paso.respuesta.mejoras_aplicadas && paso.respuesta.mejoras_aplicadas.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">Mejoras Realizadas:</p>
                      <ul className="text-sm text-purple-800 space-y-1">
                        {paso.respuesta.mejoras_aplicadas.map((mejora, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {mejora}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {paso.respuesta.recomendaciones && paso.respuesta.recomendaciones.length > 0 && (
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <p className="font-semibold text-purple-900 mb-2">Recomendaciones:</p>
                      <ul className="text-sm text-purple-800 space-y-1">
                        {paso.respuesta.recomendaciones.map((rec, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-600 mr-2">💡</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {paso.fase === 'agente4' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-indigo-800 mb-3 flex items-center">
                    <span className="mr-2">🚀</span>
                    Implementación Final
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="font-semibold text-indigo-900 mb-2">Mejoras Implementadas:</p>
                      <span className="text-2xl font-bold text-indigo-600">
                        {paso.respuesta.mejorasImplementadas?.length || 0}
                      </span>
                    </div>
                    
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="font-semibold text-indigo-900 mb-2">Optimizaciones:</p>
                      <span className="text-2xl font-bold text-indigo-600">
                        {paso.respuesta.optimizacionesModelo?.length || 0}
                      </span>
                    </div>
                  </div>
                  
                  {/* Lista de mejoras implementadas */}
                  {paso.respuesta.mejorasImplementadas && paso.respuesta.mejorasImplementadas.length > 0 && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="font-semibold text-indigo-900 mb-2">Mejoras Implementadas:</p>
                      <ul className="text-sm text-indigo-800 space-y-1">
                        {paso.respuesta.mejorasImplementadas.map((mejora, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-indigo-600 mr-2">✅</span>
                            {mejora}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Optimizaciones específicas del modelo */}
                  {paso.respuesta.optimizacionesModelo && paso.respuesta.optimizacionesModelo.length > 0 && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="font-semibold text-indigo-900 mb-2">Optimizaciones para el Modelo:</p>
                      <ul className="text-sm text-indigo-800 space-y-1">
                        {paso.respuesta.optimizacionesModelo.map((opt, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-indigo-600 mr-2">⚙️</span>
                            {opt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Explicación de cambios */}
                  {paso.respuesta.explicacionCambios && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <p className="font-semibold text-indigo-900 mb-2">Explicación de Cambios:</p>
                      <p className="text-sm text-indigo-800">{paso.respuesta.explicacionCambios}</p>
                    </div>
                  )}
                  
                  {/* Prompt Final Implementado */}
                  {paso.respuesta.promptFinal && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                      <details className="cursor-pointer">
                        <summary className="font-semibold text-indigo-900 hover:text-indigo-700 mb-3 flex items-center">
                          <span className="mr-2">🎯</span>
                          Ver Prompt Final Implementado
                        </summary>
                        <div className="mt-4 bg-white p-4 rounded-lg border border-indigo-200">
                          <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-mono">
                            {paso.respuesta.promptFinal}
                          </div>
                        </div>
                      </details>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente para mostrar el resultado completo
function ResultadoCompleto({ resultado }) {
  const [tabActiva, setTabActiva] = useState('final');

  if (!resultado.exito) {
    return (
      <div className="bg-red-50 border-2 border-red-200 p-8 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-red-800 font-bold text-xl mb-3">Error en el Procesamiento</h3>
          <p className="text-red-700 mb-3">{resultado.error}</p>
          {resultado.detalleError && (
            <p className="text-red-600 text-sm bg-red-100 p-3 rounded-lg">{resultado.detalleError}</p>
          )}
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'final', label: '🎯 Resultado Final', icon: '🎯' },
    { id: 'agentes', label: '🤖 Proceso de Agentes', icon: '🤖' },
    { id: 'analisis', label: '📊 Análisis Detallado', icon: '📊' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActiva(tab.id)}
              className={`px-8 py-4 text-sm font-semibold transition-all duration-200 flex items-center space-x-2 ${
                tabActiva === tab.id
                  ? 'bg-white text-blue-700 border-b-2 border-blue-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-8">
        {tabActiva === 'final' && (
          <TabResultadoFinal resultado={resultado} />
        )}
        {tabActiva === 'agentes' && (
          <TabProcesoAgentes resultado={resultado} />
        )}
        {tabActiva === 'analisis' && (
          <TabAnalisisDetallado resultado={resultado} />
        )}
      </div>
    </div>
  );
}

// Componente para el tab de resultado final
function TabResultadoFinal({ resultado }) {
  const [promptTraducido, setPromptTraducido] = useState(null);
  const [traduciendoPrompt, setTraduciendoPrompt] = useState(false);
  const [estadisticasTokens, setEstadisticasTokens] = useState(null);
  const [vistaActiva, setVistaActiva] = useState('español'); // 'español' o 'ingles'

  const copyToClipboard = async (texto) => {
    try {
      await navigator.clipboard.writeText(texto);
      // Aquí podrías agregar una notificación
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const traducirPrompt = async () => {
    const promptFinal = resultado.agente4?.resultado?.promptFinal || resultado.agente3?.resultado?.prompt_mejorado || resultado.promptFinal;
    setTraduciendoPrompt(true);
    
    try {
      const traduccion = await traductorPrompts.traducirAlIngles(promptFinal);
      setPromptTraducido(traduccion);
      
      // Calcular estadísticas de tokens
      const stats = traductorPrompts.estimarTokensAhorrados(promptFinal, traduccion);
      setEstadisticasTokens(stats);
      
      setVistaActiva('ingles');
    } catch (error) {
      console.error('Error al traducir:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      setTraduciendoPrompt(false);
    }
  };

  // Información del modelo seleccionado
  const modeloInfo = resultado.modeloSeleccionado;
  const modelos = {
    'gpt-4': { name: '🤖 GPT-4', color: 'from-green-400 to-green-600', description: 'Razonamiento lógico avanzado' },
    'claude-3-opus': { name: '🧠 Claude 3 Opus', color: 'from-purple-400 to-purple-600', description: 'Comprensión contextual superior' },
    'gemini-1.5-pro': { name: '💎 Gemini 1.5 Pro', color: 'from-blue-400 to-blue-600', description: 'Procesamiento masivo y eficiencia' },
    'deepseek': { name: '🔬 DeepSeek', color: 'from-orange-400 to-orange-600', description: 'Análisis científico y precisión técnica' }
  };
  const modeloDetalle = modelos[modeloInfo?.modelo] || { name: modeloInfo?.modelo, color: 'from-gray-400 to-gray-600', description: 'Modelo especializado' };

  return (
    <div className="space-y-6">
      {/* Información del Modelo Seleccionado */}
      {modeloInfo && (
        <div className={`bg-gradient-to-r ${modeloDetalle.color} p-6 rounded-lg text-white shadow-lg`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold mb-2">{modeloDetalle.name}</h4>
              <p className="text-white/90 mb-2">{modeloDetalle.description}</p>
              <p className="text-white/80 text-sm">
                <strong>Razón de selección:</strong> {modeloInfo.razonSeleccion}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm text-white/80">Selección Automática</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">
          ✅ Prompt Optimizado por IA
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Puntuación:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            resultado.puntuacion >= 8 ? 'bg-green-100 text-green-800' :
            resultado.puntuacion >= 6 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {resultado.puntuacion}/10
          </span>
        </div>
      </div>

      {/* Prompt Final con Opciones de Idioma */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-blue-900 flex items-center">
            <span className="mr-2">🎯</span>
            Prompt Final Optimizado por los 3 Agentes
          </h4>
          <div className="flex items-center space-x-3">
            {/* Selector de idioma */}
            <div className="flex bg-white rounded-lg border border-blue-200 overflow-hidden">
              <button
                onClick={() => setVistaActiva('español')}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  vistaActiva === 'español'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-600 hover:bg-blue-100'
                }`}
              >
                🇪🇸 Español
              </button>
              <button
                onClick={() => {
                  if (promptTraducido) {
                    setVistaActiva('ingles');
                  } else {
                    traducirPrompt();
                  }
                }}
                disabled={traduciendoPrompt}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  vistaActiva === 'ingles'
                    ? 'bg-green-600 text-white'
                    : traduciendoPrompt
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-green-600 hover:bg-green-100'
                }`}
              >
                {traduciendoPrompt ? (
                  <>⏳ Traduciendo...</>
                ) : (
                  <>🇺🇸 English {promptTraducido ? '' : '(Traducir)'}</>
                )}
              </button>
            </div>
            
            {/* Botón de copiar */}
            <button
              onClick={() => copyToClipboard(
                vistaActiva === 'ingles' && promptTraducido
                  ? promptTraducido
                  : resultado.agente4?.resultado?.promptFinal || resultado.agente3?.resultado?.prompt_mejorado || resultado.promptFinal
              )}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors flex items-center"
            >
              <span className="mr-1">📋</span>
              Copiar
            </button>
          </div>
        </div>

        {/* Estadísticas de tokens (solo cuando hay traducción) */}
        {estadisticasTokens && vistaActiva === 'ingles' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-green-800">
                  <strong>Ahorro estimado:</strong> {estadisticasTokens.tokensAhorrados} tokens ({estadisticasTokens.porcentajeAhorro}%)
                </span>
                <span className="text-green-600">
                  🇪🇸 {estadisticasTokens.tokensEspanol} → 🇺🇸 {estadisticasTokens.tokensIngles}
                </span>
              </div>
              <span className="text-green-700 font-medium">💰 Menor costo</span>
            </div>
          </div>
        )}
        
        <div className="bg-white p-4 rounded border border-blue-200 shadow-sm">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed">
            {vistaActiva === 'ingles' && promptTraducido
              ? promptTraducido
              : resultado.agente4?.resultado?.promptFinal || resultado.agente3?.resultado?.prompt_mejorado || resultado.promptFinal
            }
          </pre>
        </div>
      </div>

      {/* Indicador de mejoras */}
      {resultado.agente4?.resultado?.promptFinal && resultado.agente4.resultado.mejorasImplementadas?.length > 0 && (
        <div className="mt-3 flex items-center text-sm text-indigo-700">
          <span className="mr-2">🚀</span>
          <span>Este prompt ha sido optimizado con {resultado.agente4.resultado.mejorasImplementadas.length} mejoras implementadas por el Agente Implementador</span>
        </div>
      )}

      {/* Resumen de Agentes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resultado.agente1 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-2">🔧 Agente Estructurador</h5>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Estructura:</span> {resultado.agente1.resultado?.estructura_recomendada}</p>
              <p><span className="font-medium">Complejidad:</span> 
                <span className={`ml-1 px-2 py-1 rounded text-xs ${
                  resultado.agente1.resultado?.complejidad === 'alta' ? 'bg-red-100 text-red-800' :
                  resultado.agente1.resultado?.complejidad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {resultado.agente1.resultado?.complejidad}
                </span>
              </p>
            </div>
          </div>
        )}
        
        {resultado.agente2 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h5 className="font-semibold text-green-900 mb-2">✍️ Agente Prompteador</h5>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Estado:</span> <span className="text-green-700">✅ Prompt creado</span></p>
              <p><span className="font-medium">Técnicas:</span> {resultado.agente2.resultado?.tecnicas_aplicadas?.length || 0}</p>
            </div>
          </div>
        )}
        
        {resultado.agente3 && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h5 className="font-semibold text-purple-900 mb-2">🔍 Agente Revisor</h5>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Puntuación:</span> 
                <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                  resultado.agente3.resultado?.puntuacion_total >= 8 ? 'bg-green-100 text-green-800' :
                  resultado.agente3.resultado?.puntuacion_total >= 6 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resultado.agente3.resultado?.puntuacion_total}/10
                </span>
              </p>
              <p><span className="font-medium">Mejoras:</span> {resultado.agente3.resultado?.mejoras_aplicadas?.length || 0}</p>
              <p><span className="font-medium">Recomendaciones:</span> {resultado.agente3.resultado?.recomendaciones?.length || 0}</p>
            </div>
          </div>
        )}
        
        {resultado.agente4 && (
          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h5 className="font-semibold text-indigo-900 mb-2">🚀 Agente Implementador</h5>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Estado:</span> <span className="text-indigo-700">✅ Versión final creada</span></p>
              <p><span className="font-medium">Mejoras implementadas:</span> {resultado.agente4.resultado?.mejorasImplementadas?.length || 0}</p>
              <p><span className="font-medium">Optimizaciones:</span> {resultado.agente4.resultado?.optimizacionesModelo?.length || 0}</p>
              {resultado.agente4.resultado?.promptFinal && (
                <div className="flex items-center text-indigo-700">
                  <span className="mr-1">🎯</span>
                  <span className="text-xs">Prompt final optimizado e implementado</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recomendaciones */}
      {resultado.recomendaciones && resultado.recomendaciones.length > 0 && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-3 flex items-center">
            <span className="mr-2">💡</span>
            Recomendaciones de la IA
          </h4>
          <div className="space-y-2">
            {resultado.recomendaciones.map((rec, index) => (
              <div key={index} className="flex items-start text-sm text-yellow-800">
                <span className="text-yellow-600 mr-2 mt-1">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Análisis Final */}
      {resultado.agente3?.resultado?.analisis_final && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">📊</span>
            Análisis Final del Prompt
          </h4>
          <p className="text-gray-700 leading-relaxed">
            {resultado.agente3.resultado.analisis_final}
          </p>
        </div>
      )}
    </div>
  );
}

// Componente para el tab de proceso de agentes
function TabProcesoAgentes({ resultado }) {
  const agentes = [
    { data: resultado.agente1, nombre: 'Estructurador', icono: '🔧', color: 'blue' },
    { data: resultado.agente2, nombre: 'Prompteador', icono: '✍️', color: 'green' },
    { data: resultado.agente3, nombre: 'Revisor', icono: '🔍', color: 'purple' },
    { data: resultado.agente4, nombre: 'Implementador', icono: '🚀', color: 'indigo' }
  ];

  return (
    <div className="space-y-6">
      {agentes.map((agente, index) => (
        <div key={index} className={`border border-${agente.color}-200 rounded-lg p-6 bg-${agente.color}-50`}>
          <h4 className={`font-bold text-${agente.color}-800 mb-4 flex items-center`}>
            <span className="mr-2">{agente.icono}</span>
            Agente {index + 1}: {agente.nombre}
          </h4>
          
          {agente.data?.resultado && (
            <div className="space-y-3">
              {index === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-blue-900">Estructura Recomendada:</p>
                    <p className="text-sm text-blue-800">{agente.data.resultado.estructura_recomendada}</p>
                  </div>
                  <div>
                    <p className="font-medium text-blue-900">Complejidad:</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      agente.data.resultado.complejidad === 'alta' ? 'bg-red-100 text-red-800' :
                      agente.data.resultado.complejidad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {agente.data.resultado.complejidad}
                    </span>
                  </div>
                  {agente.data.resultado.elementos_clave && (
                    <div className="md:col-span-2">
                      <p className="font-medium text-blue-900 mb-1">Elementos Clave:</p>
                      <div className="flex flex-wrap gap-1">
                        {agente.data.resultado.elementos_clave.map((elemento, idx) => (
                          <span key={idx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded text-xs">
                            {elemento}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {index === 1 && (
                <div>
                  <p className="font-medium text-green-900 mb-2">Técnicas Aplicadas:</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {agente.data.resultado.tecnicas_aplicadas?.map((tecnica, idx) => (
                      <span key={idx} className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs">
                        {tecnica}
                      </span>
                    ))}
                  </div>
                  {agente.data.resultado.explicacion && (
                    <div>
                      <p className="font-medium text-green-900">Explicación:</p>
                      <p className="text-sm text-green-800">{agente.data.resultado.explicacion}</p>
                    </div>
                  )}
                </div>
              )}
              
              {index === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-purple-900">Puntuación Final:</p>
                    <span className={`text-2xl font-bold ${
                      agente.data.resultado.puntuacion_total >= 8 ? 'text-green-600' :
                      agente.data.resultado.puntuacion_total >= 6 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {agente.data.resultado.puntuacion_total}/10
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-purple-900">Mejoras Aplicadas:</p>
                    <p className="text-sm text-purple-800">{agente.data.resultado.mejoras_aplicadas?.length || 0}</p>
                  </div>
                  {agente.data.resultado.mejoras_aplicadas && agente.data.resultado.mejoras_aplicadas.length > 0 && (
                    <div className="md:col-span-2">
                      <p className="font-medium text-purple-900 mb-1">Lista de Mejoras:</p>
                      <ul className="text-sm text-purple-800 space-y-1">
                        {agente.data.resultado.mejoras_aplicadas.map((mejora, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-purple-600 mr-2">•</span>
                            {mejora}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Componente para el tab de análisis detallado
function TabAnalisisDetallado({ resultado }) {
  const evaluacion = resultado.agente3?.resultado?.evaluacion;

  if (!evaluacion) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-4xl mb-3">📊</div>
        <p className="text-gray-500">No hay evaluación detallada disponible</p>
      </div>
    );
  }

  const criterios = {
    claridad: { emoji: '🔍', nombre: 'Claridad', descripcion: 'Qué tan claro y comprensible es el prompt' },
    especificidad: { emoji: '🎯', nombre: 'Especificidad', descripcion: 'Qué tan específico es para la tarea' },
    estructura: { emoji: '🏗️', nombre: 'Estructura', descripcion: 'Organización y formato del prompt' },
    completitud: { emoji: '✅', nombre: 'Completitud', descripcion: 'Si incluye toda la información necesaria' },
    efectividad: { emoji: '⚡', nombre: 'Efectividad', descripcion: 'Probabilidad de obtener buenos resultados' },
    eficiencia: { emoji: '🚀', nombre: 'Eficiencia', descripcion: 'Optimización de tokens según el modelo' },
    mitigacion: { emoji: '🛡️', nombre: 'Mitigación', descripcion: 'Prevención de limitaciones del modelo' }
  };

  const promedioPuntuacion = Object.values(evaluacion).reduce((sum, item) => sum + item.puntuacion, 0) / Object.keys(evaluacion).length;

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-purple-900 text-lg">📊 Evaluación Detallada</h4>
          <div className="text-right">
            <div className="text-sm text-purple-700">Puntuación Promedio</div>
            <div className={`text-2xl font-bold ${
              promedioPuntuacion >= 8 ? 'text-green-600' :
              promedioPuntuacion >= 6 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {promedioPuntuacion.toFixed(1)}/10
            </div>
          </div>
        </div>
      </div>

      {/* Criterios de Evaluación */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(evaluacion).map(([criterio, datos]) => {
          const info = criterios[criterio] || { emoji: '📋', nombre: criterio, descripcion: '' };
          return (
            <div key={criterio} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{info.emoji}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{info.nombre}</h5>
                    <p className="text-xs text-gray-500">{info.descripcion}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                  datos.puntuacion >= 8 ? 'bg-green-100 text-green-800' :
                  datos.puntuacion >= 6 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {datos.puntuacion}/10
                </span>
              </div>
              
              {/* Barra de progreso */}
              <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      datos.puntuacion >= 8 ? 'bg-green-500' :
                      datos.puntuacion >= 6 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(datos.puntuacion / 10) * 100}%` }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-700 leading-relaxed">{datos.comentario}</p>
            </div>
          );
        })}
      </div>

      {/* Comparación de Prompts */}
      {resultado.agente2?.resultado?.prompt_optimizado && resultado.agente4?.resultado?.promptFinal && (
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔄</span>
            Comparación: Prompt Base (Agente 2) vs Prompt Final Implementado (Agente 4)
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Prompt del Agente 2 */}
            <div className="space-y-2">
              <h5 className="font-medium text-green-800 flex items-center">
                <span className="mr-2">✍️</span>
                Prompt Base (Agente 2)
              </h5>
              <div className="bg-green-50 p-3 rounded border border-green-200 max-h-60 overflow-y-auto">
                <div className="whitespace-pre-wrap text-xs font-mono text-green-900">
                  {resultado.agente2.resultado.prompt_optimizado}
                </div>
              </div>
            </div>
            
            {/* Prompt Final Implementado */}
            <div className="space-y-2">
              <h5 className="font-medium text-indigo-800 flex items-center">
                <span className="mr-2">�</span>
                Prompt Final Implementado (Agente 4)
              </h5>
              <div className="bg-indigo-50 p-3 rounded border border-indigo-200 max-h-60 overflow-y-auto">
                <div className="whitespace-pre-wrap text-xs font-mono text-indigo-900">
                  {resultado.agente4.resultado.promptFinal}
                </div>
              </div>
            </div>
          </div>
          
          {/* Indicador de mejoras implementadas */}
          {resultado.agente4?.resultado?.mejorasImplementadas?.length > 0 && (
            <div className="mt-4 p-3 bg-indigo-50 rounded border border-indigo-200">
              <h6 className="font-medium text-indigo-900 mb-2">🚀 Mejoras Implementadas en el Prompt Final:</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resultado.agente4.resultado.mejorasImplementadas.map((mejora, idx) => (
                  <div key={idx} className="flex items-start text-sm text-indigo-800">
                    <span className="text-indigo-600 mr-2 mt-1">✅</span>
                    <span>{mejora}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Optimizaciones del modelo */}
          {resultado.agente4?.resultado?.optimizacionesModelo?.length > 0 && (
            <div className="mt-4 p-3 bg-cyan-50 rounded border border-cyan-200">
              <h6 className="font-medium text-cyan-900 mb-2">⚙️ Optimizaciones Específicas del Modelo:</h6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resultado.agente4.resultado.optimizacionesModelo.map((opt, idx) => (
                  <div key={idx} className="flex items-start text-sm text-cyan-800">
                    <span className="text-cyan-600 mr-2 mt-1">⚙️</span>
                    <span>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Análisis Final si existe */}
      {resultado.agente3?.resultado?.analisis_final && (
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <span className="mr-2">🔍</span>
            Análisis Final del Revisor
          </h4>
          <p className="text-blue-800 leading-relaxed">
            {resultado.agente3.resultado.analisis_final}
          </p>
        </div>
      )}

      {/* Mejoras y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {resultado.agente3?.resultado?.mejoras_aplicadas && resultado.agente3.resultado.mejoras_aplicadas.length > 0 && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h5 className="font-semibold text-green-900 mb-3 flex items-center">
              <span className="mr-2">🔧</span>
              Mejoras Aplicadas ({resultado.agente3.resultado.mejoras_aplicadas.length})
            </h5>
            <ul className="space-y-2">
              {resultado.agente3.resultado.mejoras_aplicadas.map((mejora, idx) => (
                <li key={idx} className="flex items-start text-sm text-green-800">
                  <span className="text-green-600 mr-2 mt-1">•</span>
                  <span>{mejora}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {resultado.agente3?.resultado?.recomendaciones && resultado.agente3.resultado.recomendaciones.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h5 className="font-semibold text-yellow-900 mb-3 flex items-center">
              <span className="mr-2">💡</span>
              Recomendaciones ({resultado.agente3.resultado.recomendaciones.length})
            </h5>
            <ul className="space-y-2">
              {resultado.agente3.resultado.recomendaciones.map((rec, idx) => (
                <li key={idx} className="flex items-start text-sm text-yellow-800">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
