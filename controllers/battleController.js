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

export default router; 