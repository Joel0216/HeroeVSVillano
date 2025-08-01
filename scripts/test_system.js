// Script para verificar el sistema completo
import fs from 'fs';
import path from 'path';

console.log('🧪 Verificando sistema DataFight...\n');

// Verificar archivos necesarios
const requiredFiles = [
  'public/index.html',
  'public/standalone.js',
  'server.js',
  'start.js'
];

console.log('📁 Verificando archivos necesarios:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - FALTANTE`);
  }
});

// Verificar directorios
const requiredDirs = [
  'data',
  'public/uploads',
  'public/uploads/music',
  'public/uploads/images'
];

console.log('\n📂 Verificando directorios:');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - FALTANTE`);
  }
});

// Verificar configuración de música
const musicConfigPath = path.join(process.cwd(), 'data', 'music-config.json');
if (fs.existsSync(musicConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(musicConfigPath, 'utf-8'));
    console.log('\n🎵 Configuración de música:');
    console.log(`✅ Archivo de configuración existe`);
    console.log(`📊 Lobby music: ${config.lobbyMusic || 'No configurada'}`);
    console.log(`📊 Battle music: ${config.battleMusic || 'No configurada'}`);
  } catch (error) {
    console.log(`❌ Error al leer configuración de música: ${error.message}`);
  }
} else {
  console.log('\n❌ Archivo de configuración de música no existe');
}

// Verificar contenido de standalone.js
const standalonePath = path.join(process.cwd(), 'public', 'standalone.js');
if (fs.existsSync(standalonePath)) {
  const content = fs.readFileSync(standalonePath, 'utf-8');
  
  console.log('\n🔍 Verificando funciones en standalone.js:');
  
  const requiredFunctions = [
    'loadSavedMusic',
    'handleAuth',
    'renderAuthForm',
    'showScreen',
    'showMessage',
    'initializeMusic'
  ];
  
  requiredFunctions.forEach(func => {
    if (content.includes(`function ${func}`) || content.includes(`async function ${func}`)) {
      console.log(`✅ ${func}() - Encontrada`);
    } else {
      console.log(`❌ ${func}() - FALTANTE`);
    }
  });
  
  // Verificar detección de modo
  if (content.includes('isServerMode')) {
    console.log('✅ Detección de modo - Implementada');
  } else {
    console.log('❌ Detección de modo - FALTANTE');
  }
}

console.log('\n🎯 Instrucciones de uso:');
console.log('1. Modo archivo local:');
console.log(`   file://${path.join(process.cwd(), 'public', 'index.html')}`);
console.log('2. Modo servidor local:');
console.log('   node server.js');
console.log('   http://localhost:3001');
console.log('3. Test de autenticación:');
console.log(`   file://${path.join(process.cwd(), 'test_auth.html')}`);

console.log('\n✅ Verificación completada'); 