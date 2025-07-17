import express from "express";
import { check, validationResult } from 'express-validator';
import battleService from "../services/battleService.js";
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get("/battles", authMiddleware, async (req, res) => {
    try {
        const battles = await battleService.getAllBattles(req.user.id);
        res.json(battles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/battles", authMiddleware, [
    check('heroId').isInt().withMessage('heroId debe ser un número'),
    check('villainId').isInt().withMessage('villainId debe ser un número'),
    check('winner').isIn(['hero', 'villain']).withMessage('winner debe ser "hero" o "villain"')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array() });
    }
    try {
        const { heroId, villainId, winner } = req.body;
        const userData = getUserData(req.user.id);
        if (!userData) {
            return res.status(404).json({ error: 'Datos de usuario no encontrados' });
        }
        // Autoincremento de id por usuario
        const lastId = userData.battles.length > 0 ? Math.max(...userData.battles.map(b => b.id)) : 0;
        const newBattle = {
            id: lastId + 1,
            heroId,
            villainId,
            winner,
            createdAt: new Date().toISOString()
        };
        userData.battles.push(newBattle);
        saveUserData(req.user.id, userData);
        res.status(201).json(newBattle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST para crear batalla 3vs3 manual (formato recomendado)
router.post('/battles/turn-based-teams', authMiddleware, async (req, res) => {
    try {
        const { heroTeam, villainTeam } = req.body;
        // Nuevo formato: cada equipo es un array de objetos { characterId, type }
        if (!Array.isArray(heroTeam) || !Array.isArray(villainTeam) || heroTeam.length !== 3 || villainTeam.length !== 3) {
            return res.status(400).json({ error: 'Cada equipo debe tener exactamente 3 personajes' });
        }
        // Validar que todos los objetos tengan characterId y type correcto
        if (!heroTeam.every(c => c.characterId && c.type === 'hero')) {
            return res.status(400).json({ error: 'Todos los héroes deben tener characterId y type "hero"' });
        }
        if (!villainTeam.every(c => c.characterId && c.type === 'villain')) {
            return res.status(400).json({ error: 'Todos los villanos deben tener characterId y type "villain"' });
        }
        // Validar que no haya IDs repetidos dentro de un mismo equipo
        const heroIds = heroTeam.map(c => c.characterId);
        const villainIds = villainTeam.map(c => c.characterId);
        if (new Set(heroIds).size !== heroIds.length) {
            return res.status(400).json({ error: 'No se pueden repetir personajes dentro del equipo de héroes' });
        }
        if (new Set(villainIds).size !== villainIds.length) {
            return res.status(400).json({ error: 'No se pueden repetir personajes dentro del equipo de villanos' });
        }
        const battle = await battleService.createTurnBasedTeamBattleManual(heroTeam, villainTeam, req.user.id);
        res.status(201).json(battle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET para obtener el estado de una batalla 3vs3 manual por ID
router.get('/battles/turn-based-teams/:battleId', authMiddleware, async (req, res) => {
    try {
        const { battleId } = req.params;
        const battle = await battleService.getTurnBasedTeamBattleManual(parseInt(battleId), req.user.id);
        if (!battle) return res.status(404).json({ error: 'No encontrado' });
        res.json(battle);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST para realizar un ataque manual en batalla 3vs3
router.post('/battles/turn-based-teams/:battleId/attack', authMiddleware, async (req, res) => {
    try {
        const { battleId } = req.params;
        const { attackerType, attackType } = req.body;
        if (!['hero', 'villain'].includes(attackerType)) {
            return res.status(400).json({ error: 'attackerType debe ser "hero" o "villain"' });
        }
        if (!['basic', 'special'].includes(attackType)) {
            return res.status(400).json({ error: 'attackType debe ser "basic" o "special"' });
        }
        const result = await battleService.performTeamTurnAttackManual(
            parseInt(battleId),
            attackerType,
            attackType,
            req.user.id
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router; 