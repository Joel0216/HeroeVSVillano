
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
const SECRET_KEY = 'tu_clave_secreta';

// Registro
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('📋 Registro solicitado:', { username });
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Normaliza el username a minúsculas
    const normalizedUsername = username.trim().toLowerCase();
    console.log('📋 Username normalizado:', normalizedUsername);

    // Lógica para el admin
    let role = 'user';
    console.log('🔍 Verificando si es admin...');
    
    if (normalizedUsername === 'joel_adminofficial' && password === '080406') {
      console.log('✅ Credenciales de admin detectadas');
      const adminExists = await User.findOne({ role: 'admin' });
      console.log('🔍 Admin existente:', adminExists);
      if (adminExists) {
        console.log('❌ Ya existe un administrador');
        return res.status(400).json({ error: 'Ya existe un administrador' });
      }
      role = 'admin';
      console.log('👑 Role asignado como admin');
    } else {
      console.log('❌ No es admin, role asignado como user');
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      console.log('❌ Usuario ya existe');
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hasheado');
    
    const nuevoUsuario = new User({ username: normalizedUsername, password: hashedPassword, role });
    await nuevoUsuario.save();
    console.log('✅ Usuario guardado:', { 
      userId: nuevoUsuario.userId, 
      username: nuevoUsuario.username, 
      role: nuevoUsuario.role 
    });
    
    // Generar token igual que en login
    const token = jwt.sign({ 
      id: nuevoUsuario._id, 
      userId: nuevoUsuario.userId,
      role: role 
    }, SECRET_KEY, { expiresIn: '1d' });
    console.log('🔑 Token generado con role:', role);
    
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: nuevoUsuario.userId,
      token: token,
      role: role
    });
  } catch (error) {
    console.error('❌ Error en registro:', error);
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
    
    // Normalizar el username igual que en registro
    const normalizedUsername = username.trim().toLowerCase();
    
    const user = await User.findOne({ username: normalizedUsername });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    
    console.log('🔐 Login exitoso para usuario:', user.username);
    console.log('👑 Role del usuario:', user.role);
    console.log('🆔 UserID:', user.userId);
    
    const token = jwt.sign({ 
      id: user._id, 
      userId: user.userId,
      role: user.role 
    }, SECRET_KEY, { expiresIn: '1d' });
    
    console.log('🔑 Token generado:', token.substring(0, 50) + '...');
    console.log('📋 Payload del token:', { id: user._id, userId: user.userId, role: user.role });
    
    res.json({ 
      token, 
      userId: user.userId,
      role: user.role 
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
