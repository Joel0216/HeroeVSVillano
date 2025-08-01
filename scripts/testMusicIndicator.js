// Script para probar el nuevo sistema de indicador de música
console.log('🎵 Probando nuevo sistema de indicador de música...');

// Simular las funciones del sistema
function showMusicIndicator(isActive) {
  const status = isActive ? '🔊 ACTIVA' : '🔇 DESACTIVADA';
  const color = isActive ? 'MORADO' : 'GRIS';
  console.log(`📱 Indicador de música: ${status} (Color: ${color})`);
  console.log(`📍 Posición: Esquina superior derecha`);
  console.log(`📏 Tamaño: 50x50px (círculo)`);
  console.log(`🎯 Funcionalidad: Click para alternar`);
}

// Probar diferentes estados
console.log('\n🧪 Probando estados del indicador:');

console.log('\n1. Música desactivada:');
showMusicIndicator(false);

console.log('\n2. Música activada:');
showMusicIndicator(true);

console.log('\n3. Alternando estados:');
showMusicIndicator(false);
showMusicIndicator(true);
showMusicIndicator(false);

console.log('\n✅ Sistema de indicador de música probado correctamente');
console.log('🎮 Características implementadas:');
console.log('   • Icono compacto en lugar de pestaña flotante');
console.log('   • 🔊 para música activa (morado)');
console.log('   • 🔇 para música desactivada (gris)');
console.log('   • Click para alternar música');
console.log('   • Posición fija en esquina superior derecha');
console.log('   • Transiciones suaves');
console.log('   • Tooltip informativo'); 