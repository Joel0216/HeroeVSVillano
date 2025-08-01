// standalone.js - Versión completamente independiente

// Datos iniciales almacenados en localStorage
const initializeData = () => {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      {
        id: 'admin_001',
        username: 'joel_adminofficial',
        password: '080406',
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
    // Usar imagen local por defecto
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" fill="${characterType === 'hero' ? '#3b82f6' : '#ef4444'}"/>
        <text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">${characterName}</text>
      </svg>
    `)}`;
  }
  
  // Si hay URL, devolver con manejo de error
  return imageUrl;
}

// Función para crear elemento img con manejo de errores
function createImageElement(imageUrl, altText, className = '') {
  const fallbackImage = `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="#6b7280"/>
      <text x="50" y="50" font-family="Arial" font-size="12" fill="white" text-anchor="middle" dy=".3em">Sin imagen</text>
    </svg>
  `)}`;
  
  return `<img src="${imageUrl}" alt="${altText}" class="${className}" onerror="this.src='${fallbackImage}'">`;
}

// Función para mostrar mensajes
function showMessage(message, type = 'info') {
  const existingMessage = document.querySelector('.message-toast');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = `message-toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// Pantallas
const landing = document.getElementById('landing');
const auth = document.getElementById('auth');
const adminPanel = document.getElementById('admin-panel');
const characterSelection = document.getElementById('character-selection');
const teamsConfirmed = document.getElementById('teams-confirmed');
const battleScreen = document.getElementById('battle-screen');

// Variables globales para música
let lobbyMusicFile = null;
let battleMusicFile = null;
let currentAudio = null;
let currentMusicType = null;
let musicInitialized = false;
let isMusicEnabled = true;

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

// Eventos de los botones principales
const btnRegister = document.getElementById('btn-register');
const btnLogin = document.getElementById('btn-login');

btnRegister.addEventListener('click', () => {
  showScreen(auth);
  renderAuthForm('register');
});

btnLogin.addEventListener('click', () => {
  showScreen(auth);
  renderAuthForm('login');
});

// Renderizar formulario de autenticación
function renderAuthForm(mode) {
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
  document.getElementById('back-to-landing').onclick = () => showScreen(landing);
  document.getElementById('auth-form').onsubmit = (e) => {
    e.preventDefault();
    handleAuth(mode);
  };
}

// Manejar autenticación
async function handleAuth(mode) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('auth-error');
  errorDiv.textContent = '';
  
  try {
    if (!canMakeFetch()) {
      throw new Error('No se puede hacer autenticación en modo file://');
    }
    
    const endpoint = mode === 'register' ? '/api/auth/register' : '/api/auth/login';
    
    const response = await apiFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    
    // Guardar token y datos del usuario
    localStorage.setItem('token', response.token);
    localStorage.setItem('currentUser', JSON.stringify({
      username: username,
      userId: response.userId,
      role: response.role
    }));
    
    showMessage(mode === 'register' ? 'Usuario registrado exitosamente' : 'Inicio de sesión exitoso', 'success');
    
    setTimeout(() => {
      if (response.role === 'admin') {
        showAdminPanel();
      } else {
        showCharacterSelection();
      }
    }, 1000);
    
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    // Mostrar mensaje de error específico
    if (error.message.includes('file://')) {
      errorDiv.textContent = 'Error: Debes acceder desde http://localhost:3001, no desde file://';
    } else if (error.message.includes('401')) {
      errorDiv.textContent = 'Usuario o contraseña incorrectos';
    } else if (error.message.includes('400')) {
      errorDiv.textContent = 'El usuario ya existe';
    } else {
      errorDiv.textContent = 'Error en el servidor';
    }
  }
}

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

function renderAdminPanel() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
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
        
        <!-- Música de Lobby -->
        <div class="mb-6">
          <h4 class="text-lg font-semibold mb-3">🎮 Música de Lobby (Fondo General)</h4>
          <div class="bg-blue-50 p-4 rounded-lg mb-3">
            <p class="text-sm text-blue-800">Se reproducirá automáticamente en: Landing, Admin, Selección de Personajes</p>
          </div>
          <div class="flex items-center gap-4">
            <input type="file" id="lobby-music-input" accept=".mp3" class="hidden">
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
            <input type="file" id="battle-music-input" accept=".mp3" class="hidden">
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
  document.getElementById('hero-form').addEventListener('submit', handleAddHero);
  document.getElementById('villain-form').addEventListener('submit', handleAddVillain);
  
  // Event listeners para música
  document.getElementById('lobby-music-input').addEventListener('change', handleLobbyMusicUpload);
  document.getElementById('battle-music-input').addEventListener('change', handleBattleMusicUpload);
  document.getElementById('play-lobby-music').addEventListener('click', playLobbyMusic);
  document.getElementById('play-battle-music').addEventListener('click', playBattleMusic);
  document.getElementById('stop-music').addEventListener('click', stopMusic);
  
  // Cargar listas
  loadHeroes();
  loadVillains();
  
  // Cargar música guardada si existe
  loadSavedMusic();
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
    
    showMessage('Héroe agregado exitosamente', 'success');
    e.target.reset();
    loadHeroes();
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
    
    showMessage('Villano agregado exitosamente', 'success');
    e.target.reset();
    loadVillains();
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error al agregar villano', 'error');
  }
}

