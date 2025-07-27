// main.js

// Configuración de la API - detecta automáticamente si está en servidor o archivo local
const isLocalFile = window.location.protocol === 'file:';
const API_BASE_URL = isLocalFile ? 'http://localhost:3001/api' : '/api';

console.log('🌐 Protocolo detectado:', window.location.protocol);
console.log('🔗 API Base URL:', API_BASE_URL);

// Cambia esta URL por la imagen de fondo que te proporcionará el usuario
const BACKGROUND_IMAGE_URL = 'background.jpg'; // Cambia por la ruta real

// Limpiar localStorage completamente al cargar la página
localStorage.clear();
console.log('🧹 localStorage limpiado completamente');

// Función para verificar conexión al servidor
async function checkServerConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    if (response.ok) {
      console.log('✅ Conexión al servidor exitosa');
      return true;
    } else {
      console.log('❌ Servidor respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ No se puede conectar al servidor:', error.message);
    return false;
  }
}

// Función para mostrar advertencia si no hay conexión
async function showConnectionWarning() {
  const isConnected = await checkServerConnection();
  
  if (!isConnected) {
    showMessage('⚠️ No se puede conectar al servidor. Asegúrate de que el servidor esté corriendo en http://localhost:3001', 'error');
    
    // Si está en archivo local, mostrar instrucciones específicas
    if (isLocalFile) {
      showMessage('💡 Para usar el juego, accede desde: http://localhost:3001', 'info');
    }
  }
}

// Verificar conexión al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  showConnectionWarning();
});

// Función para limpiar sesión
function clearSession() {
  localStorage.clear();
  console.log('🚪 Sesión limpiada completamente');
  showScreen(landing);
}

