
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const SECRET_KEY = 'tu_clave_secreta';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio para almacenar los archivos JSON de usuarios
const USERS_DIR = path.join(__dirname, '..', 'data', 'users');

// Crear el directorio si no existe
if (!fs.existsSync(USERS_DIR)) {
  fs.mkdirSync(USERS_DIR, { recursive: true });
}

// Ruta del archivo global de usuarios
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

// Leer todos los usuarios del archivo
function readAllUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Guardar todos los usuarios en el archivo
function saveAllUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Buscar usuario por username
function findUserByUsername(username) {
  const users = readAllUsers();
  return users.find(u => u.username === username);
}

// Buscar usuario por rol
function findAdminUser() {
  const users = readAllUsers();
  return users.find(u => u.rol === 'admin');
}

// Función para obtener la ruta del archivo JSON de un usuario
function getUserFilePath(userId) {
  return path.join(USERS_DIR, `${userId}.json`);
}

// Función para inicializar el archivo JSON de un usuario
function initializeUserData(userId) {
  const userData = {
    userId: userId,
    heroes: [],
    villains: [],
    battles: [],
    createdAt: new Date().toISOString()
  };
  
  const filePath = getUserFilePath(userId);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  return userData;
}

// Función para obtener los datos de un usuario
function getUserData(userId) {
  const filePath = getUserFilePath(userId);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }
  return null;
}

// Función para guardar los datos de un usuario
function saveUserData(userId, data) {
  const filePath = getUserFilePath(userId);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    // Verificar si el usuario ya existe
    if (findUserByUsername(username)) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }
    let rol = 'usuario';
    // Lógica para el admin
    if (username === 'Joel_ADMINOFFICIAL' && password === '080406') {
      if (findAdminUser()) {
        return res.status(400).json({ error: 'Ya existe un administrador' });
      }
      rol = 'admin';
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();
    // Guardar usuario en el archivo global
    const users = readAllUsers();
    users.push({ id: userId, username, password: hashedPassword, rol });
    saveAllUsers(users);
    // Inicializar archivo JSON para el usuario (datos de juego)
    initializeUserData(userId);
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      userId: userId,
      rol: rol
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const user = findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user.id, rol: user.rol }, SECRET_KEY, { expiresIn: '1d' });
    res.json({ token, rol: user.rol });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener los datos del usuario (para debugging)
router.get('/user-data', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token requerido' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, SECRET_KEY);
    const userId = payload.id;
    
    const userData = getUserData(userId);
    if (!userData) {
      return res.status(404).json({ error: 'Datos de usuario no encontrados' });
    }
    
    res.json(userData);
  } catch (error) {
    console.error('Error obteniendo datos de usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
