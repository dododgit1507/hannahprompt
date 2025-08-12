// src/components/forms/PromptForm.jsx
import { useState, useRef, useEffect } from 'react';
import { selectorModelo } from '../../services/selectorModelo';

export default function PromptForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    areaNegocio: '',
    objetivo: '',
    reto: ''
  });

  const [modeloSeleccionado, setModeloSeleccionado] = useState(null);
  const [modeloManual, setModeloManual] = useState(''); // Para selección manual
  
  // Estados para reconocimiento de voz
  const [isListening, setIsListening] = useState({
    objetivo: false,
    reto: false
  });
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState('unknown'); // 'unknown', 'granted', 'denied', 'prompt'
  const recognitionRef = useRef(null);

  // Función para diagnosticar el estado del micrófono
  const diagnosticarMicrofono = async () => {
    console.log('🔍 Iniciando diagnóstico del micrófono...');
    
    try {
      // 1. Verificar permisos via Permissions API
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
      console.log('📊 Estado de permisos:', permissionStatus.state);
      setMicrophoneStatus(permissionStatus.state);
      
      // 2. Intentar acceso directo al micrófono
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Acceso al micrófono exitoso');
      
      // Liberar el stream inmediatamente
      stream.getTracks().forEach(track => track.stop());
      
      alert('✅ DIAGNÓSTICO EXITOSO\n\nTu micrófono funciona correctamente.\n\nAhora puedes usar el reconocimiento de voz sin problemas.');
      setPermissionGranted(true);
      
    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      
      if (error.name === 'NotAllowedError') {
        alert('🚫 PERMISOS BLOQUEADOS\n\nSolución:\n1. Haz clic en el ícono 🔒 en la barra de direcciones\n2. Cambia "Micrófono" a "Permitir"\n3. Recarga la página\n\nO ve a:\nchrome://settings/content/microphone');
      } else if (error.name === 'NotFoundError') {
        alert('🎤 MICRÓFONO NO ENCONTRADO\n\nVerifica:\n• Que el micrófono esté conectado\n• Que sea detectado por el sistema\n• Que funcione en otras aplicaciones');
      } else {
        alert(`🔧 ERROR TÉCNICO\n\nDetalles: ${error.name} - ${error.message}\n\nInténtalo:\n• Reiniciar el navegador\n• Verificar configuración de audio\n• Probar con otro navegador`);
      }
    }
  };

  // Verificar soporte para reconocimiento de voz
  useEffect(() => {
    const checkVoiceSupport = () => {
      // Verificar si el navegador soporta Web Speech API
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        console.log('✅ Navegador compatible con Web Speech API');
        setVoiceSupported(true);
        
        // Solo configurar el reconocimiento básico
        try {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          recognitionRef.current = new SpeechRecognition();
          console.log('✅ Reconocimiento de voz inicializado');
        } catch (error) {
          console.log('⚠️ Error al inicializar reconocimiento:', error);
          setVoiceSupported(false);
        }
      } else {
        console.log('❌ Navegador no compatible con Web Speech API');
        setVoiceSupported(false);
      }
    };
    
    checkVoiceSupport();
  }, []);

  // Función para solicitar permisos y iniciar reconocimiento de voz
  const toggleVoiceRecognition = async (field) => {
    if (!voiceSupported) {
      alert('❌ Tu navegador no soporta reconocimiento de voz.\n\nNavegadores compatibles:\n• Google Chrome\n• Microsoft Edge\n• Safari (iOS/macOS)\n\nPor favor, usa uno de estos navegadores.');
      return;
    }

    if (isListening[field]) {
      // Detener reconocimiento
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(prev => ({ ...prev, [field]: false }));
      return;
    }

    try {
      // Primero, intentar crear y configurar el reconocimiento si no existe
      if (!recognitionRef.current) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'es-ES';
        recognitionRef.current.maxAlternatives = 1;
      }

      // Configurar eventos del reconocimiento ANTES de iniciarlo
      recognitionRef.current.onstart = () => {
        console.log('✅ Reconocimiento de voz iniciado correctamente para campo:', field);
        setIsListening(prev => ({ ...prev, [field]: true }));
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        console.log('🎤 Texto reconocido:', transcript, '| Confianza:', confidence);
        
        setFormData(prev => ({
          ...prev,
          [field]: prev[field] + (prev[field] ? ' ' : '') + transcript
        }));
      };

      recognitionRef.current.onerror = (event) => {
        console.error('❌ Error de reconocimiento de voz:', event.error);
        console.log('📊 Detalles completos del error:', event);
        setIsListening(prev => ({ ...prev, [field]: false }));
        
        switch (event.error) {
          case 'not-allowed':
            // Verificar si realmente son permisos o es otro problema
            navigator.permissions.query({ name: 'microphone' }).then(result => {
              if (result.state === 'granted') {
                alert('� PROBLEMA TÉCNICO DETECTADO\n\nLos permisos están dados pero hay un conflicto.\n\nSoluciones:\n• Cierra otras aplicaciones que usen el micrófono\n• Verifica que el micrófono no esté en uso\n• Prueba recargar la página\n• Reinicia el navegador');
              } else {
                alert('�🔒 PERMISOS DE MICRÓFONO DENEGADOS\n\nPara usar el reconocimiento de voz:\n\n1. Busca el ícono 🔒 o 🎤 en la barra de direcciones\n2. Haz clic y selecciona "Permitir"\n3. O ve a Configuración > Privacidad > Micrófono\n4. Recarga la página después de dar permisos');
              }
            }).catch(() => {
              alert('🔧 ERROR DE PERMISOS\n\nNo se pueden verificar los permisos.\n\nInténtalo:\n• Recargar la página\n• Verificar configuración del navegador\n• Usar Chrome o Edge');
            });
            break;
          case 'no-speech':
            alert('🤫 NO SE DETECTÓ HABLA\n\nConsejos:\n• Habla más claro y fuerte\n• Acércate más al micrófono\n• Verifica que el micrófono funcione\n• Intenta de nuevo en un lugar más silencioso');
            break;
          case 'audio-capture':
            alert('🎤 PROBLEMA CON EL MICRÓFONO\n\nVerifica:\n• Que el micrófono esté conectado\n• Que no esté silenciado\n• Que ninguna otra aplicación lo esté usando\n• Los permisos del navegador');
            break;
          case 'network':
            alert('🌐 ERROR DE CONEXIÓN\n\nEl reconocimiento de voz requiere internet.\nVerifica tu conexión e intenta de nuevo.');
            break;
          case 'aborted':
            console.log('ℹ️ Reconocimiento cancelado por el usuario');
            break;
          case 'service-not-allowed':
            alert('🚫 SERVICIO BLOQUEADO\n\nEl navegador ha bloqueado el servicio.\n\nSoluciones:\n• Ve a chrome://settings/content/microphone\n• Permite el sitio específicamente\n• Recarga la página');
            break;
          default:
            alert(`❌ ERROR INESPERADO: ${event.error}\n\nDetalles técnicos para diagnóstico:\n• Error: ${event.error}\n• Mensaje: ${event.message || 'N/A'}\n\nInténtalo:\n• Recargar la página\n• Usar otro navegador\n• Verificar permisos de micrófono`);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('🔚 Reconocimiento de voz terminado');
        setIsListening(prev => ({ ...prev, [field]: false }));
      };

      // Mostrar instrucciones al usuario antes de iniciar
      console.log('🎤 Iniciando reconocimiento de voz para campo:', field);
      console.log('📊 Estado de permisos conocido:', permissionGranted);
      
      // Verificar permisos antes de iniciar si es posible
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' });
        console.log('🔍 Verificación de permisos:', permissionStatus.state);
        
        if (permissionStatus.state === 'denied') {
          alert('🚫 PERMISOS EXPLÍCITAMENTE DENEGADOS\n\nPara solucionarlo:\n1. Haz clic en el ícono 🔒 en la barra de direcciones\n2. Cambia "Micrófono" a "Permitir"\n3. Recarga la página\n\nO ve a: chrome://settings/content/microphone');
          return;
        }
      } catch (permError) {
        console.log('⚠️ No se pudieron verificar permisos via API:', permError);
      }
      
      // Iniciar reconocimiento (esto automáticamente solicitará permisos si es necesario)
      recognitionRef.current.start();
      
    } catch (error) {
      console.error('💥 Error crítico al inicializar reconocimiento:', error);
      setIsListening(prev => ({ ...prev, [field]: false }));
      
      if (error.name === 'NotAllowedError') {
        alert('🚫 ACCESO AL MICRÓFONO BLOQUEADO\n\nPara habilitarlo:\n\n1. Haz clic en el ícono 🔒 en la barra de direcciones\n2. Selecciona "Permitir" para el micrófono\n3. Recarga la página\n\nO ve a Configuración del navegador > Privacidad > Micrófono');
      } else if (error.name === 'NotSupportedError') {
        alert('❌ NAVEGADOR NO COMPATIBLE\n\nUsa uno de estos navegadores:\n• Google Chrome (recomendado)\n• Microsoft Edge\n• Safari (en dispositivos Apple)');
      } else {
        alert(`🔧 ERROR TÉCNICO\n\nDetalles: ${error.message}\n\nSoluciones:\n• Recarga la página\n• Verifica permisos de micrófono\n• Intenta con otro navegador`);
      }
    }
  };

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
        
        {/* Indicador de soporte de voz */}
        {voiceSupported && (
          <div className="mt-3 p-3 bg-emerald-500/10 rounded-lg border border-emerald-300">
            <div className="flex items-center gap-2 text-emerald-100 text-sm mb-2">
              <span className="text-lg">🎤</span>
              <span className="font-medium">Reconocimiento de Voz Activado</span>
            </div>
            <p className="text-emerald-100 text-xs">
              <strong>Cómo usar:</strong> Haz clic en los botones 🎤 en los campos de texto y habla claramente. 
              El navegador te pedirá permisos de micrófono la primera vez.
            </p>
          </div>
        )}
        
        {!voiceSupported && (
          <div className="mt-3 p-3 bg-orange-500/10 rounded-lg border border-orange-300">
            <div className="flex items-center gap-2 text-orange-100 text-sm mb-2">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">Reconocimiento de Voz No Disponible</span>
            </div>
            <p className="text-orange-100 text-xs">
              Para usar esta función, cambia a <strong>Chrome</strong>, <strong>Edge</strong> o <strong>Safari</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Instrucciones específicas de voz */}
        {voiceSupported && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                💡
              </div>
              <h3 className="font-bold text-blue-800">Guía Rápida: Reconocimiento de Voz</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h4 className="font-bold text-blue-700 mb-2">🎤 Cómo Activar</h4>
                <ul className="text-blue-600 space-y-1 text-xs">
                  <li>• Haz clic en el botón 🎤 verde</li>
                  <li>• El navegador pedirá permisos</li>
                  <li>• Acepta "Permitir micrófono"</li>
                  <li>• El botón se vuelve rojo 🔴</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-blue-100">
                <h4 className="font-bold text-blue-700 mb-2">🗣️ Consejos para Hablar</h4>
                <ul className="text-blue-600 space-y-1 text-xs">
                  <li>• Habla claro y pausado</li>
                  <li>• Acércate al micrófono</li>
                  <li>• Evita ruido de fondo</li>
                  <li>• Haz clic para detener</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between">
                <p className="text-yellow-700 text-xs">
                  <strong>⚠️ Si no funciona:</strong> Verifica que el ícono 🔒 o 🎤 en la barra de direcciones no esté bloqueando el micrófono.
                </p>
                <button
                  type="button"
                  onClick={diagnosticarMicrofono}
                  className="ml-3 px-3 py-1 bg-yellow-600 text-white text-xs rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  🔍 Diagnosticar
                </button>
              </div>
              
              {microphoneStatus !== 'unknown' && (
                <div className="mt-2 p-2 bg-white rounded border">
                  <p className="text-xs text-gray-600">
                    <strong>Estado actual:</strong> 
                    <span className={`ml-1 ${
                      microphoneStatus === 'granted' ? 'text-green-600' : 
                      microphoneStatus === 'denied' ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {microphoneStatus === 'granted' ? '✅ Permitido' : 
                       microphoneStatus === 'denied' ? '❌ Denegado' : '⏳ Pendiente'}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

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
              className="w-full h-24 p-4 pr-16 border-2 border-gray-200 rounded-xl resize-none focus:border-emerald-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
            />
            
            {/* Botón de micrófono para objetivo */}
            {voiceSupported && (
              <button
                type="button"
                onClick={() => toggleVoiceRecognition('objetivo')}
                className={`absolute top-3 right-3 p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isListening.objetivo
                    ? 'bg-red-500 text-white shadow-lg animate-pulse scale-110'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg hover:scale-105'
                }`}
                title={isListening.objetivo ? 'GRABANDO - Haz clic para parar' : 'Haz clic y habla tu objetivo (el navegador pedirá permisos)'}
              >
                {isListening.objetivo ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xs">�</span>
                  </div>
                ) : (
                  <span className="text-base">🎤</span>
                )}
              </button>
            )}
            
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.objetivo.length} caracteres
            </div>
            
            {/* Indicador de estado de voz */}
            {isListening.objetivo && (
              <div className="absolute bottom-10 right-3 text-xs text-red-600 font-medium animate-pulse">
                🔴 Escuchando...
              </div>
            )}
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
              className="w-full h-20 p-4 pr-16 border-2 border-gray-200 rounded-xl resize-none focus:border-emerald-500 focus:outline-none transition-colors text-gray-900 placeholder-gray-500"
            />
            
            {/* Botón de micrófono para reto */}
            {voiceSupported && (
              <button
                type="button"
                onClick={() => toggleVoiceRecognition('reto')}
                className={`absolute top-3 right-3 p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isListening.reto
                    ? 'bg-red-500 text-white shadow-lg animate-pulse scale-110'
                    : 'bg-gray-500 text-white hover:bg-gray-600 shadow-md hover:shadow-lg hover:scale-105'
                }`}
                title={isListening.reto ? 'GRABANDO - Haz clic para parar' : 'Haz clic y habla tu reto específico'}
              >
                {isListening.reto ? (
                  <div className="flex flex-col items-center">
                    <span className="text-xs">�</span>
                  </div>
                ) : (
                  <span className="text-base">🎤</span>
                )}
              </button>
            )}
            
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.reto.length} caracteres
            </div>
            
            {/* Indicador de estado de voz */}
            {isListening.reto && (
              <div className="absolute bottom-10 right-3 text-xs text-red-600 font-medium animate-pulse">
                🔴 Escuchando...
              </div>
            )}
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
