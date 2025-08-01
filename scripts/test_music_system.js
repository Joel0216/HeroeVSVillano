// Script de prueba para el sistema de música
import fs from 'fs';
import path from 'path';

console.log('🧪 Probando sistema de música...');

// Verificar que existe el directorio de datos
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('✅ Directorio de datos creado');
}

// Verificar que existe el directorio de uploads
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Directorio de uploads creado');
}

// Verificar que existe el directorio de música
const musicDir = path.join(uploadsDir, 'music');
if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir, { recursive: true });
  console.log('✅ Directorio de música creado');
}

// Verificar que existe el directorio de imágenes
const imagesDir = path.join(uploadsDir, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Directorio de imágenes creado');
}

// Crear archivo de configuración de música de ejemplo
const musicConfigPath = path.join(dataDir, 'music-config.json');
const exampleConfig = {
  lobbyMusic: null,
  battleMusic: null,
  lobbyMusicName: null,
  battleMusicName: null,
  updatedAt: new Date().toISOString(),
  updatedBy: 'system'
};

if (!fs.existsSync(musicConfigPath)) {
  fs.writeFileSync(musicConfigPath, JSON.stringify(exampleConfig, null, 2));
  console.log('✅ Archivo de configuración de música creado');
}

console.log('🎵 Sistema de música listo para usar');
console.log('📁 Directorios creados:');
console.log(`   - ${dataDir}`);
console.log(`   - ${uploadsDir}`);
console.log(`   - ${musicDir}`);
console.log(`   - ${imagesDir}`);
console.log(`   - ${musicConfigPath}`);

console.log('\n🎯 Para probar el sistema:');
console.log('1. Inicia el servidor: node app.js');
console.log('2. Accede como administrador');
console.log('3. Sube archivos de música en el panel de admin');
console.log('4. Verifica que la música se reproduzca automáticamente'); 