// Función para forzar logout y limpiar todo
function forceLogout() {
  localStorage.clear();
  console.log('🔄 Forzando logout y limpieza completa');
  showScreen(landing);
  // Recargar la página para asegurar limpieza completa
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Pantallas
const landing = document.getElementById('landing');
const auth = document.getElementById('auth');
const adminPanel = document.getElementById('admin-panel');
const characterSelection = document.getElementById('character-selection');
const teamsConfirmed = document.getElementById('teams-confirmed');
const battleScreen = document.getElementById('battle-screen');

// Imagen de fondo
const background = document.getElementById('background');
background.style.backgroundImage = `url('${BACKGROUND_IMAGE_URL}')`;

// Navegación básica
function showScreen(screen) {
  console.log('showScreen llamado con:', screen);
  console.log('Elementos disponibles:', { landing, auth, adminPanel, characterSelection, teamsConfirmed, battleScreen });
  [landing, auth, adminPanel, characterSelection, teamsConfirmed, battleScreen].forEach(div => {
    if (div) {
      div.classList.add('hidden');
      console.log('Ocultando:', div.id);
    }
  });
  if (screen) {
    screen.classList.remove('hidden');
    console.log('Mostrando:', screen.id);
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

// Mostrar panel admin si el usuario es admin
function showAdminPanel() {
  showScreen(adminPanel);
  renderAdminPanel();
}

function renderAdminPanel() {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  adminPanel.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 w-full max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">Panel de Administración</h2>
      <div class="bg-white bg-opacity-90 p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600">Admin: <span class="font-bold">${username}</span></p>
        <p class="text-sm text-gray-600">ID: <span class="font-bold">${userId}</span></p>
        <p class="text-sm text-gray-600">Role: <span class="font-bold">${localStorage.getItem('role') || 'No definido'}</span></p>
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
        <button onclick="forceLogout()" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition">
          🔄 Forzar Logout
        </button>
        <button onclick="logout()" class="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition">
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

async function handleAddHero(e) {
  e.preventDefault();
  console.log('📋 Agregando héroe...');
  
  const formData = new FormData(e.target);
  const heroData = {
    name: formData.get('name'),
    alias: formData.get('alias'),
    city: formData.get('city'),
    team: formData.get('team'),
    image: formData.get('image')
  };
  
  console.log('📋 Datos del héroe:', heroData);
  
  if (!heroData.name || !heroData.alias) {
    showMessage('Nombre y alias son requeridos', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/heroes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(heroData)
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Héroe agregado exitosamente', 'success');
      e.target.reset();
      loadHeroes();
    } else {
      if (response.status === 409) {
        // Error de duplicado
        if (data.existingHero) {
          showMessage(`Ya existe un héroe con este nombre: ${data.existingHero.name} (${data.existingHero.alias})`, 'error');
        } else {
          showMessage(data.error || 'Ya existe un héroe con estas características', 'error');
        }
      } else {
        showMessage(data.error || 'Error al agregar héroe', 'error');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error de conexión', 'error');
  }
}

async function handleAddVillain(e) {
  e.preventDefault();
  console.log('📋 Agregando villano...');
  
  const formData = new FormData(e.target);
  const villainData = {
    name: formData.get('name'),
    alias: formData.get('alias'),
    city: formData.get('city'),
    team: formData.get('team'),
    image: formData.get('image')
  };
  
  console.log('📋 Datos del villano:', villainData);
  
  if (!villainData.name || !villainData.alias) {
    showMessage('Nombre y alias son requeridos', 'error');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/villains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(villainData)
    });

    const data = await response.json();

    if (response.ok) {
      showMessage('Villano agregado exitosamente', 'success');
      e.target.reset();
      loadVillains();
    } else {
      if (response.status === 409) {
        // Error de duplicado
        if (data.existingVillain) {
          showMessage(`Ya existe un villano con este nombre: ${data.existingVillain.name} (${data.existingVillain.alias})`, 'error');
        } else {
          showMessage(data.error || 'Ya existe un villano con estas características', 'error');
        }
      } else {
        showMessage(data.error || 'Error al agregar villano', 'error');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    showMessage('Error de conexión', 'error');
  }
}

async function loadHeroes() {
  const list = document.getElementById('heroes-list');
  list.innerHTML = '<div class="text-white">Cargando...</div>';
  try {
    const res = await fetch(`${API_BASE_URL}/heroes`, {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    const heroes = await res.json();
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

async function loadVillains() {
  const list = document.getElementById('villains-list');
  list.innerHTML = '<div class="text-white">Cargando...</div>';
  try {
    const res = await fetch(`${API_BASE_URL}/villains`, {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    const villains = await res.json();
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

// Funciones para editar y eliminar
async function editHero(heroId) {
  console.log('📝 Editando héroe:', heroId);
  
  try {
    const res = await fetch(`${API_BASE_URL}/heroes`, {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    const heroes = await res.json();
    const hero = heroes.find(h => h.heroId === heroId);
    
    if (!hero) {
      alert('Héroe no encontrado');
      return;
    }
    
    // Crear modal de edición
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-96 max-w-md">
        <h3 class="text-xl font-bold mb-4">Editar Héroe</h3>
        <form id="editHeroForm">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Nombre:</label>
            <input type="text" id="editHeroName" value="${hero.name}" class="w-full p-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Alias:</label>
            <input type="text" id="editHeroAlias" value="${hero.alias}" class="w-full p-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Ciudad:</label>
            <input type="text" id="editHeroCity" value="${hero.city || ''}" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Equipo:</label>
            <input type="text" id="editHeroTeam" value="${hero.team || ''}" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">URL de imagen:</label>
            <input type="text" id="editHeroImage" value="${hero.image || ''}" class="w-full p-2 border rounded">
          </div>
          <div class="flex gap-2">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Guardar
            </button>
            <button type="button" onclick="closeModal()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar envío del formulario
    document.getElementById('editHeroForm').onsubmit = async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('editHeroName').value,
        alias: document.getElementById('editHeroAlias').value,
        city: document.getElementById('editHeroCity').value,
        team: document.getElementById('editHeroTeam').value,
        image: document.getElementById('editHeroImage').value
      };
      
      try {
        const res = await fetch(`${API_BASE_URL}/heroes/${heroId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
          },
          body: JSON.stringify(formData)
        });
        
        if (res.ok) {
          console.log('✅ Héroe actualizado');
          closeModal();
          loadHeroes();
        } else {
          const error = await res.json();
          alert('Error: ' + error.error);
        }
      } catch (err) {
        console.error('❌ Error actualizando héroe:', err);
        alert('Error al actualizar héroe');
      }
    };
    
  } catch (err) {
    console.error('❌ Error cargando héroe:', err);
    alert('Error al cargar datos del héroe');
  }
}

async function deleteHero(heroId) {
  if (confirm('¿Estás seguro de que quieres eliminar este héroe?')) {
    try {
      const res = await fetch(`${API_BASE_URL}/heroes/${heroId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
      });
      if (res.ok) {
        console.log('✅ Héroe eliminado');
        loadHeroes();
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      console.error('❌ Error eliminando héroe:', err);
      alert('Error al eliminar héroe');
    }
  }
}

async function editVillain(villainId) {
  console.log('📝 Editando villano:', villainId);
  
  try {
    const res = await fetch(`${API_BASE_URL}/villains`, {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    const villains = await res.json();
    const villain = villains.find(v => v.villainId === villainId);
    
    if (!villain) {
      alert('Villano no encontrado');
      return;
    }
    
    // Crear modal de edición
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 w-96 max-w-md">
        <h3 class="text-xl font-bold mb-4">Editar Villano</h3>
        <form id="editVillainForm">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Nombre:</label>
            <input type="text" id="editVillainName" value="${villain.name}" class="w-full p-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Alias:</label>
            <input type="text" id="editVillainAlias" value="${villain.alias}" class="w-full p-2 border rounded" required>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Ciudad:</label>
            <input type="text" id="editVillainCity" value="${villain.city || ''}" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">Equipo:</label>
            <input type="text" id="editVillainTeam" value="${villain.team || ''}" class="w-full p-2 border rounded">
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">URL de imagen:</label>
            <input type="text" id="editVillainImage" value="${villain.image || ''}" class="w-full p-2 border rounded">
          </div>
          <div class="flex gap-2">
            <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Guardar
            </button>
            <button type="button" onclick="closeModal()" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Manejar envío del formulario
    document.getElementById('editVillainForm').onsubmit = async (e) => {
      e.preventDefault();
      
      const formData = {
        name: document.getElementById('editVillainName').value,
        alias: document.getElementById('editVillainAlias').value,
        city: document.getElementById('editVillainCity').value,
        team: document.getElementById('editVillainTeam').value,
        image: document.getElementById('editVillainImage').value
      };
      
      try {
        const res = await fetch(`${API_BASE_URL}/villains/${villainId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
          },
          body: JSON.stringify(formData)
        });
        
        if (res.ok) {
          console.log('✅ Villano actualizado');
          closeModal();
          loadVillains();
        } else {
          const error = await res.json();
          alert('Error: ' + error.error);
        }
      } catch (err) {
        console.error('❌ Error actualizando villano:', err);
        alert('Error al actualizar villano');
      }
    };
    
  } catch (err) {
    console.error('❌ Error cargando villano:', err);
    alert('Error al cargar datos del villano');
  }
}

async function deleteVillain(villainId) {
  if (confirm('¿Estás seguro de que quieres eliminar este villano?')) {
    try {
      const res = await fetch(`${API_BASE_URL}/villains/${villainId}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
      });
      if (res.ok) {
        console.log('✅ Villano eliminado');
        loadVillains();
      } else {
        const error = await res.json();
        alert('Error: ' + error.error);
      }
    } catch (err) {
      console.error('❌ Error eliminando villano:', err);
      alert('Error al eliminar villano');
    }
  }
}

function closeModal() {
  const modal = document.querySelector('.fixed.inset-0');
  if (modal) {
    modal.remove();
  }
}

// Mostrar panel admin si el usuario es admin al iniciar sesión
function checkAdminAfterLogin(role) {
  console.log('checkAdminAfterLogin llamado con role:', role);
  if (role === 'admin') {
    console.log('Mostrando panel de admin');
    showAdminPanel();
  } else {
    console.log('Mostrando selección de personajes');
    showScreen(characterSelection);
    renderCharacterSelection();
  }
}

// Renderizar pantalla de selección de personajes
function renderCharacterSelection() {
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  characterSelection.innerHTML = `
    <div class="flex flex-col items-center justify-center space-y-6 bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-4xl">
      <h2 class="text-3xl font-bold text-gray-800 mb-4">Selección de Personajes</h2>
      <div class="bg-blue-50 p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600">Usuario: <span class="font-bold">${username}</span></p>
        <p class="text-sm text-gray-600">ID: <span class="font-bold">${userId}</span></p>
      </div>
      
      <div class="w-full">
        <h3 class="text-xl font-bold text-gray-800 mb-4">Héroes Disponibles</h3>
        <div id="user-heroes-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div class="text-center">Cargando héroes...</div>
        </div>
        
        <h3 class="text-xl font-bold text-gray-800 mb-4">Villanos Disponibles</h3>
        <div id="user-villains-list" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <div class="text-center">Cargando villanos...</div>
        </div>
      </div>
      
      <div class="flex gap-4">
        <button onclick="showScreen(landing)" class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Volver al Inicio
        </button>
        <button onclick="logout()" class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition">
          Cerrar Sesión
        </button>
      </div>
    </div>
  `;
  
  // Cargar personajes para usuarios
  loadUserHeroes();
  loadUserVillains();
  
  // Inicializar panel de selección
  updateSelectionDisplay();
}

async function loadUserHeroes() {
  const list = document.getElementById('user-heroes-list');
  if (!list) return;
  
  try {
    const res = await fetch(`${API_BASE_URL}/heroes`, {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    const heroes = await res.json();
    list.innerHTML = heroes.map(h => `
      <div class="bg-white rounded-lg p-4 flex flex-col items-center border hover:shadow-lg transition cursor-pointer" onclick="selectHero('${h.heroId}')">
        <img src="${h.image || 'https://via.placeholder.com/100x100?text=Hero'}" alt="${h.name}" class="w-20 h-20 object-cover rounded-full mb-2">
        <div class="font-bold text-sm">${h.name}</div>
        <div class="text-xs text-gray-600">${h.alias}</div>
        <div class="text-xs text-gray-500">${h.city} - ${h.team}</div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<div class="text-red-600">Error al cargar héroes</div>';
  }
}

async function loadUserVillains() {
  const list = document.getElementById('user-villains-list');
  if (!list) return;
  
  try {
    const res = await fetch(`${API_BASE_URL}/villains`, {
      headers: { 'Authorization': 'Bearer ' + (localStorage.getItem('token') || '') }
    });
    const villains = await res.json();
    list.innerHTML = villains.map(v => `
      <div class="bg-white rounded-lg p-4 flex flex-col items-center border hover:shadow-lg transition cursor-pointer" onclick="selectVillain('${v.villainId}')">
        <img src="${v.image || 'https://via.placeholder.com/100x100?text=Villain'}" alt="${v.name}" class="w-20 h-20 object-cover rounded-full mb-2">
        <div class="font-bold text-sm">${v.name}</div>
        <div class="text-xs text-gray-600">${v.alias}</div>
        <div class="text-xs text-gray-500">${v.city} - ${v.team}</div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = '<div class="text-red-600">Error al cargar villanos</div>';
  }
}

function selectHero(heroId) {
  console.log('🎯 Héroe seleccionado:', heroId);
  
  // Guardar selección en localStorage
  const selectedHeroes = JSON.parse(localStorage.getItem('selectedHeroes') || '[]');
  
  if (selectedHeroes.length >= 3) {
    alert('Ya tienes 3 héroes seleccionados. Elimina uno antes de agregar otro.');
    return;
  }
  
  if (selectedHeroes.includes(heroId)) {
    alert('Este héroe ya está seleccionado.');
    return;
  }
  
  selectedHeroes.push(heroId);
  localStorage.setItem('selectedHeroes', JSON.stringify(selectedHeroes));
  
  console.log('✅ Héroe agregado a selección:', selectedHeroes);
  updateSelectionDisplay();
}

function selectVillain(villainId) {
  console.log('🎯 Villano seleccionado:', villainId);
  
  // Guardar selección en localStorage
  const selectedVillains = JSON.parse(localStorage.getItem('selectedVillains') || '[]');
  
  if (selectedVillains.length >= 3) {
    alert('Ya tienes 3 villanos seleccionados. Elimina uno antes de agregar otro.');
    return;
  }
  
  if (selectedVillains.includes(villainId)) {
    alert('Este villano ya está seleccionado.');
    return;
  }
  
  selectedVillains.push(villainId);
  localStorage.setItem('selectedVillains', JSON.stringify(selectedVillains));
  
  console.log('✅ Villano agregado a selección:', selectedVillains);
  updateSelectionDisplay();
}

function updateSelectionDisplay() {
  const selectedHeroes = JSON.parse(localStorage.getItem('selectedHeroes') || '[]');
  const selectedVillains = JSON.parse(localStorage.getItem('selectedVillains') || '[]');
  
  // Crear o actualizar el panel de selección
  let selectionPanel = document.getElementById('selection-panel');
  if (!selectionPanel) {
    selectionPanel = document.createElement('div');
    selectionPanel.id = 'selection-panel';
    selectionPanel.className = 'fixed bottom-4 left-4 right-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg border';
    document.body.appendChild(selectionPanel);
  }
  
  selectionPanel.innerHTML = `
    <div class="flex justify-between items-center">
      <div class="flex gap-4">
        <div>
          <span class="font-bold text-blue-600">Héroes (${selectedHeroes.length}/3):</span>
          <span class="text-sm text-gray-600">${selectedHeroes.join(', ') || 'Ninguno'}</span>
        </div>
        <div>
          <span class="font-bold text-red-600">Villanos (${selectedVillains.length}/3):</span>
          <span class="text-sm text-gray-600">${selectedVillains.join(', ') || 'Ninguno'}</span>
        </div>
      </div>
      <div class="flex gap-2">
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

function clearSelection() {
  localStorage.removeItem('selectedHeroes');
  localStorage.removeItem('selectedVillains');
  updateSelectionDisplay();
  console.log('🗑️ Selección limpiada');
}

function startBattle() {
  const selectedHeroes = JSON.parse(localStorage.getItem('selectedHeroes') || '[]');
  const selectedVillains = JSON.parse(localStorage.getItem('selectedVillains') || '[]');
  
  if (selectedHeroes.length !== 3 || selectedVillains.length !== 3) {
    alert('Necesitas seleccionar exactamente 3 héroes y 3 villanos para iniciar la batalla.');
    return;
  }
  
  console.log('⚔️ Iniciando batalla con:');
  console.log('Héroes:', selectedHeroes);
  console.log('Villanos:', selectedVillains);
  
  // TODO: Implementar pantalla de batalla
  alert('¡Batalla iniciada! Esta funcionalidad estará disponible próximamente.');
}

// Modificar handleAuth para usar API_BASE_URL
async function handleAuth(mode) {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('auth-error');
  errorDiv.textContent = '';
  
  try {
    console.log('Intentando', mode, 'con username:', username);
    
    // Verificar conexión primero
    const isConnected = await checkServerConnection();
    if (!isConnected) {
      errorDiv.textContent = 'No se puede conectar al servidor. Verifica que esté corriendo en http://localhost:3001';
      return;
    }
    
    const endpoint = mode === 'register' ? `${API_BASE_URL}/register` : `${API_BASE_URL}/login`;
    console.log('🌐 Llamando a:', endpoint);
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await res.json();
    console.log('Respuesta del servidor:', data);
    
    if (!res.ok) {
      throw new Error(data.error || `Error de ${mode === 'register' ? 'registro' : 'autenticación'}`);
    }
    
    // Guardar token y usuario
    localStorage.setItem('token', data.token || '');
    localStorage.setItem('username', username);
    localStorage.setItem('userId', data.userId || '');
    localStorage.setItem('role', data.role || 'user');
    
    console.log('✅ Autenticación exitosa:');
    console.log('Token guardado:', data.token ? 'Sí' : 'No');
    console.log('UserID guardado:', data.userId || 'No');
    console.log('Role guardado:', data.role || 'user');
    
    checkAdminAfterLogin(data.role);
    
  } catch (err) {
    console.error('❌ Error en handleAuth:', err);
    
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      errorDiv.textContent = 'Error de conexión. Verifica que el servidor esté corriendo en http://localhost:3001';
    } else {
      errorDiv.textContent = err.message;
    }
  }
}

// TODO: Implementar las siguientes funciones y pantallas:
// - loadCharacters()
// - renderCharacterSelection()
// - renderAdminPanel()
// - matchmaking y lógica de batalla
// - renderTeamsConfirmed()
// - renderBattleScreen() 

// Función global para cerrar sesión
function logout() {
  localStorage.clear();
  console.log('🚪 Sesión cerrada, localStorage limpiado');
  showScreen(landing);
} 

function showMessage(message, type = 'info') {
  // Remover mensajes anteriores
  const existingMessage = document.querySelector('.message-toast');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Crear nuevo mensaje
  const messageDiv = document.createElement('div');
  messageDiv.className = `message-toast fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-md ${
    type === 'success' ? 'bg-green-500 text-white' :
    type === 'error' ? 'bg-red-500 text-white' :
    'bg-blue-500 text-white'
  }`;
  messageDiv.innerHTML = `
    <div class="flex items-center justify-between">
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  `;
  
  document.body.appendChild(messageDiv);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (messageDiv.parentElement) {
      messageDiv.remove();
    }
  }, 5000);
} 