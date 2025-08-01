# 🔊 Sistema de Sonidos Especiales

## 📋 Resumen

Se ha implementado un sistema completo para gestionar sonidos especiales de héroes y villanos en el juego. Ahora cada personaje puede tener su propio sonido personalizado que se reproduce durante sus ataques especiales.

## ✨ Nuevas Funcionalidades

### 1. **Panel de Administración de Sonidos**
- **Sección dedicada**: "Configuración de Sonidos Especiales"
- **Gestión por personaje**: Selección individual de héroes y villanos
- **Acciones disponibles**: Adjuntar, Editar, Eliminar, Probar sonidos

### 2. **Sistema de Carga de Archivos**
- **Formatos soportados**: MP3, WAV, OGG
- **Validación automática**: Verificación de tipo de archivo
- **Previsualización**: Reproductor de audio integrado
- **Información detallada**: Nombre, tamaño, estado del archivo

### 3. **Gestión Completa de Sonidos**
- **Adjuntar**: Cargar nuevo sonido para un personaje
- **Editar**: Cambiar sonido existente
- **Eliminar**: Remover sonido del personaje
- **Probar**: Reproducir sonido para verificar

## 🎮 Cómo Usar

### **Para Administradores:**

#### **Configurar Sonidos Especiales:**
1. Accede como admin al juego
2. Ve a la sección "🔊 Configuración de Sonidos Especiales"
3. Selecciona un héroe o villano del menú desplegable
4. Haz clic en "🔊 Adjuntar Sonido"
5. Selecciona un archivo de audio (MP3, WAV, OGG)
6. El sistema validará y cargará el archivo
7. Usa "▶️ Probar Sonido" para verificar

#### **Editar Sonidos Existentes:**
1. Selecciona un personaje que ya tenga sonido
2. Haz clic en "✏️ Editar Sonido"
3. Selecciona el nuevo archivo de audio
4. El sistema actualizará automáticamente

#### **Eliminar Sonidos:**
1. Selecciona un personaje con sonido configurado
2. Haz clic en "🗑️ Eliminar Sonido"
3. El sonido se removerá del personaje

#### **Probar Sonidos:**
1. Selecciona cualquier personaje con sonido
2. Haz clic en "▶️ Probar Sonido Héroe/Villano"
3. El sonido se reproducirá inmediatamente
4. Usa "⏹️ Detener Sonidos" para parar

### **Para Usuarios:**
- Los ataques especiales ahora reproducen los sonidos personalizados
- Si no hay sonido configurado, el ataque especial es silencioso
- Los sonidos se reproducen automáticamente durante la animación

## 🛠️ Características Técnicas

### **Sistema de Archivos:**
- **Almacenamiento**: URLs blob en localStorage
- **Validación**: Verificación de tipo MIME
- **Tamaño**: Sin límite específico (depende del navegador)
- **Formatos**: MP3, WAV, OGG

### **Gestión de Estado:**
- **Variables globales**: `heroSoundFiles`, `villainSoundFiles`
- **Reproducción actual**: `currentSpecialSound`
- **Persistencia**: localStorage para URLs

### **Interfaz de Usuario:**
- **Selects dinámicos**: Carga automática de personajes
- **Estados visuales**: Indicadores de sonido configurado
- **Controles intuitivos**: Botones con iconos descriptivos

## 📝 Código de Ejemplo

### **Cargar Sonido de Héroe:**
```javascript
function handleHeroSoundUpload(event) {
  const file = event.target.files[0];
  const heroSelect = document.getElementById('hero-sound-select');
  const selectedHeroId = heroSelect.value;
  
  if (file && (file.type === 'audio/mpeg' || file.type === 'audio/wav' || file.type === 'audio/ogg')) {
    heroSoundFiles[selectedHeroId] = file;
    updateHeroSound(selectedHeroId, URL.createObjectURL(file));
    showMessage('Sonido especial de héroe cargado exitosamente', 'success');
  }
}
```

### **Probar Sonido:**
```javascript
function testHeroSound() {
  const heroSelect = document.getElementById('hero-sound-select');
  const selectedHeroId = heroSelect.value;
  const file = heroSoundFiles[selectedHeroId];
  
  if (file) {
    stopSpecialSounds();
    currentSpecialSound = new Audio(URL.createObjectURL(file));
    currentSpecialSound.volume = 0.7;
    currentSpecialSound.play();
  }
}
```

### **Actualizar en localStorage:**
```javascript
function updateHeroSound(heroId, soundUrl) {
  const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
  const heroIndex = heroes.findIndex(h => h.heroId === heroId);
  
  if (heroIndex !== -1) {
    heroes[heroIndex].specialAttackSoundUrl = soundUrl;
    localStorage.setItem('heroes', JSON.stringify(heroes));
  }
}
```

## 🧪 Pruebas

### **Script de Prueba:**
```bash
node scripts/testSoundSystem.js
```

Este script simula todas las operaciones del sistema de sonidos especiales para verificar que funciona correctamente.

## 🔗 Integración con el Juego

### **Durante Ataques Especiales:**
```javascript
function showDynamicSpecialAnimation(character, characterIndex, type) {
  // ... código de animación ...
  
  // Reproducir sonido si está disponible
  if (character.specialAttackSoundUrl) {
    try {
      const audio = new Audio(character.specialAttackSoundUrl);
      audio.play().catch(error => {
        console.log('No se pudo reproducir el sonido:', error);
      });
    } catch (error) {
      console.log('Error al cargar el sonido:', error);
    }
  }
}
```

## 📊 Estados del Sistema

### **Sin Sonido Configurado:**
- ❌ Indicador rojo
- "Sin sonido especial configurado"
- Botones de editar/eliminar ocultos

### **Con Sonido Configurado:**
- ✅ Indicador verde
- Información del archivo
- Reproductor de audio visible
- Botones de editar/eliminar visibles

## 🎯 Beneficios

1. **Personalización**: Cada personaje tiene su sonido único
2. **Inmersión**: Mayor realismo en las batallas
3. **Flexibilidad**: Fácil gestión de sonidos
4. **Validación**: Sistema robusto de verificación
5. **Persistencia**: Los sonidos se mantienen entre sesiones

## 🔄 Flujo de Trabajo

1. **Configuración inicial**: Admin carga sonidos para personajes
2. **Durante el juego**: Los sonidos se reproducen automáticamente
3. **Mantenimiento**: Edición/eliminación según necesidades
4. **Pruebas**: Verificación de funcionamiento

## 🚀 Próximas Mejoras

- **Volumen individual**: Control de volumen por personaje
- **Efectos de sonido**: Diferentes tipos de efectos
- **Sincronización**: Mejor sincronización con animaciones
- **Biblioteca**: Catálogo de sonidos predefinidos 