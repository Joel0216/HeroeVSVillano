import express from "express";
import { check, validationResult } from 'express-validator';
import battleService from "../services/battleService.js";

const router = express.Router();

router.get("/battles", async (req, res) => {
    try {
        const battles = await battleService.getAllBattles();
        res.json(battles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/battles",
    [
        check('heroId').isInt().withMessage('heroId debe ser un número'),
        check('villainId').isInt().withMessage('villainId debe ser un número'),
        check('winner').isIn(['hero', 'villain']).withMessage('winner debe ser "hero" o "villain"')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array() });
        }
        try {
            const { heroId, villainId, winner } = req.body;
            const battle = await battleService.addBattle(heroId, villainId, winner);
            res.status(201).json(battle);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

// POST para crear batalla 3vs3 manual (formato recomendado)
router.post('/battles/turn-based-teams', async (req, res) => {
    try {
        const { heroTeam, villainTeam } = req.body;
        if (!Array.isArray(heroTeam) || !Array.isArray(villainTeam) || heroTeam.length !== 3 || villainTeam.length !== 3) {
            return res.status(400).json({ error: 'Cada equipo debe tener exactamente 3 personajes' });
        }
        // Validar que no haya IDs repetidos entre ambos equipos ni dentro de un mismo equipo
        const allIds = [...heroTeam, ...villainTeam];
        if (new Set(allIds).size !== allIds.length) {
            return res.status(400).json({ error: 'No se pueden repetir personajes entre los equipos' });
        }
        if (new Set(heroTeam).size !== heroTeam.length || new Set(villainTeam).size !== villainTeam.length) {
            return res.status(400).json({ error: 'No se pueden repetir personajes dentro de un mismo equipo' });
        }
        const battle = await battleService.createTurnBasedTeamBattleManual(heroTeam, villainTeam);
        res.status(201).json(battle);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET para obtener el estado de una batalla 3vs3 manual por ID
router.get('/battles/turn-based-teams/:battleId', async (req, res) => {
    try {
        const { battleId } = req.params;
        const battle = await battleService.getTurnBasedTeamBattleManual(parseInt(battleId));
        res.json(battle);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST para realizar un ataque manual en batalla 3vs3
router.post('/battles/turn-based-teams/:battleId/attack', async (req, res) => {
    try {
        const { battleId } = req.params;
        const { attackerType, attackerIndex, defenderIndex, attackType } = req.body;
        if (!['hero', 'villain'].includes(attackerType)) {
            return res.status(400).json({ error: 'attackerType debe ser "hero" o "villain"' });
        }
        if (!['basic', 'special'].includes(attackType)) {
            return res.status(400).json({ error: 'attackType debe ser "basic" o "special"' });
        }
        const result = await battleService.performTeamTurnAttackManual(
            parseInt(battleId),
            attackerType,
            attackerIndex,
            defenderIndex,
            attackType
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router; 