// Funciones para manejar música
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
    const result = await uploadFile('/api/music/lobby', file, 'lobbyMusic');
    
    showMessage('Música de lobby guardada exitosamente', 'success');
    
    // Actualizar la interfaz
    const info = document.getElementById('lobby-music-info');
    const preview = document.getElementById('lobby-music-preview');
    const removeBtn = document.getElementById('remove-lobby-music');
    
    if (info) info.innerHTML = `✅ ${result.fileName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    if (preview) preview.innerHTML = `
      <audio controls class="w-full mt-2">
        <source src="${result.musicPath}" type="audio/mpeg">
      </audio>
    `;
    if (removeBtn) removeBtn.classList.remove('hidden');
    
    // Cargar la nueva configuración de música
    await loadMusicConfig();
    
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
    const result = await uploadFile('/api/music/battle', file, 'battleMusic');
    
    showMessage('Música de batalla guardada exitosamente', 'success');
    
    // Actualizar la interfaz
    const info = document.getElementById('battle-music-info');
    const preview = document.getElementById('battle-music-preview');
    const removeBtn = document.getElementById('remove-battle-music');
    
    if (info) info.innerHTML = `✅ ${result.fileName} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    if (preview) preview.innerHTML = `
      <audio controls class="w-full mt-2">
        <source src="${result.musicPath}" type="audio/mpeg">
      </audio>
    `;
    if (removeBtn) removeBtn.classList.remove('hidden');
    
    // Cargar la nueva configuración de música
    await loadMusicConfig();
  } catch (error) {
    console.error('Error al subir música de batalla:', error);
    showMessage('Error al subir música de batalla', 'error');
  }
}

async function loadMusicConfig() {
  try {
    if (!canMakeFetch()) {
      console.log('⚠️ Modo file:// detectado, usando configuración local de música');
      // Usar configuración local si está disponible
      const localConfig = JSON.parse(localStorage.getItem('musicConfig') || '{}');
      if (localConfig.lobbyMusic || localConfig.battleMusic) {
        updateMusicInterface(localConfig);
      }
      return;
    }
    
    const config = await apiFetch('/api/music/config');
    console.log('✅ Configuración de música cargada:', config);
    updateMusicInterface(config);
    
    // Guardar configuración localmente como fallback
    localStorage.setItem('musicConfig', JSON.stringify(config));
  } catch (error) {
    console.error('❌ Error cargando configuración de música:', error);
    
    // Intentar usar configuración local como fallback
    try {
      const localConfig = JSON.parse(localStorage.getItem('musicConfig') || '{}');
      if (localConfig.lobbyMusic || localConfig.battleMusic) {
        console.log('🔄 Usando configuración local como fallback');
        updateMusicInterface(localConfig);
      }
    } catch (fallbackError) {
      console.error('❌ Error con fallback local:', fallbackError);
    }
  }
}

