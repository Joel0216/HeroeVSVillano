// standalone.js - Versión completamente independiente

// Detectar si estamos en modo servidor o archivo local
const isServerMode = window.location.protocol === 'http:' || window.location.protocol === 'https:';
const baseUrl = isServerMode ? '' : 'http://localhost:3001';

console.log(`🎵 Modo de operación: ${isServerMode ? 'Servidor' : 'Archivo local'}`);
console.log(`🌐 URL base: ${baseUrl}`);

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

// Inicializar datos al cargar
initializeData();

// Función helper para manejar imágenes con fallback
function getImageWithFallback(imageUrl, characterName, characterType = 'hero') {
  if (!imageUrl || imageUrl.trim() === '') {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${characterType === 'hero' ? '#3b82f6' : '#ef4444'}"/>
        <text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">${characterName}</text>
      </svg>
    `)}`;
  }
  return imageUrl;
}

function createImageElement(imageUrl, altText, className = '') {
  const fallbackImage = `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
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

  // Validar tamaño (10MB máximo)
  if (file.size > 10 * 1024 * 1024) {
    showMessage('El archivo es demasiado grande. Máximo 10MB', 'error');
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
        showMessage('Música de lobby guardada exitosamente', 'success');
        lobbyMusicFile = result.musicPath;
        updateMusicInterface({ lobbyMusicName: result.fileName, lobbyMusicSize: file.size });
      } else {
        showMessage(result.error || 'Error al guardar música de lobby', 'error');
        return;
      }
    } else {
      // Modo archivo local: guardar en localStorage
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(e.target.result)));
        localStorage.setItem('lobbyMusicFile', base64);
        localStorage.setItem('lobbyMusicName', file.name);
        localStorage.setItem('lobbyMusicSize', file.size);
        
        lobbyMusicFile = URL.createObjectURL(file);
        showMessage('Música de lobby guardada exitosamente', 'success');
        updateMusicInterface({ lobbyMusicName: file.name, lobbyMusicSize: file.size });
      };
      reader.readAsArrayBuffer(file);
    }
    
    // Reproducir automáticamente si estamos en una pantalla de lobby
    if (currentMusicType !== 'battle') {
      playLobbyMusic();
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

  // Validar tamaño (10MB máximo)
  if (file.size > 10 * 1024 * 1024) {
    showMessage('El archivo es demasiado grande. Máximo 10MB', 'error');
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
        showMessage('Música de batalla guardada exitosamente', 'success');
        battleMusicFile = result.musicPath;
        updateMusicInterface({ battleMusicName: result.fileName, battleMusicSize: file.size });
      } else {
        showMessage(result.error || 'Error al guardar música de batalla', 'error');
        return;
      }
    } else {
      // Modo archivo local: guardar en localStorage
      const reader = new FileReader();
      reader.onload = function(e) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(e.target.result)));
        localStorage.setItem('battleMusicFile', base64);
        localStorage.setItem('battleMusicName', file.name);
        localStorage.setItem('battleMusicSize', file.size);
        
        battleMusicFile = URL.createObjectURL(file);
        showMessage('Música de batalla guardada exitosamente', 'success');
        updateMusicInterface({ battleMusicName: file.name, battleMusicSize: file.size });
      };
      reader.readAsArrayBuffer(file);
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
      // Modo archivo local: cargar desde localStorage
      const savedLobbyMusic = localStorage.getItem('lobbyMusicFile');
      const savedBattleMusic = localStorage.getItem('battleMusicFile');
      
      if (savedLobbyMusic) {
        const lobbyBlob = new Blob([Uint8Array.from(atob(savedLobbyMusic), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
        lobbyMusicFile = URL.createObjectURL(lobbyBlob);
      }
      
      if (savedBattleMusic) {
        const battleBlob = new Blob([Uint8Array.from(atob(savedBattleMusic), c => c.charCodeAt(0))], { type: 'audio/mpeg' });
        battleMusicFile = URL.createObjectURL(battleBlob);
      }
      
      const config = {
        lobbyMusicName: localStorage.getItem('lobbyMusicName'),
        battleMusicName: localStorage.getItem('battleMusicName'),
        lobbyMusicSize: localStorage.getItem('lobbyMusicSize'),
        battleMusicSize: localStorage.getItem('battleMusicSize')
      };
      
      updateMusicInterface(config);
    }
    
    console.log('🎵 Configuración de música cargada');
  } catch (error) {
    console.error('Error al cargar configuración de música:', error);
  }
}

function updateMusicInterface(config) {
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
      lobbyInfo.innerHTML = 'No hay música configurada';
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
      battleInfo.innerHTML = 'No hay música configurada';
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
}

function playLobbyMusic() {
  if (lobbyMusicFile && isMusicEnabled) {
    stopMusic();
    currentAudio = new Audio(lobbyMusicFile);
    currentAudio.loop = true;
    currentAudio.volume = isMusicMuted ? 0 : 0.5;
    currentMusicType = 'lobby';
    
    currentAudio.play().then(() => {
      console.log('🎵 Reproduciendo música de lobby automáticamente');
      isMusicPaused = false;
    }).catch(error => {
      console.error('Error al reproducir música de lobby:', error);
    });
  }
}

function playBattleMusic() {
  if (battleMusicFile && isMusicEnabled) {
    stopMusic();
    currentAudio = new Audio(battleMusicFile);
    currentAudio.loop = true;
    currentAudio.volume = isMusicMuted ? 0 : 0.5;
    currentMusicType = 'battle';
    
    currentAudio.play().then(() => {
      console.log('⚔️ Reproduciendo música de batalla automáticamente');
      isMusicPaused = false;
    }).catch(error => {
      console.error('Error al reproducir música de batalla:', error);
    });
  }
}

function stopMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
    isMusicPaused = true;
  }
}

function toggleBattleMusic() {
  if (currentMusicType === 'battle') {
    if (isMusicPaused) {
      currentAudio.play();
      isMusicPaused = false;
    } else {
      currentAudio.pause();
      isMusicPaused = true;
    }
  }
}

function toggleLobbyMusic() {
  if (currentMusicType === 'lobby') {
    if (isMusicPaused) {
      currentAudio.play();
      isMusicPaused = false;
    } else {
      currentAudio.pause();
      isMusicPaused = true;
    }
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

      const result = await response.json();

      if (response.ok) {
        showMessage('Música de lobby eliminada exitosamente', 'success');
      } else {
        showMessage(result.error || 'Error al eliminar música de lobby', 'error');
        return;
      }
    } else {
      // Modo archivo local: eliminar de localStorage
      localStorage.removeItem('lobbyMusicFile');
      localStorage.removeItem('lobbyMusicName');
      localStorage.removeItem('lobbyMusicSize');
      showMessage('Música de lobby eliminada exitosamente', 'success');
    }
    
    // Limpiar variables
    lobbyMusicFile = null;
    
    // Actualizar interfaz
    const info = document.getElementById('lobby-music-info');
    const preview = document.getElementById('lobby-music-preview');
    const removeBtn = document.getElementById('remove-lobby-music');
    
    if (info) info.innerHTML = 'No hay música configurada';
    if (preview) preview.innerHTML = '';
    if (removeBtn) removeBtn.classList.add('hidden');
    
    // Detener reproducción si está sonando
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

      const result = await response.json();

      if (response.ok) {
        showMessage('Música de batalla eliminada exitosamente', 'success');
      } else {
        showMessage(result.error || 'Error al eliminar música de batalla', 'error');
        return;
      }
    } else {
      // Modo archivo local: eliminar de localStorage
      localStorage.removeItem('battleMusicFile');
      localStorage.removeItem('battleMusicName');
      localStorage.removeItem('battleMusicSize');
      showMessage('Música de batalla eliminada exitosamente', 'success');
    }
    
    // Limpiar variables
    battleMusicFile = null;
    
    // Actualizar interfaz
    const info = document.getElementById('battle-music-info');
    const preview = document.getElementById('battle-music-preview');
    const removeBtn = document.getElementById('remove-battle-music');
    
    if (info) info.innerHTML = 'No hay música configurada';
    if (preview) preview.innerHTML = '';
    if (removeBtn) removeBtn.classList.add('hidden');
    
    // Detener reproducción si está sonando
    if (currentMusicType === 'battle') {
      stopMusic();
    }
  } catch (error) {
    console.error('Error al eliminar música de batalla:', error);
    showMessage('Error al eliminar música de batalla', 'error');
  }
}

// Inicializar sistema de música
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
    
    // Cargar rutas guardadas en localStorage como fallback
    const savedLobbyPath = localStorage.getItem('lobbyMusicPath');
    const savedBattlePath = localStorage.getItem('battleMusicPath');
    
    if (savedLobbyPath && !lobbyMusicFile) {
      lobbyMusicFile = savedLobbyPath;
    }
    
    if (savedBattlePath && !battleMusicFile) {
      battleMusicFile = savedBattlePath;
    }
    
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
      showMessage('Inicio de sesión exitoso', 'success');
      
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
    if (errorDiv) errorDiv.textContent = 'Error en el servidor';
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