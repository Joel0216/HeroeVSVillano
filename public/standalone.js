// standalone.js - Versión completamente independiente

// Detectar si estamos en modo servidor o archivo local
const isServerMode = window.location.protocol === 'http:' || window.location.protocol === 'https:';
const baseUrl = isServerMode ? '' : 'http://localhost:3001';

console.log(`🎵 Modo de operación: ${isServerMode ? 'Servidor' : 'Archivo local'}`);
console.log(`🌐 URL base: ${baseUrl}`);

// Configuración de almacenamiento
const STORAGE_CONFIG = {
  maxFileSize: 12 * 1024 * 1024, // 12MB
  maxTotalSize: 24 * 1024 * 1024, // 24MB total (2 archivos de 12MB cada uno)
  dbName: 'DataFightMusicDB',
  dbVersion: 1,
  storeName: 'musicFiles'
};

// Sistema de IndexedDB para archivos grandes
class MusicStorageManager {
  constructor() {
    this.db = null;
    this.isIndexedDBSupported = 'indexedDB' in window;
  }

  async initDB() {
    if (!this.isIndexedDBSupported) {
      console.warn('IndexedDB no soportado, usando localStorage');
      return false;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(STORAGE_CONFIG.dbName, STORAGE_CONFIG.dbVersion);
      
      request.onerror = () => {
        console.error('Error al abrir IndexedDB:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB inicializado correctamente');
        resolve(true);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORAGE_CONFIG.storeName)) {
          const store = db.createObjectStore(STORAGE_CONFIG.storeName, { keyPath: 'id' });
          console.log('✅ ObjectStore creado:', STORAGE_CONFIG.storeName);
        }
      };
    });
  }

  async saveMusicFile(fileType, file, dataUrl) {
    try {
      if (this.isIndexedDBSupported && await this.initDB()) {
        // Usar IndexedDB para archivos grandes
        return await this.saveToIndexedDB(fileType, file, dataUrl);
      } else {
        // Fallback a localStorage para archivos pequeños
        return this.saveToLocalStorage(fileType, file, dataUrl);
      }
    } catch (error) {
      console.error('Error al guardar archivo de música:', error);
      throw error;
    }
  }

  async saveToIndexedDB(fileType, file, dataUrl) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORAGE_CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(STORAGE_CONFIG.storeName);
      
      const musicData = {
        id: fileType,
        name: file.name,
        size: file.size,
        type: file.type,
        dataUrl: dataUrl,
        timestamp: new Date().toISOString()
      };
      
      const request = store.put(musicData);
      
      request.onsuccess = () => {
        console.log(`✅ ${fileType} guardado en IndexedDB`);
        resolve(musicData);
      };
      
      request.onerror = () => {
        console.error('Error al guardar en IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  saveToLocalStorage(fileType, file, dataUrl) {
    try {
      localStorage.setItem(`${fileType}File`, dataUrl);
      localStorage.setItem(`${fileType}Name`, file.name);
      localStorage.setItem(`${fileType}Size`, file.size);
      console.log(`✅ ${fileType} guardado en localStorage`);
      return { name: file.name, size: file.size };
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
      throw error;
    }
  }

  async getMusicFile(fileType) {
    try {
      if (this.isIndexedDBSupported && await this.initDB()) {
        return await this.getFromIndexedDB(fileType);
      } else {
        return this.getFromLocalStorage(fileType);
      }
    } catch (error) {
      console.error('Error al obtener archivo de música:', error);
      return null;
    }
  }

  async getFromIndexedDB(fileType) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORAGE_CONFIG.storeName], 'readonly');
      const store = transaction.objectStore(STORAGE_CONFIG.storeName);
      const request = store.get(fileType);
      
      request.onsuccess = () => {
        if (request.result) {
          console.log(`✅ ${fileType} cargado desde IndexedDB`);
          resolve(request.result);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => {
        console.error('Error al obtener de IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  getFromLocalStorage(fileType) {
    try {
      const dataUrl = localStorage.getItem(`${fileType}File`);
      const name = localStorage.getItem(`${fileType}Name`);
      const size = localStorage.getItem(`${fileType}Size`);
      
      if (dataUrl && name && size) {
        console.log(`✅ ${fileType} cargado desde localStorage`);
        return { dataUrl, name, size: parseInt(size) };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener de localStorage:', error);
      return null;
    }
  }

  async removeMusicFile(fileType) {
    try {
      if (this.isIndexedDBSupported && await this.initDB()) {
        return await this.removeFromIndexedDB(fileType);
      } else {
        return this.removeFromLocalStorage(fileType);
      }
    } catch (error) {
      console.error('Error al eliminar archivo de música:', error);
      throw error;
    }
  }

  async removeFromIndexedDB(fileType) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORAGE_CONFIG.storeName], 'readwrite');
      const store = transaction.objectStore(STORAGE_CONFIG.storeName);
      const request = store.delete(fileType);
      
      request.onsuccess = () => {
        console.log(`🗑️ ${fileType} eliminado de IndexedDB`);
        resolve(true);
      };
      
      request.onerror = () => {
        console.error('Error al eliminar de IndexedDB:', request.error);
        reject(request.error);
      };
    });
  }

  removeFromLocalStorage(fileType) {
    try {
      localStorage.removeItem(`${fileType}File`);
      localStorage.removeItem(`${fileType}Name`);
      localStorage.removeItem(`${fileType}Size`);
      console.log(`🗑️ ${fileType} eliminado de localStorage`);
      return true;
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
      throw error;
    }
  }

  async getTotalStorageSize() {
    try {
      if (this.isIndexedDBSupported && await this.initDB()) {
        return await this.getIndexedDBSize();
      } else {
        return this.getLocalStorageSize();
      }
    } catch (error) {
      console.error('Error al obtener tamaño de almacenamiento:', error);
      return 0;
    }
  }

  async getIndexedDBSize() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORAGE_CONFIG.storeName], 'readonly');
      const store = transaction.objectStore(STORAGE_CONFIG.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => {
        const totalSize = request.result.reduce((sum, item) => sum + (item.size || 0), 0);
        resolve(totalSize);
      };
      
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  getLocalStorageSize() {
    try {
      const lobbySize = parseInt(localStorage.getItem('lobbyMusicSize') || '0');
      const battleSize = parseInt(localStorage.getItem('battleMusicSize') || '0');
      return lobbySize + battleSize;
    } catch (error) {
      console.error('Error al calcular tamaño de localStorage:', error);
      return 0;
    }
  }
}

// Instancia global del gestor de almacenamiento
const musicStorage = new MusicStorageManager();

// Datos iniciales almacenados en localStorage
const initializeData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      {
        id: 'admin_001',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        userId: 'ADMIN_001'
      }
    ]));
  }
  
  if (!localStorage.getItem('heroes')) {
    localStorage.setItem('heroes', JSON.stringify([
      {
        heroId: 'HERO_001',
        name: 'Tony Stark',
        alias: 'Iron Man',
        city: 'Malibu',
        team: 'Los Vengadores',
        image: 'https://mediaproxy.tvtropes.org/width/1200/https://static.tvtropes.org/pmwiki/pub/images/invincible_iron_man_vol_3_1_fried_pie_exclusive_variant_textless.jpg',
        specialAttackAnimationUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      },
      {
        heroId: 'HERO_002',
        name: 'Peter Parker',
        alias: 'Spider-Man',
        city: 'Nueva York',
        team: 'Los Vengadores',
        image: 'https://i.etsystatic.com/42415510/r/il',
        specialAttackAnimationUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      },
      {
        heroId: 'HERO_003',
        name: 'Steve Rogers',
        alias: 'Captain America',
        city: 'Brooklyn',
        team: 'Los Vengadores',
        image: '', // Imagen local por defecto
        specialAttackAnimationUrl: '',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      }
    ]));
  }
  
  if (!localStorage.getItem('villains')) {
    localStorage.setItem('villains', JSON.stringify([
      {
        villainId: 'VILLAIN_001',
        name: 'Thanos',
        alias: 'The Mad Titan',
        city: 'Titan',
        team: 'Los Black Order',
        image: '', // Imagen local por defecto
        specialAttackAnimationUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      },
      {
        villainId: 'VILLAIN_002',
        name: 'Loki',
        alias: 'Loki Laufeyson',
        city: 'Asgard',
        team: 'Independiente',
        image: '', // Imagen local por defecto
        specialAttackAnimationUrl: '',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      },
      {
        villainId: 'VILLAIN_003',
        name: 'Eddie Brock',
        alias: 'Venom',
        city: 'San Francisco',
        team: 'Independiente',
        image: '', // Imagen local por defecto
        specialAttackAnimationUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      }
    ]));
  }
};

// Inicializar datos
initializeData();

// Función para generar imagen SVG por defecto
function getImageWithFallback(imageUrl, characterName, characterType = 'hero') {
  if (!imageUrl || imageUrl.trim() === '') {
    const color = characterType === 'hero' ? '#3b82f6' : '#ef4444';
    const fallbackImage = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}"/>
        <text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">${characterName}</text>
      </svg>
    `)}`;
    return fallbackImage;
  }
  return imageUrl;
}

// Función para crear elemento de imagen con fallback
function createImageElement(imageUrl, altText, className = '') {
  const fallbackImage = `data:image/svg+xml;base64,${btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="#6b7280"/>
      <text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">Sin imagen</text>
    </svg>
  `)}`;
  return `<img src="${imageUrl}" alt="${altText}" class="${className}" onerror="this.src='${fallbackImage}'">`;
}

// Variables globales para música
let lobbyMusicFile = null;
let battleMusicFile = null;
let currentAudio = null;
let currentMusicType = null;
let musicInitialized = false;
let isMusicEnabled = true;
let isMusicMuted = false;
let isMusicPaused = false;

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-toast ${type}`;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 3000);
}

