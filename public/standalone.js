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
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      },
      {
        heroId: 'HERO_003',
        name: 'Steve Rogers',
        alias: 'Captain America',
        city: 'Brooklyn',
        team: 'Los Vengadores',
        image: 'https://via.placeholder.com/100x100?text=CA',
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
        image: 'https://via.placeholder.com/100x100?text=Thanos',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      },
      {
        villainId: 'VILLAIN_002',
        name: 'Loki',
        alias: 'Loki Laufeyson',
        city: 'Asgard',
        team: 'Independiente',
        image: 'https://via.placeholder.com/100x100?text=Loki',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      },
      {
        villainId: 'VILLAIN_003',
        name: 'Eddie Brock',
        alias: 'Venom',
        city: 'San Francisco',
        team: 'Independiente',
        image: 'https://via.placeholder.com/100x100?text=Venom',
        createdBy: 'ADMIN_001',
        createdAt: new Date().toISOString()
      }
    ]));
  }
};

// Inicializar datos al cargar
initializeData();

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

// Navegación básica
function showScreen(screen) {
  [landing, auth, adminPanel, characterSelection, teamsConfirmed, battleScreen].forEach(div => {
    if (div) div.classList.add('hidden');
  });
  if (screen) screen.classList.remove('hidden');
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
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (mode === 'register') {
      // Verificar si el usuario ya existe
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        errorDiv.textContent = 'El usuario ya existe';
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
      
      showMessage('Usuario registrado exitosamente', 'success');
      setTimeout(() => {
        showScreen(landing);
      }, 1000);
      
    } else {
      // Login
      const user = users.find(u => u.username === username && u.password === password);
      if (!user) {
        errorDiv.textContent = 'Credenciales inválidas';
        return;
      }
      
      // Guardar sesión
      localStorage.setItem('currentUser', JSON.stringify(user));
      showMessage('Login exitoso', 'success');
      
      // Redirigir según el rol
      if (user.role === 'admin') {
        setTimeout(() => {
          showAdminPanel();
        }, 1000);
      } else {
        setTimeout(() => {
          showCharacterSelection();
        }, 1000);
      }
    }
  } catch (err) {
    console.error('Error en handleAuth:', err);
    errorDiv.textContent = 'Error interno';
  }
}

// Mostrar panel admin
function showAdminPanel() {
  showScreen(adminPanel);
  renderAdminPanel();
}