function updateMusicInterface(config) {
  // Actualizar información de música de lobby
  const lobbyInfo = document.getElementById('lobby-music-info');
  const lobbyPreview = document.getElementById('lobby-music-preview');
  const lobbyRemoveBtn = document.getElementById('remove-lobby-music');
  
  if (lobbyInfo) {
    if (config.lobbyMusicName) {
      lobbyInfo.innerHTML = `✅ ${config.lobbyMusicName} (${(config.lobbyMusicSize / 1024 / 1024).toFixed(2)} MB)`;
      if (lobbyRemoveBtn) lobbyRemoveBtn.classList.remove('hidden');
    } else {
      lobbyInfo.innerHTML = 'No hay música configurada';
      if (lobbyRemoveBtn) lobbyRemoveBtn.classList.add('hidden');
    }
  }
  
  if (lobbyPreview && config.lobbyMusic) {
    lobbyPreview.innerHTML = `
      <audio controls class="w-full mt-2">
        <source src="${config.lobbyMusic}" type="audio/mpeg">
      </audio>
    `;
  }
  
  // Actualizar información de música de batalla
  const battleInfo = document.getElementById('battle-music-info');
  const battlePreview = document.getElementById('battle-music-preview');
  const battleRemoveBtn = document.getElementById('remove-battle-music');
  
  if (battleInfo) {
    if (config.battleMusicName) {
      battleInfo.innerHTML = `✅ ${config.battleMusicName} (${(config.battleMusicSize / 1024 / 1024).toFixed(2)} MB)`;
      if (battleRemoveBtn) battleRemoveBtn.classList.remove('hidden');
    } else {
      battleInfo.innerHTML = 'No hay música configurada';
      if (battleRemoveBtn) battleRemoveBtn.classList.add('hidden');
    }
  }
  
  if (battlePreview && config.battleMusic) {
    battlePreview.innerHTML = `
      <audio controls class="w-full mt-2">
        <source src="${config.battleMusic}" type="audio/mpeg">
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
    // Verificar autenticación antes de eliminar
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }
    
    if (!isAdmin()) {
      throw new Error('Solo los administradores pueden eliminar música.');
    }
    
    const token = getAuthToken();
    
    const result = await apiFetch('/api/music/lobby', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    showMessage('Música de lobby eliminada exitosamente', 'success');
    
    // Limpiar variables
    lobbyMusicFile = null;
    localStorage.removeItem('lobbyMusicPath');
    
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
    showMessage(error.message, 'error');
  }
}

async function removeBattleMusic() {
  try {
    // Verificar autenticación antes de eliminar
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }
    
    if (!isAdmin()) {
      throw new Error('Solo los administradores pueden eliminar música.');
    }
    
    const token = getAuthToken();
    
    const result = await apiFetch('/api/music/battle', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    showMessage('Música de batalla eliminada exitosamente', 'success');
    
    // Limpiar variables
    battleMusicFile = null;
    localStorage.removeItem('battleMusicPath');
    
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
    showMessage(error.message, 'error');
  }
}

// Cargar héroes desde localStorage
async function loadHeroes() {
  try {
    if (!canMakeFetch()) {
      console.log('⚠️ Modo file:// detectado, usando datos locales para héroes');
      return;
    }
    
    const heroes = await apiFetch('/api/heroes');
    heroesData = heroes;
    console.log('✅ Héroes cargados:', heroesData.length);
  } catch (error) {
    console.error('❌ Error cargando héroes:', error);
    showMessage('Error cargando héroes', 'error');
  }
}

// Cargar villanos desde localStorage
async function loadVillains() {
  try {
    if (!canMakeFetch()) {
      console.log('⚠️ Modo file:// detectado, usando datos locales para villanos');
      return;
    }
    
    const villains = await apiFetch('/api/villains');
    villainsData = villains;
    console.log('✅ Villanos cargados:', villainsData.length);
  } catch (error) {
    console.error('❌ Error cargando villanos:', error);
    showMessage('Error cargando villanos', 'error');
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
    showMessage('Héroe actualizado exitosamente', 'success');
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
    showMessage('Villano actualizado exitosamente', 'success');
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
      showMessage('Héroe eliminado exitosamente', 'success');
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
      showMessage('Villano eliminado exitosamente', 'success');
    } catch (error) {
      console.error('Error al eliminar villano:', error);
      showMessage('Error al eliminar villano', 'error');
    }
  }
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

function renderBattleScreen() {
  const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
  const villains = JSON.parse(localStorage.getItem('villains') || '[]');
  const selectedHeroIds = JSON.parse(localStorage.getItem('battleHeroes') || '[]');
  const selectedVillainIds = JSON.parse(localStorage.getItem('battleVillains') || '[]');
  
  const battleHeroes = heroes.filter(h => selectedHeroIds.includes(h.heroId));
  const battleVillains = villains.filter(v => selectedVillainIds.includes(v.villainId));
  
  battleScreen.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 w-full max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">⚔️ BATALLA EN CURSO ⚔️</h2>
      
      <!-- Equipos -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        
        <!-- Equipo Héroes -->
        <div class="bg-blue-900 bg-opacity-80 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-blue-200 mb-4 text-center">🦸‍♂️ EQUIPO HÉROES</h3>
          <div class="space-y-4">
            ${battleHeroes.map((hero, index) => `
              <div class="battle-card bg-white bg-opacity-90 rounded-lg p-4">
                <div class="flex items-center space-x-4">
                  ${createImageElement(getImageWithFallback(hero.image, hero.name, 'hero'), hero.name, 'w-16 h-16 object-cover rounded-full')}
                  <div class="flex-1">
                    <div class="font-bold text-lg">${hero.name}</div>
                    <div class="text-sm text-gray-600">${hero.alias}</div>
                    <div class="text-xs text-gray-500">${hero.city} - ${hero.team}</div>
                  </div>
                  <div class="flex flex-col space-y-2">
                    <button onclick="heroAttack(${index}, 'normal')" id="hero-attack-${index}" class="attack-button px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300 transform hover:scale-105">
                      ⚔️ Golpe
                    </button>
                    <button onclick="heroAttack(${index}, 'special')" id="hero-special-${index}" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 opacity-50" disabled>
                      ✨ Especial
                    </button>
                  </div>
                </div>
                <!-- Barra de poder -->
                <div class="mt-3">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Poder</span>
                    <span id="hero-power-${index}">0%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="hero-power-bar-${index}" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                  </div>
                </div>
                <!-- Escudo -->
                <div class="mt-2">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Escudo</span>
                    <span id="hero-shield-${index}">100</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="hero-shield-bar-${index}" class="bg-blue-400 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
                <!-- Vida -->
                <div class="mt-2">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Vida</span>
                    <span id="hero-health-${index}">100%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="hero-health-bar-${index}" class="bg-green-500 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
        
        <!-- Equipo Villanos -->
        <div class="bg-red-900 bg-opacity-80 p-6 rounded-lg">
          <h3 class="text-2xl font-bold text-red-200 mb-4 text-center">🦹‍♂️ EQUIPO VILLANOS</h3>
          <div class="space-y-4">
            ${battleVillains.map((villain, index) => `
              <div class="battle-card bg-white bg-opacity-90 rounded-lg p-4">
                <div class="flex items-center space-x-4">
                  ${createImageElement(getImageWithFallback(villain.image, villain.name, 'villain'), villain.name, 'w-16 h-16 object-cover rounded-full')}
                  <div class="flex-1">
                    <div class="font-bold text-lg">${villain.name}</div>
                    <div class="text-sm text-gray-600">${villain.alias}</div>
                    <div class="text-xs text-gray-500">${villain.city} - ${villain.team}</div>
                  </div>
                  <div class="flex flex-col space-y-2">
                    <button onclick="villainAttack(${index}, 'normal')" id="villain-attack-${index}" class="attack-button px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all duration-300 transform hover:scale-105">
                      ⚔️ Golpe
                    </button>
                    <button onclick="villainAttack(${index}, 'special')" id="villain-special-${index}" class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 opacity-50" disabled>
                      ✨ Especial
                    </button>
                  </div>
                </div>
                <!-- Barra de poder -->
                <div class="mt-3">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Poder</span>
                    <span id="villain-power-${index}">0%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="villain-power-bar-${index}" class="bg-red-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                  </div>
                </div>
                <!-- Escudo -->
                <div class="mt-2">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Escudo</span>
                    <span id="villain-shield-${index}">100</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="villain-shield-bar-${index}" class="bg-blue-400 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
                <!-- Vida -->
                <div class="mt-2">
                  <div class="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Vida</span>
                    <span id="villain-health-${index}">100%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div id="villain-health-bar-${index}" class="bg-green-500 h-2 rounded-full transition-all duration-300" style="width: 100%"></div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      
      <!-- Controles de batalla -->
      <div class="flex gap-4">
        <button onclick="endBattle()" class="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition">
          🏁 Terminar Batalla
        </button>
        <button onclick="resetBattle()" class="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition">
          🔄 Reiniciar
        </button>
        <button onclick="toggleBattleMusic()" id="music-toggle" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition">
          🔊 Música
        </button>
      </div>
      
      <!-- Log de batalla -->
      <div class="bg-black bg-opacity-50 p-4 rounded-lg w-full max-h-32 overflow-y-auto">
        <h4 class="text-white font-bold mb-2">📜 Log de Batalla:</h4>
        <div id="battle-log" class="text-white text-sm space-y-1">
          <div>⚔️ ¡La batalla ha comenzado!</div>
        </div>
      </div>
    </div>
  `;
  
  // Inicializar estado de batalla
  initializeBattleState();
}

// Estado de batalla
let battleState = {
  heroes: [],
  villains: [],
  turn: 0
};

// Inicializar estado de batalla
function initializeBattleState() {
  const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
  const villains = JSON.parse(localStorage.getItem('villains') || '[]');
  const selectedHeroIds = JSON.parse(localStorage.getItem('battleHeroes') || '[]');
  const selectedVillainIds = JSON.parse(localStorage.getItem('battleVillains') || '[]');
  
  const battleHeroes = heroes.filter(h => selectedHeroIds.includes(h.heroId));
  const battleVillains = villains.filter(v => selectedVillainIds.includes(v.villainId));
  
  battleState = {
    heroes: battleHeroes.map(hero => ({
      ...hero,
      health: 200,
      power: 0,
      maxHealth: 200,
      maxPower: 100,
      shield: 100
    })),
    villains: battleVillains.map(villain => ({
      ...villain,
      health: 200,
      power: 0,
      maxHealth: 200,
      maxPower: 100,
      shield: 100
    })),
    turn: 0,
    // Nuevas propiedades para controlar quién puede atacar
    activeHeroIndex: 0,  // Solo el primer héroe puede atacar inicialmente
    activeVillainIndex: 0  // Solo el primer villano puede atacar inicialmente
  };
  
  updateBattleUI();
}

// Actualizar UI de batalla
function updateBattleUI() {
  // Encontrar próximos objetivos
  const nextHeroTarget = battleState.heroes.findIndex(hero => hero.health > 0);
  const nextVillainTarget = battleState.villains.findIndex(villain => villain.health > 0);
  
  // Actualizar héroes
  battleState.heroes.forEach((hero, index) => {
    const powerBar = document.getElementById(`hero-power-bar-${index}`);
    const powerText = document.getElementById(`hero-power-${index}`);
    const shieldBar = document.getElementById(`hero-shield-bar-${index}`);
    const shieldText = document.getElementById(`hero-shield-${index}`);
    const healthBar = document.getElementById(`hero-health-bar-${index}`);
    const healthText = document.getElementById(`hero-health-${index}`);
    const specialBtn = document.getElementById(`hero-special-${index}`);
    const attackBtn = document.getElementById(`hero-attack-${index}`);
    const card = document.querySelector(`#hero-attack-${index}`).closest('.battle-card');
    
    if (powerBar) {
      powerBar.style.width = `${hero.power}%`;
      powerText.textContent = `${Math.round(hero.power)}%`;
      
      // Agregar animación de llenado
      if (hero.power > 0) {
        powerBar.classList.add('power-bar-fill');
        setTimeout(() => powerBar.classList.remove('power-bar-fill'), 500);
      }
    }
    
    if (shieldBar) {
      const shieldPercentage = (hero.shield / 100) * 100;
      shieldBar.style.width = `${shieldPercentage}%`;
      shieldText.textContent = `${hero.shield}`;
    }
    
    if (healthBar) {
      const healthPercentage = (hero.health / hero.maxHealth) * 100;
      healthBar.style.width = `${healthPercentage}%`;
      healthText.textContent = `${hero.health}/${hero.maxHealth}`;
      
      // Cambiar color de vida
      if (healthPercentage > 50) {
        healthBar.className = 'bg-green-500 h-2 rounded-full transition-all duration-300';
      } else if (healthPercentage > 25) {
        healthBar.className = 'bg-yellow-500 h-2 rounded-full transition-all duration-300';
      } else {
        healthBar.className = 'bg-red-500 h-2 rounded-full transition-all duration-300';
      }
    }
    
    // Si el héroe está eliminado
    if (hero.health <= 0) {
      if (card) {
        card.classList.add('eliminated');
      }
      if (attackBtn) {
        attackBtn.disabled = true;
      }
      if (specialBtn) {
        specialBtn.disabled = true;
        specialBtn.classList.remove('special-ready', 'attack-button');
      }
    } else {
      if (card) {
        card.classList.remove('eliminated');
      }
      
      // Solo el héroe activo puede atacar
      const isActiveHero = index === battleState.activeHeroIndex;
      
      if (attackBtn) {
        attackBtn.disabled = !isActiveHero;
        if (isActiveHero) {
          attackBtn.classList.remove('opacity-50');
          card.classList.add('active-character');
        } else {
          attackBtn.classList.add('opacity-50');
          card.classList.remove('active-character');
        }
      }
      
      // Habilitar/deshabilitar botón especial con animaciones
      if (specialBtn) {
        if (hero.power >= 100 && isActiveHero) {
          specialBtn.disabled = false;
          specialBtn.classList.remove('opacity-50');
          specialBtn.classList.add('special-ready');
          specialBtn.classList.add('attack-button');
        } else {
          specialBtn.disabled = true;
          specialBtn.classList.add('opacity-50');
          specialBtn.classList.remove('special-ready');
          specialBtn.classList.remove('attack-button');
        }
      }
    }
  });
  
  // Actualizar villanos
  battleState.villains.forEach((villain, index) => {
    const powerBar = document.getElementById(`villain-power-bar-${index}`);
    const powerText = document.getElementById(`villain-power-${index}`);
    const shieldBar = document.getElementById(`villain-shield-bar-${index}`);
    const shieldText = document.getElementById(`villain-shield-${index}`);
    const healthBar = document.getElementById(`villain-health-bar-${index}`);
    const healthText = document.getElementById(`villain-health-${index}`);
    const specialBtn = document.getElementById(`villain-special-${index}`);
    const attackBtn = document.getElementById(`villain-attack-${index}`);
    const card = document.querySelector(`#villain-attack-${index}`).closest('.battle-card');
    
    if (powerBar) {
      powerBar.style.width = `${villain.power}%`;
      powerText.textContent = `${Math.round(villain.power)}%`;
      
      // Agregar animación de llenado
      if (villain.power > 0) {
        powerBar.classList.add('power-bar-fill');
        setTimeout(() => powerBar.classList.remove('power-bar-fill'), 500);
      }
    }
    
    if (shieldBar) {
      const shieldPercentage = (villain.shield / 100) * 100;
      shieldBar.style.width = `${shieldPercentage}%`;
      shieldText.textContent = `${villain.shield}`;
    }
    
    if (healthBar) {
      const healthPercentage = (villain.health / villain.maxHealth) * 100;
      healthBar.style.width = `${healthPercentage}%`;
      healthText.textContent = `${villain.health}/${villain.maxHealth}`;
      
      // Cambiar color de vida
      if (healthPercentage > 50) {
        healthBar.className = 'bg-green-500 h-2 rounded-full transition-all duration-300';
      } else if (healthPercentage > 25) {
        healthBar.className = 'bg-yellow-500 h-2 rounded-full transition-all duration-300';
      } else {
        healthBar.className = 'bg-red-500 h-2 rounded-full transition-all duration-300';
      }
    }
    
    // Si el villano está eliminado
    if (villain.health <= 0) {
      if (card) {
        card.classList.add('eliminated');
      }
      if (attackBtn) {
        attackBtn.disabled = true;
      }
      if (specialBtn) {
        specialBtn.disabled = true;
        specialBtn.classList.remove('special-ready', 'attack-button');
      }
    } else {
      if (card) {
        card.classList.remove('eliminated');
      }
      
      // Solo el villano activo puede atacar
      const isActiveVillain = index === battleState.activeVillainIndex;
      
      if (attackBtn) {
        attackBtn.disabled = !isActiveVillain;
        if (isActiveVillain) {
          attackBtn.classList.remove('opacity-50');
          card.classList.add('active-character');
        } else {
          attackBtn.classList.add('opacity-50');
          card.classList.remove('active-character');
        }
      }
      
      // Habilitar/deshabilitar botón especial con animaciones
      if (specialBtn) {
        if (villain.power >= 100 && isActiveVillain) {
          specialBtn.disabled = false;
          specialBtn.classList.remove('opacity-50');
          specialBtn.classList.add('special-ready');
          specialBtn.classList.add('attack-button');
        } else {
          specialBtn.disabled = true;
          specialBtn.classList.add('opacity-50');
          specialBtn.classList.remove('special-ready');
          specialBtn.classList.remove('attack-button');
        }
      }
    }
    
    // Marcar próximo objetivo para villanos
    if (index === nextVillainTarget && villain.health > 0) {
      if (card) {
        card.classList.add('next-target');
      }
    } else {
      if (card) {
        card.classList.remove('next-target');
      }
    }
  });
  
  // Marcar próximo objetivo para héroes
  battleState.heroes.forEach((hero, index) => {
    const card = document.querySelector(`#hero-attack-${index}`).closest('.battle-card');
    if (index === nextHeroTarget && hero.health > 0) {
      if (card) {
        card.classList.add('next-target');
      }
    } else {
      if (card) {
        card.classList.remove('next-target');
      }
    }
  });
}

// Ataque de héroe
function heroAttack(heroIndex, attackType) {
  const hero = battleState.heroes[heroIndex];
  
  // Encontrar el primer villano vivo
  let targetIndex = -1;
  for (let i = 0; i < battleState.villains.length; i++) {
    if (battleState.villains[i].health > 0) {
      targetIndex = i;
      break;
    }
  }
  
  // Si no hay villanos vivos, terminar batalla
  if (targetIndex === -1) {
    addBattleLog(`🏆 ¡Los HÉROES han ganado la batalla!`);
    showMessage('Los héroes han ganado!', 'success');
    return;
  }
  
  const target = battleState.villains[targetIndex];
  
  let damage = 0;
  let powerGain = 0;
  
  if (attackType === 'normal') {
    damage = Math.floor(Math.random() * 20) + 10; // 10-30 daño
    powerGain = Math.floor(Math.random() * 15) + 10; // 10-25 poder
  } else if (attackType === 'special') {
    damage = Math.floor(Math.random() * 40) + 30; // 30-70 daño
    powerGain = 0; // Consume todo el poder
    hero.power = 0;
  }
  
  // Aplicar daño primero al escudo, luego a la vida
  let remainingDamage = damage;
  
  // Primero reducir el escudo
  if (target.shield > 0) {
    if (target.shield >= remainingDamage) {
      target.shield -= remainingDamage;
      remainingDamage = 0;
    } else {
      remainingDamage -= target.shield;
      target.shield = 0;
    }
  }
  
  // Si queda daño, aplicarlo a la vida
  if (remainingDamage > 0) {
    target.health = Math.max(0, target.health - remainingDamage);
  }
  
  // Ganar poder (solo en ataque normal)
  if (attackType === 'normal') {
    hero.power = Math.min(100, hero.power + powerGain);
  }
  
  // Agregar animación de daño
  const targetHealthBar = document.getElementById(`villain-health-bar-${targetIndex}`);
  if (targetHealthBar) {
    targetHealthBar.classList.add('health-bar-damage');
    setTimeout(() => targetHealthBar.classList.remove('health-bar-damage'), 300);
  }
  
  // Mostrar animación especial dinámica
  if (attackType === 'special') {
    showDynamicSpecialAnimation(hero, heroIndex, 'hero');
  }
  
  // Agregar al log con información de posición
  const positionText = targetIndex === 0 ? 'primero' : targetIndex === 1 ? 'segundo' : 'tercero';
  let damageMessage = '';
  if (damage > 0 && target.shield > 0) {
    const shieldDamage = Math.min(damage, target.shield);
    const healthDamage = damage - shieldDamage;
    if (healthDamage > 0) {
      damageMessage = `(-${shieldDamage} escudo, -${healthDamage} vida)`;
    } else {
      damageMessage = `(-${shieldDamage} escudo)`;
    }
  } else if (damage > 0) {
    damageMessage = `(-${damage} vida)`;
  }
  addBattleLog(`🦸‍♂️ ${hero.name} ataca al ${positionText} villano (${target.name}) con ${attackType === 'normal' ? 'Golpe' : 'Especial'} ${damageMessage}`);
  
  // Si el villano fue eliminado, mostrar mensaje
  if (target.health <= 0) {
    addBattleLog(`💀 ${target.name} ha sido eliminado!`);
    
    // Agregar animación de eliminación
    const targetCard = document.querySelector(`#villain-attack-${targetIndex}`).closest('.battle-card');
    if (targetCard) {
      targetCard.classList.add('elimination-animation');
      setTimeout(() => targetCard.classList.remove('elimination-animation'), 500);
    }
    
    // Si el villano eliminado era el activo, activar el siguiente villano vivo
    if (targetIndex === battleState.activeVillainIndex) {
      const nextVillainIndex = battleState.villains.findIndex((v, i) => i > targetIndex && v.health > 0);
      if (nextVillainIndex !== -1) {
        battleState.activeVillainIndex = nextVillainIndex;
        addBattleLog(`🔄 ${battleState.villains[nextVillainIndex].name} es ahora el villano activo!`);
      }
    }
  }
  
  updateBattleUI();
  checkBattleEnd();
}

// Función dinámica para mostrar animación especial
function showDynamicSpecialAnimation(character, characterIndex, type) {
  // Crear el overlay de animación
  const animationOverlay = document.createElement('div');
  animationOverlay.className = 'iron-man-special';
  
  // Si hay URL de animación personalizada, usarla
  if (character.specialAttackAnimationUrl && character.specialAttackAnimationUrl.trim() !== '') {
    animationOverlay.innerHTML = `
      <div class="custom-animation">
        <img src="${character.specialAttackAnimationUrl}" alt="Animación especial" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'color: white; font-size: 24px; text-align: center;\\'>✨ ${character.name} usa su ataque especial! ✨</div>'">
      </div>
    `;
  } else {
    // Animación por defecto
    const emoji = type === 'hero' ? '🦸‍♂️' : '🦹‍♂️';
    animationOverlay.innerHTML = `
      <div class="iron-man-animation">
        <div class="iron-man-character">${emoji}</div>
        <div class="energy-beam"></div>
        <div class="energy-ring"></div>
        <div class="energy-streaks">
          ${Array.from({length: 6}, (_, i) => `
            <div class="energy-streak" style="
              left: ${30 + i * 60}px;
              animation-delay: ${i * 0.1}s;
            "></div>
          `).join('')}
        </div>
      </div>
    `;
  }
  
  // Agregar al DOM
  document.body.appendChild(animationOverlay);
  
  // Remover la animación después de 3 segundos
  setTimeout(() => {
    if (animationOverlay.parentNode) {
      animationOverlay.parentNode.removeChild(animationOverlay);
    }
  }, 3000);
}

// Ataque de villano
function villainAttack(villainIndex, attackType) {
  const villain = battleState.villains[villainIndex];
  
  // Encontrar el primer héroe vivo
  let targetIndex = -1;
  for (let i = 0; i < battleState.heroes.length; i++) {
    if (battleState.heroes[i].health > 0) {
      targetIndex = i;
      break;
    }
  }
  
  // Si no hay héroes vivos, terminar batalla
  if (targetIndex === -1) {
    addBattleLog(`🏆 ¡Los VILLANOS han ganado la batalla!`);
    showMessage('Los villanos han ganado!', 'error');
    return;
  }
  
  const target = battleState.heroes[targetIndex];
  
  let damage = 0;
  let powerGain = 0;
  
  if (attackType === 'normal') {
    damage = Math.floor(Math.random() * 20) + 10; // 10-30 daño
    powerGain = Math.floor(Math.random() * 15) + 10; // 10-25 poder
  } else if (attackType === 'special') {
    damage = Math.floor(Math.random() * 40) + 30; // 30-70 daño
    powerGain = 0; // Consume todo el poder
    villain.power = 0;
  }
  
  // Aplicar daño primero al escudo, luego a la vida
  let remainingDamage = damage;
  
  // Primero reducir el escudo
  if (target.shield > 0) {
    if (target.shield >= remainingDamage) {
      target.shield -= remainingDamage;
      remainingDamage = 0;
    } else {
      remainingDamage -= target.shield;
      target.shield = 0;
    }
  }
  
  // Si queda daño, aplicarlo a la vida
  if (remainingDamage > 0) {
    target.health = Math.max(0, target.health - remainingDamage);
  }
  
  // Ganar poder (solo en ataque normal)
  if (attackType === 'normal') {
    villain.power = Math.min(100, villain.power + powerGain);
  }
  
  // Mostrar animación especial dinámica
  if (attackType === 'special') {
    showDynamicSpecialAnimation(villain, villainIndex, 'villain');
  }
  
  // Agregar animación de daño
  const targetHealthBar = document.getElementById(`hero-health-bar-${targetIndex}`);
  if (targetHealthBar) {
    targetHealthBar.classList.add('health-bar-damage');
    setTimeout(() => targetHealthBar.classList.remove('health-bar-damage'), 300);
  }
  
  // Agregar al log con información de posición
  const positionText = targetIndex === 0 ? 'primero' : targetIndex === 1 ? 'segundo' : 'tercero';
  let damageMessage = '';
  if (damage > 0 && target.shield > 0) {
    const shieldDamage = Math.min(damage, target.shield);
    const healthDamage = damage - shieldDamage;
    if (healthDamage > 0) {
      damageMessage = `(-${shieldDamage} escudo, -${healthDamage} vida)`;
    } else {
      damageMessage = `(-${shieldDamage} escudo)`;
    }
  } else if (damage > 0) {
    damageMessage = `(-${damage} vida)`;
  }
  addBattleLog(`🦹‍♂️ ${villain.name} ataca al ${positionText} héroe (${target.name}) con ${attackType === 'normal' ? 'Golpe' : 'Especial'} ${damageMessage}`);
  
      // Si el héroe fue eliminado, mostrar mensaje
    if (target.health <= 0) {
      addBattleLog(`💀 ${target.name} ha sido eliminado!`);
      
      // Agregar animación de eliminación
      const targetCard = document.querySelector(`#hero-attack-${targetIndex}`).closest('.battle-card');
      if (targetCard) {
        targetCard.classList.add('elimination-animation');
        setTimeout(() => targetCard.classList.remove('elimination-animation'), 500);
      }
      
      // Si el héroe eliminado era el activo, activar el siguiente héroe vivo
      if (targetIndex === battleState.activeHeroIndex) {
        const nextHeroIndex = battleState.heroes.findIndex((h, i) => i > targetIndex && h.health > 0);
        if (nextHeroIndex !== -1) {
          battleState.activeHeroIndex = nextHeroIndex;
          addBattleLog(`🔄 ${battleState.heroes[nextHeroIndex].name} es ahora el héroe activo!`);
        }
      }
    }
    
      updateBattleUI();
  checkBattleEnd();
}



// Agregar entrada al log de batalla
function addBattleLog(message) {
  const battleLog = document.getElementById('battle-log');
  if (battleLog) {
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    battleLog.appendChild(logEntry);
    battleLog.scrollTop = battleLog.scrollHeight;
  }
}

// Verificar fin de batalla
function checkBattleEnd() {
  const heroesAlive = battleState.heroes.filter(h => h.health > 0).length;
  const villainsAlive = battleState.villains.filter(v => v.health > 0).length;
  
  if (heroesAlive === 0) {
    addBattleLog('🏆 ¡Los VILLANOS han ganado la batalla!');
    showMessage('Los villanos han ganado!', 'error');
  } else if (villainsAlive === 0) {
    addBattleLog('🏆 ¡Los HÉROES han ganado la batalla!');
    showMessage('Los héroes han ganado!', 'success');
  }
}

// Terminar batalla
function endBattle() {
  // Cambiar automáticamente a música de lobby
  if (currentMusicType !== 'lobby') {
    stopMusic();
    setTimeout(() => {
      if (lobbyMusicFile) {
        playLobbyMusic();
      }
    }, 300);
  }
  
  showMessage('Batalla terminada', 'info');
  showScreen(characterSelection);
  renderCharacterSelection();
}

// Reiniciar batalla
function resetBattle() {
  initializeBattleState();
  const battleLog = document.getElementById('battle-log');
  if (battleLog) {
    battleLog.innerHTML = '<div>⚔️ ¡La batalla ha comenzado!</div>';
  }
  showMessage('Batalla reiniciada', 'info');
}

// Función global para cerrar sesión
function logout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token'); // Limpiar token JWT
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

// Función helper para hacer fetch con manejo de errores CORS
async function apiFetch(endpoint, options = {}) {
  // Verificar si se puede hacer fetch
  if (!canMakeFetch()) {
    throw new Error('No se puede hacer fetch en modo file://');
  }
  
  const baseUrl = window.location.origin; // Usa localhost automáticamente
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Error desconocido'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error en fetch a ${endpoint}:`, error);
    
    // Si es error de CORS, mostrar mensaje específico
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      showMessage('Error: Debes acceder desde http://localhost:3001, no desde file://', 'error');
      console.error('💡 Solución: Ejecuta "node app.js" y accede desde http://localhost:3001');
    }
    
    // Si es error 401, redirigir al login
    if (error.message.includes('401')) {
      showMessage('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
      setTimeout(() => {
        logout();
        showScreen(landing);
      }, 2000);
    }
    
    throw error;
  }
}

// Función helper para subir archivos
async function uploadFile(endpoint, file, fieldName) {
  // Verificar si se puede hacer fetch
  if (!canMakeFetch()) {
    throw new Error('No se puede hacer fetch en modo file://');
  }
  
  const baseUrl = window.location.origin;
  const url = `${baseUrl}${endpoint}`;
  
  const formData = new FormData();
  formData.append(fieldName, file);
  
  try {
    // Verificar autenticación antes de subir
    if (!isAuthenticated()) {
      throw new Error('No estás autenticado. Por favor, inicia sesión.');
    }
    
    if (!isAdmin()) {
      throw new Error('Solo los administradores pueden subir música.');
    }
    
    const token = getAuthToken();
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Error desconocido'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al subir archivo a ${endpoint}:`, error);
    
    if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
      showMessage('Error: Debes acceder desde http://localhost:3001, no desde file://', 'error');
      console.error('💡 Solución: Ejecuta "node app.js" y accede desde http://localhost:3001');
    } else if (error.message.includes('401')) {
      showMessage('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
      setTimeout(() => {
        logout();
        showScreen(landing);
      }, 2000);
    } else if (error.message.includes('403')) {
      showMessage('Solo los administradores pueden subir música.', 'error');
    } else {
      showMessage(error.message, 'error');
    }
    
    throw error;
  }
}

// Variable global para detectar si estamos en modo file://
let isFileProtocol = false;

// Detectar si el usuario está accediendo desde file://
function checkFileProtocol() {
  if (window.location.protocol === 'file:') {
    isFileProtocol = true;
    
    const warningDiv = document.createElement('div');
    warningDiv.id = 'file-protocol-warning';
    warningDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(135deg, #ff6b6b, #ee5a24);
      color: white;
      padding: 20px;
      text-align: center;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      font-size: 16px;
      line-height: 1.5;
    `;
    warningDiv.innerHTML = `
      ⚠️ <strong>ERROR:</strong> Estás accediendo desde file:// 
      <br><br>
      <strong>Para que funcione correctamente:</strong>
      <br>1. Ejecuta: <code>node app.js</code>
      <br>2. Accede desde: <a href="http://localhost:3001" style="color: white; text-decoration: underline; font-weight: bold;">http://localhost:3001</a>
      <br><br>
      <button onclick="this.parentElement.remove()" style="margin: 10px; padding: 8px 16px; background: white; color: #ff6b6b; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Cerrar</button>
    `;
    document.body.appendChild(warningDiv);
    
    console.error('❌ Error: Acceso desde file:// detectado');
    console.log('💡 Solución: Ejecuta "node app.js" y accede desde http://localhost:3001');
    
    // Deshabilitar funcionalidades que requieren servidor
    disableServerFeatures();
    
    return true;
  }
  return false;
}

// Función para deshabilitar características que requieren servidor
function disableServerFeatures() {
  console.log('🔒 Deshabilitando características que requieren servidor...');
  
  // Deshabilitar botones de autenticación
  const authButtons = document.querySelectorAll('button[onclick*="showAuthForm"]');
  authButtons.forEach(button => {
    button.disabled = true;
    button.title = 'Requiere servidor local';
    button.style.opacity = '0.5';
  });
  
  // Deshabilitar botones de música
  const musicButtons = document.querySelectorAll('button[id*="music"]');
  musicButtons.forEach(button => {
    button.disabled = true;
    button.title = 'Requiere servidor local';
    button.style.opacity = '0.5';
  });
  
  // Deshabilitar formularios de admin
  const adminForms = document.querySelectorAll('form[id*="hero"], form[id*="villain"]');
  adminForms.forEach(form => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.title = 'Requiere servidor local';
      submitButton.style.opacity = '0.5';
    }
  });
}

// Función para verificar si se puede hacer fetch
function canMakeFetch() {
  if (isFileProtocol) {
    console.warn('⚠️ Modo file:// detectado, omitiendo llamadas a API');
    showMessage('Error: Debes acceder desde http://localhost:3001, no desde file://', 'error');
    return false;
  }
  return true;
}

// Ejecutar verificación al cargar
document.addEventListener('DOMContentLoaded', function() {
  checkFileProtocol();
});

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return token && currentUser.userId;
}

// Función para verificar si el usuario es admin
function isAdmin() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  return currentUser.role === 'admin';
}

// Función para obtener el token de autenticación
function getAuthToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  return token;
}