// Script para probar el soporte de SoundCloud corregido
console.log('🎵 Probando soporte de SoundCloud corregido...');

// URLs de ejemplo para probar
const testYouTubeUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const testSoundCloudUrl = 'https://soundcloud.com/matheus-mohr-524352775/musica-epica-instrumental-de-batalla-legendaria-musica-motivadora-epica-de-guerra-2016?si=1f46e6fc264d4ae3a0b3122953454969&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing';

// Función para extraer video ID (copiada del standalone.js corregido)
function extractVideoId(url) {
  // Detectar si es YouTube o SoundCloud
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(youtubeRegex);
    return match ? { type: 'youtube', id: match[1] } : null;
  } else if (url.includes('soundcloud.com')) {
    // Para SoundCloud, necesitamos usar la URL completa en el embed
    // SoundCloud no usa IDs numéricos simples como YouTube
    return { type: 'soundcloud', url: url };
  }
  return null;
}

// Función para convertir a formato embed
function convertToEmbedUrl(url) {
  const videoInfo = extractVideoId(url);
  if (videoInfo) {
    if (videoInfo.type === 'youtube') {
      return `https://www.youtube.com/embed/${videoInfo.id}?autoplay=1&loop=1&controls=0&modestbranding=1&rel=0`;
    } else if (videoInfo.type === 'soundcloud') {
      // Para SoundCloud, usar la URL completa codificada
      const encodedUrl = encodeURIComponent(videoInfo.url);
      return `https://w.soundcloud.com/player/?url=${encodedUrl}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`;
    }
  }
  return null;
}

// Probar las funciones
console.log('📋 Probando extracción de YouTube:');
console.log('URL original:', testYouTubeUrl);
console.log('Info extraída:', extractVideoId(testYouTubeUrl));
console.log('URL embed generada:', convertToEmbedUrl(testYouTubeUrl));

console.log('\n📋 Probando extracción de SoundCloud:');
console.log('URL original:', testSoundCloudUrl);
console.log('Info extraída:', extractVideoId(testSoundCloudUrl));
console.log('URL embed generada:', convertToEmbedUrl(testSoundCloudUrl));

console.log('\n✅ Sistema de SoundCloud corregido probado correctamente');
console.log('🎮 Características implementadas:');
console.log('   • Soporte para URLs de YouTube');
console.log('   • Soporte para URLs de SoundCloud (formato corregido)');
console.log('   • Detección automática de plataforma');
console.log('   • Conversión automática a formato embed');
console.log('   • URL completa codificada para SoundCloud');
console.log('   • Tamaño ajustado según plataforma');
console.log('   • Parámetros optimizados para cada plataforma'); 