function renderAdminPanel() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  adminPanel.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 w-full max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">Panel de Administración</h2>
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
            <button type="submit" class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">Agregar Villano</button>
          </form>
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
  
  // Cargar listas
  loadHeroes();
  loadVillains();
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
    image: formData.get('image')
  };
  
  if (!heroData.name || !heroData.alias) {
    showMessage('Nombre y alias son requeridos', 'error');
    return;
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
    image: formData.get('image')
  };
  
  if (!villainData.name || !villainData.alias) {
    showMessage('Nombre y alias son requeridos', 'error');
    return;
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

// Cargar héroes
async function loadHeroes() {
  const list = document.getElementById('heroes-list');
  if (!list) return;
  
  list.innerHTML = '<div class="text-white">Cargando...</div>';
  try {
    const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
    list.innerHTML = heroes.map(h => `
      <div class="bg-white bg-opacity-80 rounded-lg p-4 flex flex-col items-center">
        <img src="${h.image || 'https://via.placeholder.com/100x100?text=Hero'}" alt="${h.name}" class="w-24 h-24 object-cover rounded-full mb-2">
        <div class="font-bold">${h.name}</div>
        <div class="text-sm text-gray-600">${h.alias}</div>
        <div class="text-xs text-gray-500">${h.city} - ${h.team}</div>
        <div class="text-xs text-blue-600 font-mono">${h.heroId}</div>
        <div class="flex gap-2 mt-2">
          <button onclick="editHero('${h.heroId}')" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
            Editar
          </button>
          <button onclick="deleteHero('${h.heroId}')" class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
            Eliminar
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<div class="text-red-600">Error al cargar héroes</div>';
  }
}

// Cargar villanos
async function loadVillains() {
  const list = document.getElementById('villains-list');
  if (!list) return;
  
  list.innerHTML = '<div class="text-white">Cargando...</div>';
  try {
    const villains = JSON.parse(localStorage.getItem('villains') || '[]');
    list.innerHTML = villains.map(v => `
      <div class="bg-white bg-opacity-80 rounded-lg p-4 flex flex-col items-center">
        <img src="${v.image || 'https://via.placeholder.com/100x100?text=Villain'}" alt="${v.name}" class="w-24 h-24 object-cover rounded-full mb-2">
        <div class="font-bold">${v.name}</div>
        <div class="text-sm text-gray-600">${v.alias}</div>
        <div class="text-xs text-gray-500">${v.city} - ${v.team}</div>
        <div class="text-xs text-red-600 font-mono">${v.villainId}</div>
        <div class="flex gap-2 mt-2">
          <button onclick="editVillain('${v.villainId}')" class="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
            Editar
          </button>
          <button onclick="deleteVillain('${v.villainId}')" class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
            Eliminar
          </button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<div class="text-red-600">Error al cargar villanos</div>';
  }
}

// Editar héroe
async function editHero(heroId) {
  const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
  const hero = heroes.find(h => h.heroId === heroId);
  
  if (!hero) {
    showMessage('Héroe no encontrado', 'error');
    return;
  }
  
  const newName = prompt('Nuevo nombre:', hero.name);
  if (!newName) return;
  
  const newAlias = prompt('Nuevo alias:', hero.alias);
  if (!newAlias) return;
  
  const newCity = prompt('Nueva ciudad:', hero.city);
  const newTeam = prompt('Nuevo equipo:', hero.team);
  const newImage = prompt('Nueva URL de imagen:', hero.image);
  
  hero.name = newName;
  hero.alias = newAlias;
  hero.city = newCity || '';
  hero.team = newTeam || '';
  hero.image = newImage || '';
  
  localStorage.setItem('heroes', JSON.stringify(heroes));
  showMessage('Héroe actualizado exitosamente', 'success');
  loadHeroes();
}

// Eliminar héroe
async function deleteHero(heroId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este héroe?')) return;
  
  const heroes = JSON.parse(localStorage.getItem('heroes') || '[]');
  const filteredHeroes = heroes.filter(h => h.heroId !== heroId);
  
  localStorage.setItem('heroes', JSON.stringify(filteredHeroes));
  showMessage('Héroe eliminado exitosamente', 'success');
  loadHeroes();
}

// Editar villano
async function editVillain(villainId) {
  const villains = JSON.parse(localStorage.getItem('villains') || '[]');
  const villain = villains.find(v => v.villainId === villainId);
  
  if (!villain) {
    showMessage('Villano no encontrado', 'error');
    return;
  }
  
  const newName = prompt('Nuevo nombre:', villain.name);
  if (!newName) return;
  
  const newAlias = prompt('Nuevo alias:', villain.alias);
  if (!newAlias) return;
  
  const newCity = prompt('Nueva ciudad:', villain.city);
  const newTeam = prompt('Nuevo equipo:', villain.team);
  const newImage = prompt('Nueva URL de imagen:', villain.image);
  
  villain.name = newName;
  villain.alias = newAlias;
  villain.city = newCity || '';
  villain.team = newTeam || '';
  villain.image = newImage || '';
  
  localStorage.setItem('villains', JSON.stringify(villains));
  showMessage('Villano actualizado exitosamente', 'success');
  loadVillains();
}

// Eliminar villano
async function deleteVillain(villainId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este villano?')) return;
  
  const villains = JSON.parse(localStorage.getItem('villains') || '[]');
  const filteredVillains = villains.filter(v => v.villainId !== villainId);
  
  localStorage.setItem('villains', JSON.stringify(filteredVillains));
  showMessage('Villano eliminado exitosamente', 'success');
  loadVillains();
}

// Mostrar selección de personajes para usuarios normales
function showCharacterSelection() {
  showScreen(characterSelection);
  renderCharacterSelection();
}

function renderCharacterSelection() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  characterSelection.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 w-full max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">Selección de Personajes</h2>
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
        <img src="${h.image || 'https://via.placeholder.com/100x100?text=Hero'}" alt="${h.name}" class="w-24 h-24 object-cover rounded-full mb-2">
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
        <img src="${v.image || 'https://via.placeholder.com/100x100?text=Villain'}" alt="${v.name}" class="w-24 h-24 object-cover rounded-full mb-2">
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
                  <img src="${hero.image || 'https://via.placeholder.com/60x60?text=Hero'}" alt="${hero.name}" class="w-16 h-16 object-cover rounded-full">
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
                  <img src="${villain.image || 'https://via.placeholder.com/60x60?text=Villain'}" alt="${villain.name}" class="w-16 h-16 object-cover rounded-full">
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
  
  // Mostrar animación especial para héroes específicos
  if (attackType === 'special') {
    const heroName = hero.name.toLowerCase();
    if (heroName.includes('iron man')) {
      showIronManSpecialAnimation(heroIndex);
    } else if (heroName.includes('spider') || heroName.includes('peter')) {
      showSpiderManSpecialAnimation(heroIndex);
    } else if (heroName.includes('captain') || heroName.includes('steve')) {
      showCaptainAmericaSpecialAnimation(heroIndex);
    }
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

// Función para mostrar animación especial de Iron Man
function showIronManSpecialAnimation(heroIndex) {
  // Crear el overlay de animación
  const animationOverlay = document.createElement('div');
  animationOverlay.className = 'iron-man-special';
  
  // Crear el contenido de la animación
  animationOverlay.innerHTML = `
    <div class="iron-man-animation">
      <div class="iron-man-character">🦸‍♂️</div>
      <div class="energy-beam"></div>
      <div class="energy-ring"></div>
      <div class="energy-streaks">
        ${Array.from({length: 8}, (_, i) => `
          <div class="energy-streak" style="
            left: ${20 + i * 45}px;
            animation-delay: ${i * 0.1}s;
          "></div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Agregar al DOM
  document.body.appendChild(animationOverlay);
  
  // Reproducir sonido de ataque especial (opcional)
  // const audio = new Audio('path/to/special-attack-sound.mp3');
  // audio.play();
  
  // Remover la animación después de 3 segundos
  setTimeout(() => {
    if (animationOverlay.parentNode) {
      animationOverlay.parentNode.removeChild(animationOverlay);
    }
  }, 3000);
  
  // Agregar mensaje especial al log
  addBattleLog(`⚡ ¡IRON MAN ejecuta su ATAQUE ESPECIAL! ¡Rayo Repulsor activado!`);
}

// Función para mostrar animación especial de Spider-Man
function showSpiderManSpecialAnimation(heroIndex) {
  const animationOverlay = document.createElement('div');
  animationOverlay.className = 'iron-man-special'; // Reutilizamos la clase
  
  animationOverlay.innerHTML = `
    <div class="iron-man-animation" style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #fca5a5 100%);">
      <div class="iron-man-character" style="background: linear-gradient(45deg, #dc2626 0%, #ef4444 50%, #fca5a5 100%);">🕷️</div>
      <div class="energy-beam" style="background: linear-gradient(90deg, #dc2626 0%, #ef4444 50%, #fca5a5 100%);"></div>
      <div class="energy-ring" style="border-color: #dc2626;"></div>
      <div class="energy-streaks">
        ${Array.from({length: 6}, (_, i) => `
          <div class="energy-streak" style="
            left: ${30 + i * 60}px;
            animation-delay: ${i * 0.15}s;
            background: linear-gradient(180deg, #dc2626 0%, transparent 100%);
          "></div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(animationOverlay);
  
  setTimeout(() => {
    if (animationOverlay.parentNode) {
      animationOverlay.parentNode.removeChild(animationOverlay);
    }
  }, 3000);
  
  addBattleLog(`🕷️ ¡SPIDER-MAN ejecuta su ATAQUE ESPECIAL! ¡Telaraña de Energía!`);
}

// Función para mostrar animación especial de Captain America
function showCaptainAmericaSpecialAnimation(heroIndex) {
  const animationOverlay = document.createElement('div');
  animationOverlay.className = 'iron-man-special';
  
  animationOverlay.innerHTML = `
    <div class="iron-man-animation" style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);">
      <div class="iron-man-character" style="background: linear-gradient(45deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);">🛡️</div>
      <div class="energy-beam" style="background: linear-gradient(90deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);"></div>
      <div class="energy-ring" style="border-color: #1e40af;"></div>
      <div class="energy-streaks">
        ${Array.from({length: 4}, (_, i) => `
          <div class="energy-streak" style="
            left: ${50 + i * 80}px;
            animation-delay: ${i * 0.2}s;
            background: linear-gradient(180deg, #1e40af 0%, transparent 100%);
          "></div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(animationOverlay);
  
  setTimeout(() => {
    if (animationOverlay.parentNode) {
      animationOverlay.parentNode.removeChild(animationOverlay);
    }
  }, 3000);
  
  addBattleLog(`🛡️ ¡CAPTAIN AMERICA ejecuta su ATAQUE ESPECIAL! ¡Escudo de Energía!`);
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
  
  // Mostrar animación especial para villanos específicos
  if (attackType === 'special') {
    const villainName = villain.name.toLowerCase();
    if (villainName.includes('thanos')) {
      showThanosSpecialAnimation(villainIndex);
    } else if (villainName.includes('loki')) {
      showLokiSpecialAnimation(villainIndex);
    } else if (villainName.includes('venom') || villainName.includes('eddie')) {
      showVenomSpecialAnimation(villainIndex);
    }
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

// Función para mostrar animación especial de Thanos
function showThanosSpecialAnimation(villainIndex) {
  const animationOverlay = document.createElement('div');
  animationOverlay.className = 'iron-man-special';
  
  animationOverlay.innerHTML = `
    <div class="iron-man-animation" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);">
      <div class="iron-man-character" style="background: linear-gradient(45deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);">💎</div>
      <div class="energy-beam" style="background: linear-gradient(90deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%);"></div>
      <div class="energy-ring" style="border-color: #7c3aed;"></div>
      <div class="energy-streaks">
        ${Array.from({length: 5}, (_, i) => `
          <div class="energy-streak" style="
            left: ${40 + i * 70}px;
            animation-delay: ${i * 0.12}s;
            background: linear-gradient(180deg, #7c3aed 0%, transparent 100%);
          "></div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(animationOverlay);
  
  setTimeout(() => {
    if (animationOverlay.parentNode) {
      animationOverlay.parentNode.removeChild(animationOverlay);
    }
  }, 3000);
  
  addBattleLog(`💎 ¡THANOS ejecuta su ATAQUE ESPECIAL! ¡Poder de las Gemas del Infinito!`);
}

// Función para mostrar animación especial de Loki
function showLokiSpecialAnimation(villainIndex) {
  const animationOverlay = document.createElement('div');
  animationOverlay.className = 'iron-man-special';
  
  animationOverlay.innerHTML = `
    <div class="iron-man-animation" style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%);">
      <div class="iron-man-character" style="background: linear-gradient(45deg, #059669 0%, #10b981 50%, #34d399 100%);">🪄</div>
      <div class="energy-beam" style="background: linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%);"></div>
      <div class="energy-ring" style="border-color: #059669;"></div>
      <div class="energy-streaks">
        ${Array.from({length: 7}, (_, i) => `
          <div class="energy-streak" style="
            left: ${25 + i * 55}px;
            animation-delay: ${i * 0.1}s;
            background: linear-gradient(180deg, #059669 0%, transparent 100%);
          "></div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(animationOverlay);
  
  setTimeout(() => {
    if (animationOverlay.parentNode) {
      animationOverlay.parentNode.removeChild(animationOverlay);
    }
  }, 3000);
  
  addBattleLog(`🪄 ¡LOKI ejecuta su ATAQUE ESPECIAL! ¡Ilusiones Mágicas!`);
}

// Función para mostrar animación especial de Venom
function showVenomSpecialAnimation(villainIndex) {
  const animationOverlay = document.createElement('div');
  animationOverlay.className = 'iron-man-special';
  
  animationOverlay.innerHTML = `
    <div class="iron-man-animation" style="background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%);">
      <div class="iron-man-character" style="background: linear-gradient(45deg, #1f2937 0%, #374151 50%, #4b5563 100%);">🕷️</div>
      <div class="energy-beam" style="background: linear-gradient(90deg, #1f2937 0%, #374151 50%, #4b5563 100%);"></div>
      <div class="energy-ring" style="border-color: #1f2937;"></div>
      <div class="energy-streaks">
        ${Array.from({length: 6}, (_, i) => `
          <div class="energy-streak" style="
            left: ${30 + i * 60}px;
            animation-delay: ${i * 0.13}s;
            background: linear-gradient(180deg, #1f2937 0%, transparent 100%);
          "></div>
        `).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(animationOverlay);
  
  setTimeout(() => {
    if (animationOverlay.parentNode) {
      animationOverlay.parentNode.removeChild(animationOverlay);
    }
  }, 3000);
  
  addBattleLog(`🕷️ ¡VENOM ejecuta su ATAQUE ESPECIAL! ¡Simbionte Devastador!`);
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
  localStorage.removeItem('selectedHeroes');
  localStorage.removeItem('selectedVillains');
  showMessage('Sesión cerrada', 'info');
  showScreen(landing);
}

// Inicializar la aplicación
console.log('🎮 Aplicación standalone iniciada');
showMessage('¡Bienvenido a DataFight!', 'info'); 