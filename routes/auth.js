
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
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Normaliza el username a minúsculas
    const normalizedUsername = username.trim().toLowerCase();

    // Lógica para el admin
    let rol = 'usuario';
    if (normalizedUsername === 'joel_adminofficial' && password === '080406') {
      const adminExists = await User.findOne({ rol: 'admin' });
      if (adminExists) {
        return res.status(400).json({ error: 'Ya existe un administrador' });
      }
      rol = 'admin';
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username: normalizedUsername });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = new User({ username: normalizedUsername, password: hashedPassword, rol });
    await nuevoUsuario.save();
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      userId: nuevoUsuario._id,
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
    console.log('Intentando login con:', username);
    if (!username || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const user = await User.findOne({ username });
    console.log('Usuario encontrado:', user);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: user._id, rol: user.rol }, SECRET_KEY, { expiresIn: '1d' });
    res.json({ token, rol: user.rol });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
