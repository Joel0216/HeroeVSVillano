// Script de inicio para DataFight
import fs from 'fs';
import path from 'path';

console.log('🚀 Iniciando DataFight...');

// Verificar y crear directorios necesarios
const directories = [
  'data',
  'public/uploads',
  'public/uploads/music',
  'public/uploads/images'
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Directorio creado: ${dir}`);
  }
});

// Crear archivo de configuración de música si no existe
const musicConfigPath = path.join(process.cwd(), 'data', 'music-config.json');
if (!fs.existsSync(musicConfigPath)) {
  const defaultConfig = {
    lobbyMusic: null,
    battleMusic: null,
    lobbyMusicName: null,
    battleMusicName: null,
    updatedAt: new Date().toISOString(),
    updatedBy: 'system'
  };
  fs.writeFileSync(musicConfigPath, JSON.stringify(defaultConfig, null, 2));
  console.log('✅ Archivo de configuración de música creado');
}

console.log('\n🎵 Sistema de música configurado correctamente');
console.log('📁 Directorios verificados:');
directories.forEach(dir => {
  console.log(`   - ${dir}`);
});

console.log('\n🎯 Opciones de uso:');
console.log('1. Modo archivo local (sin servidor):');
console.log(`   - Abre: file://${path.join(process.cwd(), 'public', 'index.html')}`);
console.log('   - Funciona completamente offline');
console.log('   - Música guardada en localStorage');

console.log('\n2. Modo servidor local:');
console.log('   - Ejecuta: node server.js');
console.log(`   - Abre: http://localhost:3001`);
console.log('   - Música guardada en servidor');

console.log('\n3. Modo servidor completo:');
console.log('   - Ejecuta: node app.js');
console.log(`   - Abre: http://localhost:3001`);
console.log('   - Incluye base de datos y autenticación');

console.log('\n✅ ¡DataFight está listo para usar!'); 