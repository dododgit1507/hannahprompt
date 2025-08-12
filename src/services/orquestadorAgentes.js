// src/services/orquestadorAgentes.js
import { agentEstructuradorIA } from './agentEstructurador.js';
import { agentPrompteadorIA } from './agentPrompteador.js';
import { agentRevisorIA } from './agentRevisor.js';
import agentImplementador from './agentImplementador.js';

export const orquestadorAgentesIA = {
  procesarSolicitud: async (especialidad, modelo, consulta, onProgress, modeloInfo = null) => {
    console.log('🚀 =================================');
    console.log('🤖 INICIANDO PROCESAMIENTO CON 4 AGENTES IA');
    console.log('📋 Especialidad:', especialidad);
    console.log('🤖 Modelo:', modelo);
    console.log('❓ Consulta:', consulta);
    console.log('=================================');

    const resultados = {
      agente1: null,
      agente2: null,
      agente3: null,
      agente4: null
    };

    try {
      // ==================== AGENTE 1: ESTRUCTURADOR IA ====================
      onProgress && onProgress({
        fase: 'agente1',
        mensaje: '🔧 Agente 1: Analizando estructura con IA...',
        estado: 'procesando'
      });

      console.log('\n🔧 =============== AGENTE 1: ESTRUCTURADOR IA ===============');
      console.log('🔍 Analizando estructura óptima para el modelo:', modelo);
      
      const estructuraAnalisis = await agentEstructuradorIA.analizarEstructura(
        especialidad, 
        modelo, 
        consulta
      );

      resultados.agente1 = estructuraAnalisis;

      console.log('✅ RESPUESTA AGENTE 1:');
      console.log('📊 Estructura recomendada:', estructuraAnalisis.estructura_recomendada);
      console.log('🔑 Elementos clave:', estructuraAnalisis.elementos_clave);
      console.log('📈 Complejidad:', estructuraAnalisis.complejidad);
      console.log('💡 Análisis:', estructuraAnalisis.analisis);

      onProgress && onProgress({
        fase: 'agente1',
        mensaje: '✅ Agente 1: Análisis completado',
        estado: 'completado',
        respuesta: estructuraAnalisis
      });

      // ==================== AGENTE 2: PROMPTEADOR IA ====================
      onProgress && onProgress({
        fase: 'agente2', 
        mensaje: '✍️ Agente 2: Creando prompt optimizado con IA...',
        estado: 'procesando'
      });

      console.log('\n✍️ =============== AGENTE 2: PROMPTEADOR IA ===============');
      console.log('🎯 Creando prompt optimizado basado en el análisis...');
      
      const promptData = await agentPrompteadorIA.crearPrompt(
        especialidad,
        modelo,
        consulta,
        estructuraAnalisis
      );

      resultados.agente2 = promptData;

      console.log('✅ RESPUESTA AGENTE 2:');
      console.log('📝 Prompt optimizado creado:');
      console.log('─────────────────────────────────');
      console.log(promptData.prompt_optimizado);
      console.log('─────────────────────────────────');
      console.log('🔧 Técnicas aplicadas:', promptData.tecnicas_aplicadas);
      console.log('💭 Explicación:', promptData.explicacion);

      onProgress && onProgress({
        fase: 'agente2',
        mensaje: '✅ Agente 2: Prompt creado',
        estado: 'completado',
        respuesta: promptData
      });

      // ==================== AGENTE 3: REVISOR IA ====================
      onProgress && onProgress({
        fase: 'agente3',
        mensaje: '🔍 Agente 3: Revisando y optimizando con IA...',
        estado: 'procesando'
      });

      console.log('\n🔍 =============== AGENTE 3: REVISOR IA ===============');
      console.log('🎖️ Revisando y optimizando el prompt creado...');
      
      const revision = await agentRevisorIA.revisarYOptimizar(
        especialidad,
        modelo,
        consulta,
        promptData.prompt_optimizado,
        estructuraAnalisis
      );

      resultados.agente3 = revision;

      console.log('✅ RESPUESTA AGENTE 3:');
      console.log('📊 Evaluación completa:');
      Object.entries(revision.evaluacion).forEach(([criterio, datos]) => {
        console.log(`   ${criterio.toUpperCase()}: ${datos.puntuacion}/10 - ${datos.comentario}`);
      });
      console.log('🏆 Puntuación total:', revision.puntuacion_total + '/10');
      console.log('🔧 Mejoras aplicadas:', revision.mejoras_aplicadas);
      console.log('💡 Recomendaciones:', revision.recomendaciones);

      console.log('\n📝 PROMPT FINAL OPTIMIZADO:');
      console.log('═══════════════════════════════════════');
      console.log(revision.prompt_mejorado);
      console.log('═══════════════════════════════════════');

      onProgress && onProgress({
        fase: 'agente3',
        mensaje: '✅ Agente 3: Revisión completada',
        estado: 'completado',
        respuesta: revision
      });

      // ==================== AGENTE 4: IMPLEMENTADOR IA ====================
      onProgress && onProgress({
        fase: 'agente4',
        mensaje: '🔧 Agente 4: Implementando mejoras finales...',
        estado: 'procesando'
      });

      console.log('\n🔧 =============== AGENTE 4: IMPLEMENTADOR IA ===============');
      console.log('⚡ Implementando mejoras y creando versión final optimizada...');
      
      const implementacion = await agentImplementador.implementarMejoras(
        promptData.prompt_optimizado,  // Prompt del Agente 2
        revision.recomendaciones,       // Recomendaciones del Agente 3
        especialidad,
        modelo
      );

      resultados.agente4 = implementacion;

      console.log('✅ RESPUESTA AGENTE 4:');
      console.log('🚀 Versión final implementada');
      console.log('📝 Mejoras implementadas:', implementacion.mejorasImplementadas);
      console.log('⚙️ Optimizaciones para modelo:', implementacion.optimizacionesModelo);
      console.log('💡 Explicación cambios:', implementacion.explicacionCambios);

      console.log('\n📝 PROMPT FINAL IMPLEMENTADO:');
      console.log('═══════════════════════════════════════');
      console.log(implementacion.promptFinal);
      console.log('═══════════════════════════════════════');

      onProgress && onProgress({
        fase: 'agente4',
        mensaje: '✅ Agente 4: Implementación completada',
        estado: 'completado',
        respuesta: implementacion
      });

      // ==================== RESULTADO FINAL ====================
      onProgress && onProgress({
        fase: 'final',
        mensaje: '🎉 ¡Procesamiento completado exitosamente!',
        estado: 'finalizado'
      });

      console.log('\n🎉 =============== PROCESAMIENTO COMPLETADO ===============');
      console.log('✅ Los 4 agentes IA han terminado su trabajo');
      console.log('🏆 Puntuación del Agente 3:', revision.puntuacion_total + '/10');
      console.log('🚀 Prompt final implementado por Agente 4');

      return {
        exito: true,
        modeloSeleccionado: {
          modelo: modelo,
          informacion: modeloInfo,
          razonSeleccion: modeloInfo?.razon || "Modelo seleccionado por el usuario"
        },
        agente1: {
          nombre: "Estructurador IA",
          resultado: estructuraAnalisis,
          completado: true
        },
        agente2: {
          nombre: "Prompteador IA", 
          resultado: promptData,
          completado: true
        },
        agente3: {
          nombre: "Revisor IA",
          resultado: revision,
          completado: true
        },
        agente4: {
          nombre: "Implementador IA",
          resultado: implementacion,
          completado: true
        },
        promptFinal: implementacion.promptFinal,  // Ahora viene del Agente 4
        promptBase: promptData.prompt_optimizado, // Prompt original del Agente 2
        puntuacion: revision.puntuacion_total,
        recomendaciones: revision.recomendaciones,
        mejorasImplementadas: implementacion.mejorasImplementadas,
        optimizacionesModelo: implementacion.optimizacionesModelo,
        explicacionCambios: implementacion.explicacionCambios,
        consejosUso: implementacion.consejosUso,
        consultaOriginal: consulta,
        especialidad,
        modelo,
        procesoCompleto: resultados
      };

    } catch (error) {
      console.error('\n❌ =============== ERROR EN PROCESAMIENTO ===============');
      console.error('💥 Error:', error.message);
      console.error('📍 Stack:', error.stack);

      onProgress && onProgress({
        fase: 'error',
        mensaje: '❌ Error en el procesamiento',
        estado: 'error',
        error: error.message
      });

      return {
        exito: false,
        error: error.message,
        detalleError: error.toString(),
        resultadosParciales: resultados
      };
    }
  }
};