// Navegación básica
function showScreen(screen) {
  [landing, auth, adminPanel, characterSelection, teamsConfirmed, battleScreen].forEach(div => {
    if (div) div.classList.add('hidden');
  });
  if (screen) screen.classList.remove('hidden');
  
  // Inicializar música si no se ha hecho antes
  if (!musicInitialized) {
    initializeMusic();
  }
  
  // Reproducir música de lobby automáticamente en pantallas de lobby
  if (screen === landing || screen === characterSelection || screen === adminPanel) {
    if (currentMusicType !== 'lobby' && lobbyMusicFile) {
      setTimeout(() => {
        playLobbyMusic();
      }, 300);
    }
  }
}

// Mostrar panel de administración
function showAdminPanel() {
  showScreen(adminPanel);
  renderAdminPanel();
  
  // Cargar configuración de música
  loadMusicConfig();
  
  // Asegurar que la música de lobby esté reproduciéndose
  if (currentMusicType !== 'lobby' && lobbyMusicFile) {
    setTimeout(() => {
      playLobbyMusic();
    }, 300);
  }
}

// Mostrar pantalla de batalla
function showBattleScreen() {
  showScreen(battleScreen);
  renderBattleScreen();
  
  // Cambiar automáticamente a música de batalla
  if (currentMusicType !== 'battle') {
    stopMusic();
    setTimeout(() => {
      if (battleMusicFile) {
        playBattleMusic();
      }
    }, 300);
  }
}

// Sistema de música mejorado que funciona con y sin servidor
async function handleLobbyMusicUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    showMessage('Por favor selecciona un archivo de música', 'error');
    return;
  }

  // Validar tipo de archivo
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/m4a'];
  if (!allowedTypes.includes(file.type)) {
    showMessage('Solo se permiten archivos de audio (MP3, WAV, OGG, M4A)', 'error');
    return;
  }

  // Validar tamaño (12MB máximo)
  if (file.size > STORAGE_CONFIG.maxFileSize) {
    showMessage(`El archivo es demasiado grande. Máximo ${STORAGE_CONFIG.maxFileSize / (1024 * 1024)}MB`, 'error');
    return;
  }

  try {
    if (isServerMode) {
      // Modo servidor: subir al backend
      const formData = new FormData();
      formData.append('lobbyMusic', file);

      const response = await fetch('/api/music/lobby', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('🎵 Música de lobby guardada correctamente', 'success');
        lobbyMusicFile = result.musicPath;
        updateMusicInterface({ lobbyMusicName: result.fileName, lobbyMusicSize: file.size });
      } else {
        showMessage(result.error || 'Error al guardar música de lobby', 'error');
        return;
      }
    } else {
      // Modo archivo local: usar nuevo sistema de almacenamiento
      const reader = new FileReader();
      
      reader.onload = async function(e) {
        try {
          const dataUrl = e.target.result;
          
          // Verificar espacio total disponible
          const currentSize = await musicStorage.getTotalStorageSize();
          const newTotalSize = currentSize + file.size;
          
          if (newTotalSize > STORAGE_CONFIG.maxTotalSize) {
            showMessage(`No hay suficiente espacio. Espacio usado: ${(currentSize / (1024 * 1024)).toFixed(2)}MB. Límite: ${STORAGE_CONFIG.maxTotalSize / (1024 * 1024)}MB`, 'error');
            return;
          }
          
          // Guardar usando el nuevo sistema
          await musicStorage.saveMusicFile('lobby', file, dataUrl);
          
          // Usar directamente la data URL para reproducción
          lobbyMusicFile = dataUrl;
          
          showMessage('🎵 Música de lobby guardada correctamente', 'success');
          updateMusicInterface({ lobbyMusicName: file.name, lobbyMusicSize: file.size });
          
          // Reproducir automáticamente si estamos en una pantalla de lobby
          if (currentMusicType !== 'battle') {
            setTimeout(() => {
              playLobbyMusic();
            }, 500);
          }
        } catch (error) {
          console.error('Error al procesar archivo:', error);
          if (error.name === 'QuotaExceededError') {
            showMessage('El archivo es demasiado grande para el almacenamiento local. Usa un archivo más pequeño o activa el modo servidor.', 'error');
          } else {
            showMessage('Error al procesar el archivo de música', 'error');
          }
        }
      };
      
      reader.onerror = function() {
        showMessage('Error al leer el archivo de música', 'error');
      };
      
      reader.readAsDataURL(file);
    }
  } catch (error) {
    console.error('Error al subir música de lobby:', error);
    showMessage('Error al subir música de lobby', 'error');
  }
}

async function handleBattleMusicUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    showMessage('Por favor selecciona un archivo de música', 'error');
    return;
  }

  // Validar tipo de archivo
  const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/m4a'];
  if (!allowedTypes.includes(file.type)) {
    showMessage('Solo se permiten archivos de audio (MP3, WAV, OGG, M4A)', 'error');
    return;
  }

  // Validar tamaño (12MB máximo)
  if (file.size > STORAGE_CONFIG.maxFileSize) {
    showMessage(`El archivo es demasiado grande. Máximo ${STORAGE_CONFIG.maxFileSize / (1024 * 1024)}MB`, 'error');
    return;
  }

  try {
    if (isServerMode) {
      // Modo servidor: subir al backend
      const formData = new FormData();
      formData.append('battleMusic', file);

      const response = await fetch('/api/music/battle', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        showMessage('🎵 Música de batalla guardada correctamente', 'success');
        battleMusicFile = result.musicPath;
        updateMusicInterface({ battleMusicName: result.fileName, battleMusicSize: file.size });
      } else {
        showMessage(result.error || 'Error al guardar música de batalla', 'error');
        return;
      }
    } else {
      // Modo archivo local: usar nuevo sistema de almacenamiento
      const reader = new FileReader();
      
      reader.onload = async function(e) {
        try {
          const dataUrl = e.target.result;
          
          // Verificar espacio total disponible
          const currentSize = await musicStorage.getTotalStorageSize();
          const newTotalSize = currentSize + file.size;
          
          if (newTotalSize > STORAGE_CONFIG.maxTotalSize) {
            showMessage(`No hay suficiente espacio. Espacio usado: ${(currentSize / (1024 * 1024)).toFixed(2)}MB. Límite: ${STORAGE_CONFIG.maxTotalSize / (1024 * 1024)}MB`, 'error');
            return;
          }
          
          // Guardar usando el nuevo sistema
          await musicStorage.saveMusicFile('battle', file, dataUrl);
          
          // Usar directamente la data URL para reproducción
          battleMusicFile = dataUrl;
          
          showMessage('🎵 Música de batalla guardada correctamente', 'success');
          updateMusicInterface({ battleMusicName: file.name, battleMusicSize: file.size });
        } catch (error) {
          console.error('Error al procesar archivo:', error);
          if (error.name === 'QuotaExceededError') {
            showMessage('El archivo es demasiado grande para el almacenamiento local. Usa un archivo más pequeño o activa el modo servidor.', 'error');
          } else {
            showMessage('Error al procesar el archivo de música', 'error');
          }
        }
      };
      
      reader.onerror = function() {
        showMessage('Error al leer el archivo de música', 'error');
      };
      
      reader.readAsDataURL(file);
    }
  } catch (error) {
    console.error('Error al subir música de batalla:', error);
    showMessage('Error al subir música de batalla', 'error');
  }
}

async function loadMusicConfig() {
  try {
    if (isServerMode) {
      // Modo servidor: cargar desde API
      const response = await fetch('/api/music/config');
      const config = await response.json();
      
      if (config.lobbyMusic) {
        lobbyMusicFile = config.lobbyMusic;
      }
      
      if (config.battleMusic) {
        battleMusicFile = config.battleMusic;
      }
      
      updateMusicInterface(config);
    } else {
      // Modo archivo local: cargar desde nuevo sistema de almacenamiento
      const lobbyData = await musicStorage.getMusicFile('lobby');
      const battleData = await musicStorage.getMusicFile('battle');
      
      if (lobbyData) {
        lobbyMusicFile = lobbyData.dataUrl;
      }
      
      if (battleData) {
        battleMusicFile = battleData.dataUrl;
      }
      
      const config = {
        lobbyMusicName: lobbyData?.name || null,
        battleMusicName: battleData?.name || null,
        lobbyMusicSize: lobbyData?.size || null,
        battleMusicSize: battleData?.size || null
      };
      
      updateMusicInterface(config);
    }
    
    console.log('🎵 Configuración de música cargada');
  } catch (error) {
    console.error('Error al cargar configuración de música:', error);
  }
}

// Función para limpiar localStorage de música (actualizada)
async function clearMusicStorage() {
  try {
    // Limpiar usando el nuevo sistema
    await musicStorage.removeMusicFile('lobby');
    await musicStorage.removeMusicFile('battle');
    
    // También limpiar localStorage por compatibilidad
    localStorage.removeItem('lobbyMusicFile');
    localStorage.removeItem('lobbyMusicName');
    localStorage.removeItem('lobbyMusicSize');
    localStorage.removeItem('battleMusicFile');
    localStorage.removeItem('battleMusicName');
    localStorage.removeItem('battleMusicSize');
    
    console.log('🗑️ Almacenamiento de música limpiado completamente');
    showMessage('🗑️ Almacenamiento de música limpiado', 'success');
    
    // Actualizar interfaz
    updateMusicInterface({ 
      lobbyMusicName: null, 
      lobbyMusicSize: null,
      battleMusicName: null,
      battleMusicSize: null
    });
  } catch (error) {
    console.error('Error al limpiar almacenamiento de música:', error);
    showMessage('Error al limpiar almacenamiento', 'error');
  }
}

