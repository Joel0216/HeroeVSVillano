import battleRepository from '../repositories/battleRepository.js';
import heroRepository from '../repositories/heroRepository.js';
import villainRepository from '../repositories/villainRepository.js';
import Battle from '../models/battleModel.js';

async function getAllBattles() {
    return await battleRepository.getBattles();
}

async function addBattle(heroId, villainId, winner) {
    // Validar que ambos existan
    const heroes = await heroRepository.getHeroes();
    const villains = await villainRepository.getVillains();
    const hero = heroes.find(h => h.id === parseInt(heroId));
    const villain = villains.find(v => v.id === parseInt(villainId));
    if (!hero) throw new Error('Héroe no encontrado');
    if (!villain) throw new Error('Villano no encontrado');
    // Validar que no sea heroe vs heroe ni villano vs villano
    if (heroId === villainId) throw new Error('No se permite enfrentamiento entre el mismo personaje');
    // Validar ganador válido
    if (winner !== 'hero' && winner !== 'villain') throw new Error('El ganador debe ser "hero" o "villain"');
    const battles = await battleRepository.getBattles();
    const newId = battles.length > 0 ? Math.max(...battles.map(b => b.id)) + 1 : 1;
    const battle = new Battle(newId, heroId, villainId, winner, new Date().toISOString());
    battles.push(battle);
    await battleRepository.saveBattles(battles);
    return battle;
}

// Crear batalla 3vs3 manual
async function createTurnBasedTeamBattleManual(heroTeam, villainTeam) {
    const heroes = await heroRepository.getHeroes();
    const villains = await villainRepository.getVillains();
    const maxLife = 200;
    const maxShield = 100;
    // Buscar cada personaje según su type
    const heroTeamArr = heroTeam.map(c => {
        const h = heroes.find(h => h.id === parseInt(c.characterId));
        if (!h) throw new Error('Algún héroe no existe');
        return { id: h.id, name: h.name, life: maxLife, maxLife, shield: maxShield, maxShield, powerBar: 0 };
    });
    const villainTeamArr = villainTeam.map(c => {
        const v = villains.find(v => v.id === parseInt(c.characterId));
        if (!v) throw new Error('Algún villano no existe');
        return { id: v.id, name: v.name, life: maxLife, maxLife, shield: maxShield, maxShield, powerBar: 0 };
    });
    const battles = await battleRepository.getBattles();
    const newId = battles.length > 0 ? Math.max(...battles.map(b => b.id)) + 1 : 1;
    const battle = {
        id: newId,
        type: 'turn-based-teams-manual',
        heroTeam: heroTeamArr,
        villainTeam: villainTeamArr,
        turns: [],
        status: 'active',
        winner: null,
        date: new Date().toISOString()
    };
    battles.push(battle);
    await battleRepository.saveBattles(battles);
    return battle;
}

// Obtener batalla 3vs3 manual por ID
async function getTurnBasedTeamBattleManual(battleId) {
    const battles = await battleRepository.getBattles();
    const battle = battles.find(b => b.id === battleId && b.type === 'turn-based-teams-manual');
    if (!battle) throw new Error('Batalla por turnos de equipos manual no encontrada');
    return battle;
}

// Lógica de ataque manual 3vs3
async function performTeamTurnAttackManual(battleId, attackerType, attackType) {
    const battles = await battleRepository.getBattles();
    const battle = battles.find(b => b.id === battleId && b.type === 'turn-based-teams-manual');
    if (!battle) throw new Error('Batalla por turnos de equipos manual no encontrada');
    if (battle.status === 'finished') throw new Error('La batalla ya ha terminado');

    let attackerTeam, defenderTeam;
    if (attackerType === 'hero') {
        attackerTeam = battle.heroTeam;
        defenderTeam = battle.villainTeam;
    } else if (attackerType === 'villain') {
        attackerTeam = battle.villainTeam;
        defenderTeam = battle.heroTeam;
    } else {
        throw new Error('attackerType debe ser "hero" o "villain"');
    }
    // Buscar el primer vivo de cada equipo
    const attacker = attackerTeam.find(c => c.life > 0);
    const defender = defenderTeam.find(c => c.life > 0);
    if (!attacker || !defender) throw new Error('No hay combatientes vivos para atacar');
    if (attacker.life <= 0) throw new Error('El atacante está fuera de combate');
    if (defender.life <= 0) throw new Error('El defensor ya está fuera de combate');

    // Barra de poder: solo puede hacer especial si powerBar >= 4
    if (attackType === 'special' && attacker.powerBar < 4) {
        throw new Error('La barra de poder no está llena para ataque especial');
    }

    // Calcular daño
    let damage = 0, attackDescription = '', isCritical = false;
    if (attackType === 'basic') {
        const criticalChance = 0.15;
        isCritical = Math.random() < criticalChance;
        damage = isCritical ? 35 : 15;
        attackDescription = isCritical ? '¡GOLPE CRÍTICO!' : 'Ataque básico';
        attacker.powerBar = Math.min(attacker.powerBar + 1, 4);
    } else if (attackType === 'special') {
        damage = 50;
        attackDescription = '¡GOLPE ESPECIAL!';
        attacker.powerBar = 0;
    } else {
        throw new Error('attackType debe ser "basic" o "special"');
    }

    // Aplicar daño primero al escudo
    let shieldDamage = Math.min(defender.shield, damage);
    defender.shield -= shieldDamage;
    let lifeDamage = damage - shieldDamage;
    defender.life -= lifeDamage;
    if (defender.shield < 0) defender.shield = 0;
    if (defender.life < 0) defender.life = 0;

    // Crear registro del turno
    const turn = {
        turnNumber: battle.turns.length + 1,
        attacker: attacker.name,
        defender: defender.name,
        attackType,
        damage,
        isCritical,
        attackDescription,
        attackerLife: attacker.life,
        attackerShield: attacker.shield,
        attackerPowerBar: attacker.powerBar,
        defenderLife: defender.life,
        defenderShield: defender.shield,
        defenderPowerBar: defender.powerBar,
        timestamp: new Date().toISOString()
    };
    battle.turns.push(turn);

    // Verificar si el defensor perdió
    if (defender.life <= 0) {
        // ¿Quedan combatientes vivos en el equipo defensor?
        const teamAlive = defenderTeam.some(c => c.life > 0);
        if (!teamAlive) {
            battle.status = 'finished';
            battle.winner = attackerType === 'hero' ? 'heroTeam' : 'villainTeam';
        }
    }

    await battleRepository.saveBattles(battles);

    // Verificar si hay golpe especial disponible para el atacante
    const specialAvailable = attacker.powerBar >= 4;

    return {
        battle: {
            id: battle.id,
            heroTeam: battle.heroTeam,
            villainTeam: battle.villainTeam,
            turns: battle.turns,
            status: battle.status,
            winner: battle.winner
        },
        turn,
        specialAvailable,
        message: specialAvailable ? '¡Golpe especial disponible!' : 'Continúa llenando la barra de poder'
    };
}

export default {
    getAllBattles,
    addBattle,
    createTurnBasedTeamBattleManual,
    getTurnBasedTeamBattleManual,
    performTeamTurnAttackManual,
}; 