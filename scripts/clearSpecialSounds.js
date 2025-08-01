// Script para limpiar datos de sonidos especiales del localStorage
// Este script elimina todas las referencias a sonidos especiales que ya no se usan

console.log('🧹 Iniciando limpieza de datos de sonidos especiales...');

// Obtener todos los héroes y villanos
const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
const villains = JSON.parse(localStorage.getItem('villains') || '[]');

let cleanedCount = 0;

// Limpiar sonidos especiales de héroes
heroes.forEach(hero => {
  const soundKey = `heroSound_${hero.heroId}`;
  if (localStorage.getItem(soundKey)) {
    localStorage.removeItem(soundKey);
    console.log(`🗑️ Eliminado sonido especial de héroe: ${hero.name}`);
    cleanedCount++;
  }
});

// Limpiar sonidos especiales de villanos
villains.forEach(villain => {
  const soundKey = `villainSound_${villain.villainId}`;
  if (localStorage.getItem(soundKey)) {
    localStorage.removeItem(soundKey);
    console.log(`🗑️ Eliminado sonido especial de villano: ${villain.name}`);
    cleanedCount++;
  }
});

// Eliminar otros datos relacionados con sonidos especiales
const specialSoundKeys = [
  'testHeroSound',
  'testVillainSound',
  'currentSpecialSound'
];

specialSoundKeys.forEach(key => {
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
    console.log(`🗑️ Eliminado dato de sonido especial: ${key}`);
    cleanedCount++;
  }
});

console.log(`✅ Limpieza completada. ${cleanedCount} elementos eliminados.`);
console.log('🎵 Los datos de música de lobby y batalla se mantienen intactos.'); 