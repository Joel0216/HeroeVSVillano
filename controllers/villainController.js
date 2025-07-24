import express from "express";
import { check, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import villainService from "../services/villainService.js";
import Villain from "../models/villainModel.js";
import { authMiddleware } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const SECRET_KEY = 'tu_clave_secreta';

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