import express from "express";
import { check, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import villainService from "../services/villainService.js";
import Villain from "../models/villainModel.js";
import { authMiddleware } from '../middleware/auth.js';
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
// Función para guardar los datos de un usuariocl
function saveUserData(userId, data) {
  const filePath = getUserFilePath(userId);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

router.get("/villains", authMiddleware, async (req, res) => {
    try {
        const villains = await Villain.find({}); // Mostrar todos los villanos
        res.json(villains);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/villains", authMiddleware, requireAdmin, [
    check('name').not().isEmpty().withMessage('El nombre es requerido'),
    check('alias').not().isEmpty().withMessage('El alias es requerido')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { name, alias, city, team } = req.body;
        // Guardar villano en MongoDB con userId
        const newVillain = new Villain({
            name,
            alias,
            city: city || '',
            team: team || '',
            userId: req.user.id
        });
        await newVillain.save();
        res.status(201).json(newVillain);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put("/villains/:id", authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Solo permite modificar villanos del usuario autenticado
        const updatedVillain = await Villain.findOneAndUpdate(
            { id: parseInt(id), userId: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedVillain) return res.status(404).json({ error: 'Villano no encontrado o no autorizado' });
        res.json(updatedVillain);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/villains/:id", authMiddleware, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        // Solo permite eliminar villanos del usuario autenticado
        const deletedVillain = await Villain.findOneAndDelete({ id: parseInt(id), userId: req.user.id });
        if (!deletedVillain) return res.status(404).json({ error: 'Villano no encontrado o no autorizado' });
        res.json({ message: 'Villano eliminado', villain: deletedVillain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router; 