// Función para obtener información del modo de almacenamiento (actualizada)
function getStorageInfo() {
  if (isServerMode) {
    return {
      mode: 'Servidor',
      description: 'Los archivos se guardan en el servidor',
      maxSize: '10MB',
      icon: '🌐'
    };
  } else {
    const storageType = musicStorage.isIndexedDBSupported ? 'IndexedDB' : 'localStorage';
    return {
      mode: 'Local',
      description: `Los archivos se guardan en ${storageType} (máximo 12MB por archivo)`,
      maxSize: '12MB',
      totalSize: '24MB',
      icon: '💾'
    };
  }
}

function updateMusicInterface(config) {
  const storageInfo = getStorageInfo();
  
  // Actualizar información de música de lobby
  const lobbyInfo = document.getElementById('lobby-music-info');
  const lobbyPreview = document.getElementById('lobby-music-preview');
  const lobbyRemoveBtn = document.getElementById('remove-lobby-music');
  
  if (lobbyInfo) {
    if (config.lobbyMusicName) {
      const size = config.lobbyMusicSize ? (config.lobbyMusicSize / 1024 / 1024).toFixed(2) : '0';
      lobbyInfo.innerHTML = `✅ ${config.lobbyMusicName} (${size} MB)`;
      if (lobbyRemoveBtn) lobbyRemoveBtn.classList.remove('hidden');
    } else {
      lobbyInfo.innerHTML = `⚠️ No hay música configurada`;
      if (lobbyRemoveBtn) lobbyRemoveBtn.classList.add('hidden');
    }
  }
  
  if (lobbyPreview && lobbyMusicFile) {
    lobbyPreview.innerHTML = `
      <audio controls class="w-full mt-2">
        <source src="${lobbyMusicFile}" type="audio/mpeg">
      </audio>
    `;
  }
  
  // Actualizar información de música de batalla
  const battleInfo = document.getElementById('battle-music-info');
  const battlePreview = document.getElementById('battle-music-preview');
  const battleRemoveBtn = document.getElementById('remove-battle-music');
  
  if (battleInfo) {
    if (config.battleMusicName) {
      const size = config.battleMusicSize ? (config.battleMusicSize / 1024 / 1024).toFixed(2) : '0';
      battleInfo.innerHTML = `✅ ${config.battleMusicName} (${size} MB)`;
      if (battleRemoveBtn) battleRemoveBtn.classList.remove('hidden');
    } else {
      battleInfo.innerHTML = `⚠️ No hay música configurada`;
      if (battleRemoveBtn) battleRemoveBtn.classList.add('hidden');
    }
  }
  
  if (battlePreview && battleMusicFile) {
    battlePreview.innerHTML = `
      <audio controls class="w-full mt-2">
        <source src="${battleMusicFile}" type="audio/mpeg">
      </audio>
    `;
  }
  
  // Agregar información del modo de almacenamiento
  const storageInfoElement = document.getElementById('storage-info');
  if (storageInfoElement) {
    storageInfoElement.innerHTML = `
      <div class="bg-blue-50 p-3 rounded-lg mb-4">
        <div class="flex items-center gap-2">
          <span class="text-lg">${storageInfo.icon}</span>
          <div>
            <div class="font-semibold">Modo: ${storageInfo.mode}</div>
            <div class="text-sm text-gray-600">${storageInfo.description}</div>
            <div class="text-sm text-gray-600">Tamaño máximo por archivo: ${storageInfo.maxSize}</div>
            ${storageInfo.totalSize ? `<div class="text-sm text-gray-600">Tamaño total disponible: ${storageInfo.totalSize}</div>` : ''}
          </div>
        </div>
        ${!isServerMode ? `
          <button onclick="clearMusicStorage()" class="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
            🗑️ Limpiar almacenamiento
          </button>
        ` : ''}
      </div>
    `;
  }
}

function playLobbyMusic() {
  if (lobbyMusicFile && isMusicEnabled) {
    stopMusic();
    currentAudio = new Audio(lobbyMusicFile);
    currentAudio.loop = true;
    currentAudio.volume = 0.5;
    currentMusicType = 'lobby';
    currentAudio.play().catch(error => {
      console.error('Error al reproducir música de lobby:', error);
    });
  }
}

function playBattleMusic() {
  if (battleMusicFile && isMusicEnabled) {
    stopMusic();
    currentAudio = new Audio(battleMusicFile);
    currentAudio.loop = true;
    currentAudio.volume = 0.5;
    currentMusicType = 'battle';
    currentAudio.play().catch(error => {
      console.error('Error al reproducir música de batalla:', error);
    });
  }
}

function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    currentMusicType = null;
  }
}

function toggleBattleMusic() {
  if (currentMusicType === 'battle') {
    stopMusic();
  } else {
    playBattleMusic();
  }
}

function toggleLobbyMusic() {
  if (currentMusicType === 'lobby') {
    stopMusic();
  } else {
    playLobbyMusic();
  }
}

async function removeLobbyMusic() {
  try {
    if (isServerMode) {
      const response = await fetch('/api/music/lobby', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showMessage('🗑️ Música de lobby eliminada', 'success');
        lobbyMusicFile = null;
        updateMusicInterface({ lobbyMusicName: null, lobbyMusicSize: null });
      } else {
        showMessage('Error al eliminar música de lobby', 'error');
      }
    } else {
      // Modo archivo local: usar nuevo sistema de almacenamiento
      await musicStorage.removeMusicFile('lobby');
      
      lobbyMusicFile = null;
      
      showMessage('🗑️ Música de lobby eliminada', 'success');
      updateMusicInterface({ lobbyMusicName: null, lobbyMusicSize: null });
    }
    
    // Detener música si está reproduciéndose
    if (currentMusicType === 'lobby') {
      stopMusic();
    }
  } catch (error) {
    console.error('Error al eliminar música de lobby:', error);
    showMessage('Error al eliminar música de lobby', 'error');
  }
}

async function removeBattleMusic() {
  try {
    if (isServerMode) {
      const response = await fetch('/api/music/battle', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        showMessage('🗑️ Música de batalla eliminada', 'success');
        battleMusicFile = null;
        updateMusicInterface({ battleMusicName: null, battleMusicSize: null });
      } else {
        showMessage('Error al eliminar música de batalla', 'error');
      }
    } else {
      // Modo archivo local: usar nuevo sistema de almacenamiento
      await musicStorage.removeMusicFile('battle');
      
      battleMusicFile = null;
      
      showMessage('🗑️ Música de batalla eliminada', 'success');
      updateMusicInterface({ battleMusicName: null, battleMusicSize: null });
    }
    
    // Detener música si está reproduciéndose
    if (currentMusicType === 'battle') {
      stopMusic();
    }
  } catch (error) {
    console.error('Error al eliminar música de batalla:', error);
    showMessage('Error al eliminar música de batalla', 'error');
  }
}

async function initializeMusic() {
  if (musicInitialized) return;
  
  try {
    await loadSavedMusic();
    musicInitialized = true;
    
    // Reproducir música de lobby automáticamente después de un delay
    setTimeout(() => {
      if (lobbyMusicFile && isMusicEnabled && !currentAudio) {
        playLobbyMusic();
      }
    }, 1000);
    
    console.log('🎵 Sistema de música inicializado');
  } catch (error) {
    console.error('Error al inicializar música:', error);
  }
}

// Función para cargar música guardada
async function loadSavedMusic() {
  try {
    // Cargar configuración del servidor
    await loadMusicConfig();
    
    console.log('🎵 Música cargada desde servidor y localStorage');
  } catch (error) {
    console.error('Error al cargar música:', error);
  }
}

// Pantallas
const landing = document.getElementById('landing');
const auth = document.getElementById('auth');
const adminPanel = document.getElementById('admin-panel');
const characterSelection = document.getElementById('character-selection');
const teamsConfirmed = document.getElementById('teams-confirmed');
const battleScreen = document.getElementById('battle-screen');

// Eventos de los botones principales
const btnRegister = document.getElementById('btn-register');
const btnLogin = document.getElementById('btn-login');

if (btnRegister) {
  btnRegister.addEventListener('click', () => {
    showScreen(auth);
    renderAuthForm('register');
  });
}

if (btnLogin) {
  btnLogin.addEventListener('click', () => {
    showScreen(auth);
    renderAuthForm('login');
  });
}

