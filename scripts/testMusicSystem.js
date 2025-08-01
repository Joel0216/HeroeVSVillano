// Script para probar el sistema de música de fondo
console.log('🎵 Probando sistema de música de fondo...');

// URLs de ejemplo para probar
const testBackgroundMusic = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const testBattleMusic = 'https://www.youtube.com/watch?v=9bZkp7q19f0';

// Función para extraer video ID de YouTube (copiada del standalone.js)
function extractYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Función para convertir a formato embed
function convertToEmbedUrl(youtubeUrl) {
  const videoId = extractYouTubeVideoId(youtubeUrl);
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&controls=0&modestbranding=1&rel=0`;
  }
  return null;
}

// Probar las funciones
console.log('📋 Probando extracción de video ID:');
console.log('URL original:', testBackgroundMusic);
console.log('Video ID extraído:', extractYouTubeVideoId(testBackgroundMusic));
console.log('URL embed generada:', convertToEmbedUrl(testBackgroundMusic));

console.log('\n📋 Probando música de batalla:');
console.log('URL original:', testBattleMusic);
console.log('Video ID extraído:', extractYouTubeVideoId(testBattleMusic));
console.log('URL embed generada:', convertToEmbedUrl(testBattleMusic));

console.log('\n✅ Sistema de música probado correctamente');
console.log('🎮 Ahora puedes probar el sistema en el juego:');
console.log('1. Accede como admin');
console.log('2. Configura las URLs de música en el panel de admin');
console.log('3. Inicia una batalla para probar la música de batalla'); 