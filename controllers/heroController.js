import express from "express";
import { check, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import Hero from '../models/heroModel.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const SECRET_KEY = 'tu_clave_secreta';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio para almacenar los archivos JSON de usuarios
const USERS_DIR = path.join(__dirname, '..', 'data', 'users');

// Función para obtener la ruta del archivo JSON de un usuario
function getUserFilePath(userId) {
  return path.join(USERS_DIR, `${userId}.json`);
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

// Middleware de autenticación simplificado
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.user = { id: payload.id, rol: payload.rol };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

router.get("/heroes", authMiddleware, async (req, res) => {
    try {
        const heroes = await Hero.find({}); // Mostrar todos los héroes
        res.json(heroes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/heroes", authMiddleware, requireAdmin, [
    check('name').not().isEmpty().withMessage('El nombre es requerido'),
    check('alias').not().isEmpty().withMessage('El alias es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { name, alias, city, team } = req.body;
        // Guardar héroe en MongoDB con userId
        const newHero = new Hero({
            name,
            alias,
            city: city || '',
            team: team || '',
            userId: req.user.id
        });
        await newHero.save();
        res.status(201).json(newHero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/heroes/:id", authMiddleware, requireAdmin, [
    check('name').not().isEmpty().withMessage('El nombre es requerido'),
    check('alias').not().isEmpty().withMessage('El alias es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { id } = req.params;
        const { name, alias, city, team } = req.body;
        // Solo permite modificar héroes del usuario autenticado
        const updatedHero = await Hero.findOneAndUpdate(
            { id: parseInt(id), userId: req.user.id },
            { name, alias, city: city || '', team: team || '' },
            { new: true }
        );
        if (!updatedHero) {
            return res.status(404).json({ error: 'Héroe no encontrado o no autorizado' });
        }
        res.json(updatedHero);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/heroes/:id", authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Solo permite eliminar héroes del usuario autenticado
        const deletedHero = await Hero.findOneAndDelete({ id: parseInt(id), userId: req.user.id });
        if (!deletedHero) {
            return res.status(404).json({ error: 'Héroe no encontrado o no autorizado' });
        }
        res.json({ message: 'Héroe eliminado exitosamente', hero: deletedHero });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;