// Renderizar formulario de autenticación
function renderAuthForm(mode) {
  if (!auth) return;
  
  auth.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-4 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800 mb-2">${mode === 'register' ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>
      <form id="auth-form" class="flex flex-col gap-4 w-64">
        <input type="text" id="username" name="username" placeholder="Usuario" required class="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <input type="password" id="password" name="password" placeholder="Contraseña" required class="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
        <button type="submit" class="bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition">${mode === 'register' ? 'Registrar' : 'Entrar'}</button>
        <button type="button" id="back-to-landing" class="text-blue-600 hover:underline mt-2">Volver</button>
      </form>
      <div id="auth-error" class="text-red-600 font-semibold"></div>
    </div>
  `;
  
  const backBtn = document.getElementById('back-to-landing');
  const authForm = document.getElementById('auth-form');
  
  if (backBtn) {
    backBtn.onclick = () => showScreen(landing);
  }
  
  if (authForm) {
    authForm.onsubmit = (e) => {
      e.preventDefault();
      handleAuth(mode);
    };
  }
}

// Manejar autenticación
async function handleAuth(mode) {
  const username = document.getElementById('username')?.value;
  const password = document.getElementById('password')?.value;
  const errorDiv = document.getElementById('auth-error');
  
  if (!username || !password) {
    if (errorDiv) errorDiv.textContent = 'Usuario y contraseña son requeridos';
    return;
  }
  
  if (errorDiv) errorDiv.textContent = '';
  
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (mode === 'register') {
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        if (errorDiv) errorDiv.textContent = 'El usuario ya existe';
        return;
      }
      
      // Crear nuevo usuario
      const newUser = {
        id: `user_${Date.now()}`,
        username,
        password,
        role: 'user',
        userId: `USER_${Date.now()}`
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      showMessage('Usuario registrado exitosamente', 'success');
      
      // Redirigir según el rol
      setTimeout(() => {
        if (newUser.role === 'admin') {
          showAdminPanel();
        } else {
          showCharacterSelection();
        }
      }, 1000);
      
    } else {
      // Login
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        if (errorDiv) errorDiv.textContent = 'Usuario o contraseña incorrectos';
        return;
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user));
      showMessage(`Bienvenido, ${user.username}!`, 'success');
      
      // Redirigir según el rol
      setTimeout(() => {
        if (user.role === 'admin') {
          showAdminPanel();
        } else {
          showCharacterSelection();
        }
      }, 1000);
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    if (errorDiv) errorDiv.textContent = 'Error en la autenticación';
  }
}

// Función global para cerrar sesión
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('selectedHeroes');
  localStorage.removeItem('selectedVillains');
  stopMusic();
  
  // Limpiar variables de música
  currentAudio = null;
  currentMusicType = null;
  musicInitialized = false;
  
  showMessage('Sesión cerrada', 'info');
  showScreen(landing);
}

// Mostrar selección de personajes para usuarios normales
function showCharacterSelection() {
  showScreen(characterSelection);
  renderCharacterSelection();
  // Detener música actual y reproducir música de lobby
  stopMusic();
  isMusicPaused = false;
  setTimeout(() => {
    if (lobbyMusicFile) {
      playLobbyMusic();
    }
  }, 500);
}

function renderCharacterSelection() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!characterSelection) return;
  
  characterSelection.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 w-full max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">Selección de Personajes</h2>
      
      <!-- Botón de música -->
      <button id="lobby-music-toggle" onclick="toggleLobbyMusic()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
        🔊 Música
      </button>
      
      <div class="bg-white bg-opacity-90 p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600">Usuario: <span class="font-bold">${currentUser.username}</span></p>
        <p class="text-sm text-gray-600">Role: <span class="font-bold">${currentUser.role}</span></p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div class="bg-white bg-opacity-90 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Héroes Disponibles</h3>
          <div id="user-heroes-list" class="space-y-2"></div>
        </div>
        <div class="bg-white bg-opacity-90 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Villanos Disponibles</h3>
          <div id="user-villains-list" class="space-y-2"></div>
        </div>
      </div>
      
      <div id="selection-display" class="bg-white bg-opacity-90 p-4 rounded-lg w-full"></div>
      
      <div class="flex gap-4">
        <button onclick="logout()" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
          Cerrar sesión
        </button>
      </div>
    </div>
  `;
  
  loadUserHeroes();
  loadUserVillains();
  updateSelectionDisplay();
}

// Cargar héroes para usuarios
async function loadUserHeroes() {
  const list = document.getElementById('user-heroes-list');
  if (!list) return;
  
  try {
    const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    list.innerHTML = heroes.map(h => `
      <div class="bg-white bg-opacity-80 rounded-lg p-4 flex flex-col items-center">
        ${createImageElement(getImageWithFallback(h.image, h.name, 'hero'), h.name, 'w-24 h-24 object-cover rounded-full mb-2')}
        <div class="font-bold">${h.name}</div>
        <div class="text-sm text-gray-600">${h.alias}</div>
        <div class="text-xs text-gray-500">${h.city} - ${h.team}</div>
        <button onclick="selectHero('${h.heroId}')" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 mt-2">
          Seleccionar
        </button>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<div class="text-red-600">Error al cargar héroes</div>';
  }
}

// Cargar villanos para usuarios
async function loadUserVillains() {
  const list = document.getElementById('user-villains-list');
  if (!list) return;
  
  try {
    const villains = JSON.parse(localStorage.getItem('villains') || '[]');
    list.innerHTML = villains.map(v => `
      <div class="bg-white bg-opacity-80 rounded-lg p-4 flex flex-col items-center">
        ${createImageElement(getImageWithFallback(v.image, v.name, 'villain'), v.name, 'w-24 h-24 object-cover rounded-full mb-2')}
        <div class="font-bold">${v.name}</div>
        <div class="text-sm text-gray-600">${v.alias}</div>
        <div class="text-xs text-gray-500">${v.city} - ${v.team}</div>
        <button onclick="selectVillain('${v.villainId}')" class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 mt-2">
          Seleccionar
        </button>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<div class="text-red-600">Error al cargar villanos</div>';
  }
}

// Seleccionar héroe
function selectHero(heroId) {
  const selectedHeroes = JSON.parse(localStorage.getItem('selectedHeroes') || '[]');
  
  if (selectedHeroes.length >= 3) {
    showMessage('Ya tienes 3 héroes seleccionados', 'error');
    return;
  }
  
  if (selectedHeroes.includes(heroId)) {
    showMessage('Este héroe ya está seleccionado', 'error');
    return;
  }
  
  // Agregar al final para mantener orden de selección
  selectedHeroes.push(heroId);
  localStorage.setItem('selectedHeroes', JSON.stringify(selectedHeroes));
  showMessage('Héroe seleccionado', 'success');
  updateSelectionDisplay();
}

// Seleccionar villano
function selectVillain(villainId) {
  const selectedVillains = JSON.parse(localStorage.getItem('selectedVillains') || '[]');
  
  if (selectedVillains.length >= 3) {
    showMessage('Ya tienes 3 villanos seleccionados', 'error');
    return;
  }
  
  if (selectedVillains.includes(villainId)) {
    showMessage('Este villano ya está seleccionado', 'error');
    return;
  }
  
  // Agregar al final para mantener orden de selección
  selectedVillains.push(villainId);
  localStorage.setItem('selectedVillains', JSON.stringify(selectedVillains));
  showMessage('Villano seleccionado', 'success');
  updateSelectionDisplay();
}

// Actualizar display de selección
function updateSelectionDisplay() {
  const display = document.getElementById('selection-display');
  if (!display) return;
  
  const selectedHeroes = JSON.parse(localStorage.getItem('selectedHeroes') || '[]');
  const selectedVillains = JSON.parse(localStorage.getItem('selectedVillains') || '[]');
  
  display.innerHTML = `
    <div class="text-center">
      <h4 class="font-bold mb-2">Personajes Seleccionados</h4>
      <div class="flex justify-center gap-4 mb-2">
        <div>
          <span class="font-bold text-blue-600">Héroes (${selectedHeroes.length}/3):</span>
          <span class="text-sm text-gray-600">${selectedHeroes.join(', ') || 'Ninguno'}</span>
        </div>
        <div>
          <span class="font-bold text-red-600">Villanos (${selectedVillains.length}/3):</span>
          <span class="text-sm text-gray-600">${selectedVillains.join(', ') || 'Ninguno'}</span>
        </div>
      </div>
      <div class="flex gap-2 justify-center">
        <button onclick="clearSelection()" class="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600">
          Limpiar
        </button>
        ${selectedHeroes.length === 3 && selectedVillains.length === 3 ? 
          `<button onclick="startBattle()" class="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
            ¡Iniciar Batalla!
          </button>` : ''
        }
      </div>
    </div>
  `;
}

// Limpiar selección
function clearSelection() {
  localStorage.removeItem('selectedHeroes');
  localStorage.removeItem('selectedVillains');
  updateSelectionDisplay();
  showMessage('Selección limpiada', 'info');
}

// Iniciar batalla
function startBattle() {
  const selectedHeroes = JSON.parse(localStorage.getItem('selectedHeroes') || '[]');
  const selectedVillains = JSON.parse(localStorage.getItem('selectedVillains') || '[]');
  
  if (selectedHeroes.length !== 3 || selectedVillains.length !== 3) {
    showMessage('Necesitas seleccionar exactamente 3 héroes y 3 villanos', 'error');
    return;
  }
  
  // Guardar equipos para la batalla
  localStorage.setItem('battleHeroes', JSON.stringify(selectedHeroes));
  localStorage.setItem('battleVillains', JSON.stringify(selectedVillains));
  
  // Mostrar pantalla de batalla
  showBattleScreen();
}

// Renderizar pantalla de batalla con nuevo diseño
function renderBattleScreen() {
  if (!battleScreen) return;
  
  const battleHeroes = JSON.parse(localStorage.getItem('battleHeroes') || '[]');
  const battleVillains = JSON.parse(localStorage.getItem('battleVillains') || '[]');
  
  battleScreen.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 w-full max-w-7xl mx-auto p-4">
      <h2 class="text-4xl font-bold text-white mb-4">⚔️ Batalla Épica</h2>
      
      <!-- Controles superiores -->
      <div class="flex gap-4 mb-6">
        <button id="battle-music-toggle" onclick="toggleBattleMusic()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          🎵 Música de Batalla
        </button>
        <button onclick="restartBattle()" class="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition">
          🔄 Reiniciar
        </button>
        <button onclick="endBattle()" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
          🏁 Terminar Batalla
        </button>
      </div>
      
      <!-- Equipos en columnas -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <!-- Equipo de Héroes -->
        <div class="bg-white bg-opacity-95 p-6 rounded-lg shadow-lg">
          <h3 class="text-2xl font-bold text-blue-600 mb-6 text-center">🦸 Héroes</h3>
          <div id="battle-heroes" class="space-y-4"></div>
        </div>
        
        <!-- Equipo de Villanos -->
        <div class="bg-white bg-opacity-95 p-6 rounded-lg shadow-lg">
          <h3 class="text-2xl font-bold text-red-600 mb-6 text-center">🦹 Villanos</h3>
          <div id="battle-villains" class="space-y-4"></div>
        </div>
      </div>
      
      <!-- Log de Batalla -->
      <div class="bg-white bg-opacity-95 p-6 rounded-lg w-full shadow-lg">
        <h3 class="text-xl font-bold mb-4">📜 Log de Batalla</h3>
        <div id="battle-log" class="h-48 overflow-y-auto bg-gray-100 p-4 rounded text-sm space-y-2"></div>
      </div>
      
      <!-- Instrucciones de teclado -->
      <div class="bg-blue-50 p-4 rounded-lg text-sm">
        <h4 class="font-bold mb-2">⌨️ Controles por teclado:</h4>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div><strong>G + H:</strong> Golpe del héroe activo</div>
            <div><strong>G + V:</strong> Golpe del villano activo</div>
          </div>
          <div>
            <div><strong>E + H:</strong> Ataque especial del héroe</div>
            <div><strong>E + V:</strong> Ataque especial del villano</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Cargar personajes de batalla
  loadBattleCharacters();
  
  // Inicializar estado de batalla
  initializeBattleState();
  
  // Configurar controles de teclado
  setupKeyboardControls();
}

// Cargar personajes de batalla con nuevo diseño
function loadBattleCharacters() {
  const battleHeroes = JSON.parse(localStorage.getItem('battleHeroes') || '[]');
  const battleVillains = JSON.parse(localStorage.getItem('battleVillains') || '[]');
  const allHeroes = JSON.parse(localStorage.getItem('heroes') || '[]');
  const allVillains = JSON.parse(localStorage.getItem('villains') || '[]');
  
  const heroesContainer = document.getElementById('battle-heroes');
  const villainsContainer = document.getElementById('battle-villains');
  
  if (heroesContainer) {
    heroesContainer.innerHTML = battleHeroes.map((heroId, index) => {
      const hero = allHeroes.find(h => h.heroId === heroId);
      if (!hero) return '';
      
      return `
        <div class="battle-character bg-blue-50 rounded-lg p-4 border-2 ${index === 0 ? 'border-blue-500' : 'border-gray-300'}" data-character-id="${hero.heroId}" data-team="hero" data-index="${index}">
          <div class="flex items-center space-x-4">
            ${createImageElement(getImageWithFallback(hero.image, hero.name, 'hero'), hero.name, 'w-20 h-20 object-cover rounded-full border-2 border-blue-300')}
            <div class="flex-1">
              <div class="font-bold text-lg">${hero.name}</div>
              <div class="text-sm text-gray-600">${hero.alias}</div>
              <div class="text-xs text-gray-500">${hero.city}</div>
              
              <!-- Barras de estado -->
              <div class="mt-3 space-y-2">
                <!-- Barra de Poder -->
                <div>
                  <div class="flex justify-between text-xs">
                    <span>Poder</span>
                    <span id="hero-power-${index}">0%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="hero-power-bar-${index}" class="bg-yellow-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                  </div>
                </div>
                
                <!-- Barra de Escudo -->
                <div>
                  <div class="flex justify-between text-xs">
                    <span>Escudo</span>
                    <span id="hero-shield-${index}">100</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="hero-shield-bar-${index}" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
                
                <!-- Barra de Vida -->
                <div>
                  <div class="flex justify-between text-xs">
                    <span>Vida</span>
                    <span id="hero-health-${index}">200</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="hero-health-bar-${index}" class="bg-green-500 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
              </div>
              
              <!-- Botones de acción -->
              <div class="mt-3 flex gap-2">
                <button onclick="performAttack('hero', ${index}, 'normal')" 
                        class="hero-action-btn bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition ${index !== 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${index !== 0 ? 'disabled' : ''}>
                  ⚔️ Golpe
                </button>
                <button onclick="performAttack('hero', ${index}, 'special')" 
                        class="hero-special-btn bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition ${index !== 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${index !== 0 ? 'disabled' : ''}>
                  🔥 Especial
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
  
  if (villainsContainer) {
    villainsContainer.innerHTML = battleVillains.map((villainId, index) => {
      const villain = allVillains.find(v => v.villainId === villainId);
      if (!villain) return '';
      
      return `
        <div class="battle-character bg-red-50 rounded-lg p-4 border-2 ${index === 0 ? 'border-red-500' : 'border-gray-300'}" data-character-id="${villain.villainId}" data-team="villain" data-index="${index}">
          <div class="flex items-center space-x-4">
            ${createImageElement(getImageWithFallback(villain.image, villain.name, 'villain'), villain.name, 'w-20 h-20 object-cover rounded-full border-2 border-red-300')}
            <div class="flex-1">
              <div class="font-bold text-lg">${villain.name}</div>
              <div class="text-sm text-gray-600">${villain.alias}</div>
              <div class="text-xs text-gray-500">${villain.city}</div>
              
              <!-- Barras de estado -->
              <div class="mt-3 space-y-2">
                <!-- Barra de Poder -->
                <div>
                  <div class="flex justify-between text-xs">
                    <span>Poder</span>
                    <span id="villain-power-${index}">0%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="villain-power-bar-${index}" class="bg-yellow-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                  </div>
                </div>
                
                <!-- Barra de Escudo -->
                <div>
                  <div class="flex justify-between text-xs">
                    <span>Escudo</span>
                    <span id="villain-shield-${index}">100</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="villain-shield-bar-${index}" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
                
                <!-- Barra de Vida -->
                <div>
                  <div class="flex justify-between text-xs">
                    <span>Vida</span>
                    <span id="villain-health-${index}">200</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="villain-health-bar-${index}" class="bg-green-500 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
              </div>
              
              <!-- Botones de acción -->
              <div class="mt-3 flex gap-2">
                <button onclick="performAttack('villain', ${index}, 'normal')" 
                        class="villain-action-btn bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition ${index !== 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${index !== 0 ? 'disabled' : ''}>
                  ⚔️ Golpe
                </button>
                <button onclick="performAttack('villain', ${index}, 'special')" 
                        class="villain-special-btn bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition ${index !== 0 ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${index !== 0 ? 'disabled' : ''}>
                  🔥 Especial
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }
}

// Estado de batalla mejorado
let battleState = {
  round: 0,
  heroes: [],
  villains: [],
  log: [],
  isActive: false
};

// Inicializar estado de batalla con nuevas reglas
function initializeBattleState() {
  const battleHeroes = JSON.parse(localStorage.getItem('battleHeroes') || '[]');
  const battleVillains = JSON.parse(localStorage.getItem('battleVillains') || '[]');
  const allHeroes = JSON.parse(localStorage.getItem('heroes') || '[]');
  const allVillains = JSON.parse(localStorage.getItem('villains') || '[]');
  
  battleState = {
    round: 0,
    heroes: battleHeroes.map(heroId => {
      const hero = allHeroes.find(h => h.heroId === heroId);
      return {
        ...hero,
        health: 200,
        shield: 100,
        power: 0,
        isAlive: true,
        isActive: false
      };
    }),
    villains: battleVillains.map(villainId => {
      const villain = allVillains.find(v => v.villainId === villainId);
      return {
        ...villain,
        health: 200,
        shield: 100,
        power: 0,
        isAlive: true,
        isActive: false
      };
    }),
    log: [],
    isActive: true
  };
  
  // Activar primer personaje de cada equipo
  if (battleState.heroes.length > 0) {
    battleState.heroes[0].isActive = true;
  }
  if (battleState.villains.length > 0) {
    battleState.villains[0].isActive = true;
  }
  
  // Reproducir música de batalla
  playBattleMusic();
  
  // Actualizar interfaz
  updateBattleInterface();
  
  addBattleLog('⚔️ ¡La batalla ha comenzado!');
}

// Función para realizar ataques
function performAttack(team, characterIndex, attackType) {
  if (!battleState.isActive) return;
  
  const character = team === 'hero' ? battleState.heroes[characterIndex] : battleState.villains[characterIndex];
  const targetTeam = team === 'hero' ? battleState.villains : battleState.heroes;
  
  // Verificar que el personaje esté activo
  if (!character.isActive || !character.isAlive) {
    addBattleLog(`❌ ${character.name} no puede atacar en este momento`);
    return;
  }
  
  // Encontrar el primer enemigo vivo
  const target = targetTeam.find(c => c.isAlive);
  if (!target) {
    addBattleLog('❌ No hay enemigos disponibles para atacar');
    return;
  }
  
  let damage = 0;
  let isCritical = false;
  let isSpecial = false;
  
  if (attackType === 'normal') {
    // Ataque normal: 15 de daño base, posibilidad de crítico (40)
    damage = 15;
    isCritical = Math.random() < 0.2; // 20% de probabilidad de crítico
    if (isCritical) {
      damage = 40;
    }
  } else if (attackType === 'special') {
    // Ataque especial: solo si poder = 100
    if (character.power < 100) {
      addBattleLog(`❌ ${character.name} necesita 100% de poder para usar ataque especial`);
      return;
    }
    damage = 60;
    isSpecial = true;
    character.power = 0; // Resetear poder después del ataque especial
  }
  
  // Aplicar daño (primero al escudo, luego a la vida)
  let remainingDamage = damage;
  
  if (target.shield > 0) {
    if (remainingDamage <= target.shield) {
      target.shield -= remainingDamage;
      remainingDamage = 0;
    } else {
      remainingDamage -= target.shield;
      target.shield = 0;
    }
  }
  
  if (remainingDamage > 0) {
    target.health = Math.max(0, target.health - remainingDamage);
  }
  
  // Verificar si el objetivo fue derrotado
  if (target.health <= 0) {
    target.isAlive = false;
    addBattleLog(`💀 ${character.name} derrota a ${target.name} con ${damage} de daño!`);
    
    // Activar siguiente personaje del equipo derrotado
    activateNextCharacter(team === 'hero' ? 'villain' : 'hero');
    
    // Verificar fin de batalla
    checkBattleEnd();
  } else {
    const attackTypeText = isSpecial ? '🔥 ATAQUE ESPECIAL' : (isCritical ? '💥 GOLPE CRÍTICO' : '⚔️ Golpe normal');
    addBattleLog(`${attackTypeText}: ${character.name} ataca a ${target.name} causando ${damage} de daño! (Escudo: ${target.shield}, Vida: ${target.health})`);
  }
  
  // Llenar barra de poder del atacante
  character.power = Math.min(100, character.power + 25);
  
  // Mostrar animación especial si es ataque especial
  if (isSpecial && character.specialAttackAnimationUrl && character.specialAttackAnimationUrl.trim() !== '') {
    showDynamicSpecialAnimation(character.specialAttackAnimationUrl, character.name, '¡Ataque Especial!');
  }
  
  // Actualizar interfaz
  updateBattleInterface();
}

// Activar siguiente personaje del equipo
function activateNextCharacter(team) {
  const characters = team === 'hero' ? battleState.heroes : battleState.villains;
  
  // Desactivar todos
  characters.forEach(c => c.isActive = false);
  
  // Activar el siguiente vivo
  const nextAlive = characters.find(c => c.isAlive);
  if (nextAlive) {
    nextAlive.isActive = true;
    addBattleLog(`🔄 ${nextAlive.name} entra al combate!`);
  }
}

// Actualizar interfaz de batalla
function updateBattleInterface() {
  // Actualizar héroes
  battleState.heroes.forEach((hero, index) => {
    const powerElement = document.getElementById(`hero-power-${index}`);
    const powerBarElement = document.getElementById(`hero-power-bar-${index}`);
    const shieldElement = document.getElementById(`hero-shield-${index}`);
    const shieldBarElement = document.getElementById(`hero-shield-bar-${index}`);
    const healthElement = document.getElementById(`hero-health-${index}`);
    const healthBarElement = document.getElementById(`hero-health-bar-${index}`);
    const characterElement = document.querySelector(`[data-team="hero"][data-index="${index}"]`);
    
    if (powerElement) powerElement.textContent = `${hero.power}%`;
    if (powerBarElement) powerBarElement.style.width = `${hero.power}%`;
    if (shieldElement) shieldElement.textContent = hero.shield;
    if (shieldBarElement) shieldBarElement.style.width = `${(hero.shield / 100) * 100}%`;
    if (healthElement) healthElement.textContent = hero.health;
    if (healthBarElement) healthBarElement.style.width = `${(hero.health / 200) * 100}%`;
    
    // Actualizar estado visual
    if (characterElement) {
      if (!hero.isAlive) {
        characterElement.classList.add('opacity-50', 'grayscale');
        characterElement.classList.remove('border-blue-500');
      } else if (hero.isActive) {
        characterElement.classList.remove('opacity-50', 'grayscale');
        characterElement.classList.add('border-blue-500');
      } else {
        characterElement.classList.remove('opacity-50', 'grayscale', 'border-blue-500');
        characterElement.classList.add('border-gray-300');
      }
    }
    
    // Actualizar botones
    const actionBtns = characterElement?.querySelectorAll('.hero-action-btn, .hero-special-btn');
    if (actionBtns) {
      actionBtns.forEach(btn => {
        if (!hero.isAlive || !hero.isActive) {
          btn.disabled = true;
          btn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          btn.disabled = false;
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      });
    }
  });
  
  // Actualizar villanos
  battleState.villains.forEach((villain, index) => {
    const powerElement = document.getElementById(`villain-power-${index}`);
    const powerBarElement = document.getElementById(`villain-power-bar-${index}`);
    const shieldElement = document.getElementById(`villain-shield-${index}`);
    const shieldBarElement = document.getElementById(`villain-shield-bar-${index}`);
    const healthElement = document.getElementById(`villain-health-${index}`);
    const healthBarElement = document.getElementById(`villain-health-bar-${index}`);
    const characterElement = document.querySelector(`[data-team="villain"][data-index="${index}"]`);
    
    if (powerElement) powerElement.textContent = `${villain.power}%`;
    if (powerBarElement) powerBarElement.style.width = `${villain.power}%`;
    if (shieldElement) shieldElement.textContent = villain.shield;
    if (shieldBarElement) shieldBarElement.style.width = `${(villain.shield / 100) * 100}%`;
    if (healthElement) healthElement.textContent = villain.health;
    if (healthBarElement) healthBarElement.style.width = `${(villain.health / 200) * 100}%`;
    
    // Actualizar estado visual
    if (characterElement) {
      if (!villain.isAlive) {
        characterElement.classList.add('opacity-50', 'grayscale');
        characterElement.classList.remove('border-red-500');
      } else if (villain.isActive) {
        characterElement.classList.remove('opacity-50', 'grayscale');
        characterElement.classList.add('border-red-500');
      } else {
        characterElement.classList.remove('opacity-50', 'grayscale', 'border-red-500');
        characterElement.classList.add('border-gray-300');
      }
    }
    
    // Actualizar botones
    const actionBtns = characterElement?.querySelectorAll('.villain-action-btn, .villain-special-btn');
    if (actionBtns) {
      actionBtns.forEach(btn => {
        if (!villain.isAlive || !villain.isActive) {
          btn.disabled = true;
          btn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
          btn.disabled = false;
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      });
    }
  });
}

// Configurar controles de teclado
function setupKeyboardControls() {
  document.addEventListener('keydown', function(event) {
    if (!battleState.isActive) return;
    
    const key = event.key.toLowerCase();
    
    // Verificar combinaciones de teclas
    if (event.ctrlKey || event.altKey || event.metaKey) return; // Ignorar combinaciones con teclas modificadoras
    
    if (key === 'g') {
      // Golpes
      setTimeout(() => {
        const nextKey = event.key.toLowerCase();
        if (nextKey === 'h') {
          // Golpe del héroe activo
          const activeHero = battleState.heroes.find(h => h.isActive && h.isAlive);
          if (activeHero) {
            const heroIndex = battleState.heroes.indexOf(activeHero);
            performAttack('hero', heroIndex, 'normal');
          }
        } else if (nextKey === 'v') {
          // Golpe del villano activo
          const activeVillain = battleState.villains.find(v => v.isActive && v.isAlive);
          if (activeVillain) {
            const villainIndex = battleState.villains.indexOf(activeVillain);
            performAttack('villain', villainIndex, 'normal');
          }
        }
      }, 100);
    } else if (key === 'e') {
      // Ataques especiales
      setTimeout(() => {
        const nextKey = event.key.toLowerCase();
        if (nextKey === 'h') {
          // Ataque especial del héroe activo
          const activeHero = battleState.heroes.find(h => h.isActive && h.isAlive);
          if (activeHero) {
            const heroIndex = battleState.heroes.indexOf(activeHero);
            performAttack('hero', heroIndex, 'special');
          }
        } else if (nextKey === 'v') {
          // Ataque especial del villano activo
          const activeVillain = battleState.villains.find(v => v.isActive && v.isAlive);
          if (activeVillain) {
            const villainIndex = battleState.villains.indexOf(activeVillain);
            performAttack('villain', villainIndex, 'special');
          }
        }
      }, 100);
    }
  });
}

// Reiniciar batalla
function restartBattle() {
  if (confirm('¿Estás seguro de que quieres reiniciar la batalla?')) {
    initializeBattleState();
    addBattleLog('🔄 Batalla reiniciada');
  }
}

// Verificar fin de batalla
function checkBattleEnd() {
  const aliveHeroes = battleState.heroes.filter(h => h.isAlive);
  const aliveVillains = battleState.villains.filter(v => v.isAlive);
  
  if (aliveHeroes.length === 0) {
    addBattleLog('🏆 ¡Los Villanos han ganado la batalla!');
    endBattle();
  } else if (aliveVillains.length === 0) {
    addBattleLog('🏆 ¡Los Héroes han ganado la batalla!');
    endBattle();
  }
}

// Terminar batalla
function endBattle() {
  battleState.isActive = false;
  stopMusic();
  addBattleLog('🏁 Batalla terminada');
  
  setTimeout(() => {
    showCharacterSelection();
  }, 2000);
}

// Renderizar panel de administración
function renderAdminPanel() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!adminPanel) return;
  
  adminPanel.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 w-full max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">Panel de Administración</h2>
      
      <!-- Botón de música -->
      <button id="admin-music-toggle" onclick="toggleLobbyMusic()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
        🔊 Música
      </button>
      
      <div class="bg-white bg-opacity-90 p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600">Admin: <span class="font-bold">${currentUser.username}</span></p>
        <p class="text-sm text-gray-600">ID: <span class="font-bold">${currentUser.userId}</span></p>
        <p class="text-sm text-gray-600">Role: <span class="font-bold">${currentUser.role}</span></p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <!-- Formulario Agregar Héroe -->
        <div class="bg-white bg-opacity-90 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Agregar Héroe</h3>
          <form id="hero-form" class="space-y-3">
            <input type="text" name="name" placeholder="Nombre" class="w-full p-2 border rounded" required>
            <input type="text" name="alias" placeholder="Alias" class="w-full p-2 border rounded" required>
            <input type="text" name="city" placeholder="Ciudad" class="w-full p-2 border rounded">
            <input type="text" name="team" placeholder="Equipo" class="w-full p-2 border rounded">
            <input type="text" name="image" placeholder="URL de imagen" class="w-full p-2 border rounded">
            <input type="text" name="specialAttackAnimationUrl" placeholder="URL de animación especial" class="w-full p-2 border rounded">
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Agregar Héroe</button>
          </form>
        </div>
        
        <!-- Formulario Agregar Villano -->
        <div class="bg-white bg-opacity-90 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Agregar Villano</h3>
          <form id="villain-form" class="space-y-3">
            <input type="text" name="name" placeholder="Nombre" class="w-full p-2 border rounded" required>
            <input type="text" name="alias" placeholder="Alias" class="w-full p-2 border rounded" required>
            <input type="text" name="city" placeholder="Ciudad" class="w-full p-2 border rounded">
            <input type="text" name="team" placeholder="Equipo" class="w-full p-2 border rounded">
            <input type="text" name="image" placeholder="URL de imagen" class="w-full p-2 border rounded">
            <input type="text" name="specialAttackAnimationUrl" placeholder="URL de animación especial" class="w-full p-2 border rounded">
            <button type="submit" class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Agregar Villano</button>
          </form>
        </div>
      </div>
      
      <!-- Configuración de Música -->
      <div class="bg-white bg-opacity-90 p-6 rounded-lg w-full">
        <h3 class="text-xl font-bold mb-4">🎵 Configuración de Música</h3>
        
        <!-- Información del modo de almacenamiento -->
        <div id="storage-info" class="mb-6"></div>
        
        <!-- Música de Lobby -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-3">🎮 Música de Lobby (Fondo General)</h4>
          <div class="bg-blue-50 p-4 rounded-lg mb-3">
            <p class="text-sm text-blue-800">Se reproducirá automáticamente en: Landing, Admin, Selección de Personajes</p>
          </div>
          <div class="flex items-center gap-4">
            <input type="file" id="lobby-music-input" accept=".mp3,.wav,.ogg,.m4a" class="hidden">
            <button onclick="document.getElementById('lobby-music-input').click()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              📁 Adjuntar Música de Lobby
            </button>
            <button id="remove-lobby-music" onclick="removeLobbyMusic()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition hidden">
              🗑️ Eliminar Música de Lobby
            </button>
            <div id="lobby-music-info" class="text-sm text-gray-600"></div>
          </div>
          <div id="lobby-music-preview" class="mt-2"></div>
        </div>
        
        <!-- Música de Batalla -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-3">⚔️ Música de Batalla</h4>
          <div class="bg-red-50 p-4 rounded-lg mb-3">
            <p class="text-sm text-red-800">Se reproducirá automáticamente durante las batallas</p>
          </div>
          <div class="flex items-center gap-4">
            <input type="file" id="battle-music-input" accept=".mp3,.wav,.ogg,.m4a" class="hidden">
            <button onclick="document.getElementById('battle-music-input').click()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              📁 Adjuntar Música de Batalla
            </button>
            <button id="remove-battle-music" onclick="removeBattleMusic()" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition hidden">
              🗑️ Eliminar Música de Batalla
            </button>
            <div id="battle-music-info" class="text-sm text-gray-600"></div>
          </div>
          <div id="battle-music-preview" class="mt-2"></div>
        </div>
        
        <!-- Controles de Música -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-lg font-semibold mb-3">🎛️ Controles de Música</h4>
          <div class="flex gap-4">
            <button id="play-lobby-music" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              ▶️ Reproducir Lobby
            </button>
            <button id="play-battle-music" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">
              ⚔️ Reproducir Batalla
            </button>
            <button id="stop-music" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition">
              ⏹️ Detener Música
            </button>
          </div>
        </div>
      </div>
      
      <!-- Listas de personajes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div class="bg-white bg-opacity-90 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Héroes Registrados</h3>
          <div id="heroes-list" class="space-y-2"></div>
        </div>
        <div class="bg-white bg-opacity-90 p-6 rounded-lg">
          <h3 class="text-xl font-bold mb-4">Villanos Registrados</h3>
          <div id="villains-list" class="space-y-2"></div>
        </div>
      </div>
      
      <div class="flex gap-4">
        <button onclick="logout()" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
          Cerrar sesión
        </button>
      </div>
    </div>
  `;
  
  // Event listeners
  const heroForm = document.getElementById('hero-form');
  const villainForm = document.getElementById('villain-form');
  
  if (heroForm) {
    heroForm.addEventListener('submit', handleAddHero);
  }
  
  if (villainForm) {
    villainForm.addEventListener('submit', handleAddVillain);
  }
  
  // Event listeners para música
  const lobbyMusicInput = document.getElementById('lobby-music-input');
  const battleMusicInput = document.getElementById('battle-music-input');
  const playLobbyMusicBtn = document.getElementById('play-lobby-music');
  const playBattleMusicBtn = document.getElementById('play-battle-music');
  const stopMusicBtn = document.getElementById('stop-music');
  
  if (lobbyMusicInput) {
    lobbyMusicInput.addEventListener('change', handleLobbyMusicUpload);
  }
  
  if (battleMusicInput) {
    battleMusicInput.addEventListener('change', handleBattleMusicUpload);
  }
  
  if (playLobbyMusicBtn) {
    playLobbyMusicBtn.addEventListener('click', playLobbyMusic);
  }
  
  if (playBattleMusicBtn) {
    playBattleMusicBtn.addEventListener('click', playBattleMusic);
  }
  
  if (stopMusicBtn) {
    stopMusicBtn.addEventListener('click', stopMusic);
  }
  
  // Cargar listas
  loadHeroes();
  loadVillains();
  
  // Cargar música guardada si existe
  loadSavedMusic();
}

// Cargar héroes desde localStorage
async function loadHeroes() {
  try {
    const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    const heroesList = document.getElementById('heroes-list');
    
    if (heroesList) {
      heroesList.innerHTML = '';
      
      heroes.forEach(hero => {
        const heroDiv = document.createElement('div');
        heroDiv.className = 'flex justify-between items-center p-3 bg-gray-50 rounded';
        heroDiv.innerHTML = `
          <div>
            <strong>${hero.name}</strong> (${hero.alias})
            <br><small class="text-gray-600">${hero.city} - ${hero.team}</small>
            ${hero.image ? '<br><small class="text-green-600">✅ Con imagen</small>' : '<br><small class="text-gray-500">❌ Sin imagen</small>'}
            ${hero.specialAttackAnimationUrl ? '<br><small class="text-blue-600">🎭 Con animación especial</small>' : '<br><small class="text-gray-500">❌ Sin animación</small>'}
          </div>
          <div class="flex gap-2">
            <button onclick="editHero('${hero.heroId}')" class="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Editar</button>
            <button onclick="deleteHero('${hero.heroId}')" class="bg-red-500 text-white px-2 py-1 rounded text-sm">Eliminar</button>
          </div>
        `;
        heroesList.appendChild(heroDiv);
      });
    }
  } catch (error) {
    console.error('Error al cargar héroes:', error);
  }
}

// Cargar villanos desde localStorage
async function loadVillains() {
  try {
    const villains = JSON.parse(localStorage.getItem('villains') || '[]');
    const villainsList = document.getElementById('villains-list');
    
    if (villainsList) {
      villainsList.innerHTML = '';
      
      villains.forEach(villain => {
        const villainDiv = document.createElement('div');
        villainDiv.className = 'flex justify-between items-center p-3 bg-gray-50 rounded';
        villainDiv.innerHTML = `
          <div>
            <strong>${villain.name}</strong> (${villain.alias})
            <br><small class="text-gray-600">${villain.city} - ${villain.team}</small>
            ${villain.image ? '<br><small class="text-green-600">✅ Con imagen</small>' : '<br><small class="text-gray-500">❌ Sin imagen</small>'}
            ${villain.specialAttackAnimationUrl ? '<br><small class="text-blue-600">🎭 Con animación especial</small>' : '<br><small class="text-gray-500">❌ Sin animación</small>'}
          </div>
          <div class="flex gap-2">
            <button onclick="editVillain('${villain.villainId}')" class="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Editar</button>
            <button onclick="deleteVillain('${villain.villainId}')" class="bg-red-500 text-white px-2 py-1 rounded text-sm">Eliminar</button>
          </div>
        `;
        villainsList.appendChild(villainDiv);
      });
    }
  } catch (error) {
    console.error('Error al cargar villanos:', error);
  }
}

// Manejar agregar héroe
async function handleAddHero(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const heroData = {
    name: formData.get('name'),
    alias: formData.get('alias'),
    city: formData.get('city'),
    team: formData.get('team'),
    image: formData.get('image'),
    specialAttackAnimationUrl: formData.get('specialAttackAnimationUrl')
  };
  
  if (!heroData.name || !heroData.alias) {
    showMessage('Nombre y alias son requeridos', 'error');
    return;
  }

  // Validar URL de imagen si se proporciona
  if (heroData.image && heroData.image.trim() !== '') {
    try {
      new URL(heroData.image);
    } catch (e) {
      showMessage('URL de imagen inválida. Se usará imagen por defecto.', 'warning');
      heroData.image = '';
    }
  }

  // Validar URL de animación especial si se proporciona
  if (heroData.specialAttackAnimationUrl && heroData.specialAttackAnimationUrl.trim() !== '') {
    try {
      new URL(heroData.specialAttackAnimationUrl);
    } catch (e) {
      showMessage('URL de animación especial inválida. Se usará animación por defecto.', 'warning');
      heroData.specialAttackAnimationUrl = '';
    }
  }

  try {
    const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    
    // Verificar duplicados
    const existingHero = heroes.find(h => h.name === heroData.name);
    if (existingHero) {
      showMessage(`Ya existe un héroe con este nombre: ${existingHero.name}`, 'error');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newHero = {
      heroId: `HERO_${Date.now()}`,
      ...heroData,
      // Asegurar que los campos multimedia estén presentes
      image: heroData.image || '',
      specialAttackAnimationUrl: heroData.specialAttackAnimationUrl || '',
      createdBy: currentUser.userId,
      createdAt: new Date().toISOString()
    };
    
    heroes.push(newHero);
    localStorage.setItem('heroes', JSON.stringify(heroes));
    
    showMessage('🦸 Héroe agregado exitosamente', 'success');
    e.target.reset();
    loadHeroes();
    
    // Recargar también en la pantalla de selección si está activa
    if (characterSelection && !characterSelection.classList.contains('hidden')) {
      loadUserHeroes();
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al agregar héroe', 'error');
  }
}

// Manejar agregar villano
async function handleAddVillain(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const villainData = {
    name: formData.get('name'),
    alias: formData.get('alias'),
    city: formData.get('city'),
    team: formData.get('team'),
    image: formData.get('image'),
    specialAttackAnimationUrl: formData.get('specialAttackAnimationUrl')
  };
  
  if (!villainData.name || !villainData.alias) {
    showMessage('Nombre y alias son requeridos', 'error');
    return;
  }

  // Validar URL de imagen si se proporciona
  if (villainData.image && villainData.image.trim() !== '') {
    try {
      new URL(villainData.image);
    } catch (e) {
      showMessage('URL de imagen inválida. Se usará imagen por defecto.', 'warning');
      villainData.image = '';
    }
  }

  // Validar URL de animación especial si se proporciona
  if (villainData.specialAttackAnimationUrl && villainData.specialAttackAnimationUrl.trim() !== '') {
    try {
      new URL(villainData.specialAttackAnimationUrl);
    } catch (e) {
      showMessage('URL de animación especial inválida. Se usará animación por defecto.', 'warning');
      villainData.specialAttackAnimationUrl = '';
    }
  }

  try {
    const villains = JSON.parse(localStorage.getItem('villains') || '[]');
    
    // Verificar duplicados
    const existingVillain = villains.find(v => v.name === villainData.name);
    if (existingVillain) {
      showMessage(`Ya existe un villano con este nombre: ${existingVillain.name}`, 'error');
      return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const newVillain = {
      villainId: `VILLAIN_${Date.now()}`,
      ...villainData,
      // Asegurar que los campos multimedia estén presentes
      image: villainData.image || '',
      specialAttackAnimationUrl: villainData.specialAttackAnimationUrl || '',
      createdBy: currentUser.userId,
      createdAt: new Date().toISOString()
    };
    
    villains.push(newVillain);
    localStorage.setItem('villains', JSON.stringify(villains));
    
    showMessage('🦹 Villano agregado exitosamente', 'success');
    e.target.reset();
    loadVillains();
    
    // Recargar también en la pantalla de selección si está activa
    if (characterSelection && !characterSelection.classList.contains('hidden')) {
      loadUserVillains();
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al agregar villano', 'error');
  }
}

// Editar héroe
async function editHero(heroId) {
  try {
    const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    const hero = heroes.find(h => h.heroId === heroId);
    
    if (!hero) {
      showMessage('Héroe no encontrado', 'error');
      return;
    }
    
    const newName = prompt('Nuevo nombre:', hero.name);
    if (newName === null) return;
    
    const newAlias = prompt('Nuevo alias:', hero.alias);
    if (newAlias === null) return;
    
    const newCity = prompt('Nueva ciudad:', hero.city);
    if (newCity === null) return;
      
    const newTeam = prompt('Nuevo equipo:', hero.team);
    if (newTeam === null) return;
      
    const newImage = prompt('Nueva URL de imagen (dejar vacío para imagen por defecto):', hero.image);
    if (newImage === null) return;
      
    const newAnimationUrl = prompt('Nueva URL de animación especial (opcional):', hero.specialAttackAnimationUrl);
    if (newAnimationUrl === null) return;
      
    // Validar URL de imagen
    if (newImage && newImage.trim() !== '') {
      try {
        new URL(newImage);
      } catch (e) {
        showMessage('URL de imagen inválida. Se usará imagen por defecto.', 'warning');
        newImage = '';
      }
    }
      
    // Validar URL de animación especial
    if (newAnimationUrl && newAnimationUrl.trim() !== '') {
      try {
        new URL(newAnimationUrl);
      } catch (e) {
        showMessage('URL de animación especial inválida. Se usará animación por defecto.', 'warning');
        newAnimationUrl = '';
      }
    }
      
    // Actualizar héroe
    hero.name = newName || hero.name;
    hero.alias = newAlias || hero.alias;
    hero.city = newCity || hero.city;
    hero.team = newTeam || hero.team;
    hero.image = newImage || '';
    hero.specialAttackAnimationUrl = newAnimationUrl || '';
      
    localStorage.setItem('heroes', JSON.stringify(heroes));
    loadHeroes();
    
    // Recargar también en la pantalla de selección si está activa
    if (characterSelection && !characterSelection.classList.contains('hidden')) {
      loadUserHeroes();
    }
    
    showMessage('🦸 Héroe actualizado exitosamente', 'success');
  } catch (error) {
    console.error('Error al editar héroe:', error);
    showMessage('Error al editar héroe', 'error');
  }
}

// Editar villano
async function editVillain(villainId) {
  try {
    const villains = JSON.parse(localStorage.getItem('villains') || '[]');
    const villain = villains.find(v => v.villainId === villainId);
    
    if (!villain) {
      showMessage('Villano no encontrado', 'error');
      return;
    }
    
    const newName = prompt('Nuevo nombre:', villain.name);
    if (newName === null) return;
    
    const newAlias = prompt('Nuevo alias:', villain.alias);
    if (newAlias === null) return;
    
    const newCity = prompt('Nueva ciudad:', villain.city);
    if (newCity === null) return;
      
    const newTeam = prompt('Nuevo equipo:', villain.team);
    if (newTeam === null) return;
      
    const newImage = prompt('Nueva URL de imagen (dejar vacío para imagen por defecto):', villain.image);
    if (newImage === null) return;
      
    const newAnimationUrl = prompt('Nueva URL de animación especial (opcional):', villain.specialAttackAnimationUrl);
    if (newAnimationUrl === null) return;
      
    // Validar URL de imagen
    if (newImage && newImage.trim() !== '') {
      try {
        new URL(newImage);
      } catch (e) {
        showMessage('URL de imagen inválida. Se usará imagen por defecto.', 'warning');
        newImage = '';
      }
    }
      
    // Validar URL de animación especial
    if (newAnimationUrl && newAnimationUrl.trim() !== '') {
      try {
        new URL(newAnimationUrl);
      } catch (e) {
        showMessage('URL de animación especial inválida. Se usará animación por defecto.', 'warning');
        newAnimationUrl = '';
      }
    }
      
    // Actualizar villano
    villain.name = newName || villain.name;
    villain.alias = newAlias || villain.alias;
    villain.city = newCity || villain.city;
    villain.team = newTeam || villain.team;
    villain.image = newImage || '';
    villain.specialAttackAnimationUrl = newAnimationUrl || '';
      
    localStorage.setItem('villains', JSON.stringify(villains));
    loadVillains();
    
    // Recargar también en la pantalla de selección si está activa
    if (characterSelection && !characterSelection.classList.contains('hidden')) {
      loadUserVillains();
    }
    
    showMessage('🦹 Villano actualizado exitosamente', 'success');
  } catch (error) {
    console.error('Error al editar villano:', error);
    showMessage('Error al editar villano', 'error');
  }
}

// Eliminar héroe
async function deleteHero(heroId) {
  if (confirm('¿Estás seguro de que quieres eliminar este héroe?')) {
    try {
      const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
      const filteredHeroes = heroes.filter(h => h.heroId !== heroId);
      localStorage.setItem('heroes', JSON.stringify(filteredHeroes));
      loadHeroes();
      
      // Recargar también en la pantalla de selección si está activa
      if (characterSelection && !characterSelection.classList.contains('hidden')) {
        loadUserHeroes();
      }
      
      showMessage('🗑️ Héroe eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar héroe:', error);
      showMessage('Error al eliminar héroe', 'error');
    }
  }
}

// Eliminar villano
async function deleteVillain(villainId) {
  if (confirm('¿Estás seguro de que quieres eliminar este villano?')) {
    try {
      const villains = JSON.parse(localStorage.getItem('villains') || '[]');
      const filteredVillains = villains.filter(v => v.villainId !== villainId);
      localStorage.setItem('villains', JSON.stringify(filteredVillains));
      loadVillains();
      
      // Recargar también en la pantalla de selección si está activa
      if (characterSelection && !characterSelection.classList.contains('hidden')) {
        loadUserVillains();
      }
      
      showMessage('🗑️ Villano eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar villano:', error);
      showMessage('Error al eliminar villano', 'error');
    }
  }
}

// Inicializar la aplicación
console.log('🎮 Aplicación standalone iniciada');
showMessage('¡Bienvenido a DataFight!', 'info');

// Inicializar música automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar música automáticamente después de un breve delay
  setTimeout(() => {
    initializeMusic();
  }, 500);
});

// Agregar entrada al log de batalla
function addBattleLog(message) {
  battleState.log.push({
    message,
    timestamp: new Date().toLocaleTimeString()
  });
  
  const logContainer = document.getElementById('battle-log');
  if (logContainer) {
    logContainer.innerHTML = battleState.log.map(entry => 
      `<div class="text-gray-700"><span class="text-gray-500">[${entry.timestamp}]</span> ${entry.message}</div>`
    ).join('');
    logContainer.scrollTop = logContainer.scrollHeight;
  }
}

// Mostrar animación especial mejorada
function showDynamicSpecialAnimation(animationUrl, characterName, attackType = '¡Ataque Especial!') {
  if (!animationUrl || animationUrl.trim() === '') return;
  
  // Crear overlay para la animación
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
  overlay.innerHTML = `
    <div class="bg-white p-6 rounded-lg max-w-md mx-4">
      <div class="text-center mb-4">
        <h3 class="text-xl font-bold text-red-600 mb-2">${attackType}</h3>
        <p class="text-lg font-semibold">🎭 ${characterName}</p>
      </div>
      <div class="bg-gray-100 rounded-lg p-4 mb-4">
        <img src="${animationUrl}" alt="Animación especial de ${characterName}" 
             class="w-full h-48 object-cover rounded" 
             onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\'text-center text-gray-500 py-8\'>🎭 Animación especial de ${characterName}</div>'">
      </div>
      <div class="flex justify-center">
        <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
          Cerrar
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // Auto-cerrar después de 4 segundos
  setTimeout(() => {
    if (overlay.parentNode) {
      overlay.remove();
    }
  }, 4000);
} 