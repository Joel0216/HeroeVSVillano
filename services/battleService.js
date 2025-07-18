import battleRepository from '../repositories/battleRepository.js';
import heroRepository from '../repositories/heroRepository.js';
import villainRepository from '../repositories/villainRepository.js';

async function getAllBattles(userId) {
    return await battleRepository.getBattlesByUserId(userId);
}

async function addBattle(heroId, villainId, winner) {
    // Validar que ambos existan
    const heroes = await heroRepository.getHeroes();
    const villains = await villainRepository.getVillains();
    const hero = heroes.find(h => h.id === parseInt(heroId));
    const villain = villains.find(v => v.id === parseInt(villainId));
    if (!hero) throw new Error('Héroe no encontrado');
    if (!villain) throw new Error('Villano no encontrado');
    if (heroId === villainId) throw new Error('No se permite enfrentamiento entre el mismo personaje');
    if (winner !== 'hero' && winner !== 'villain') throw new Error('El ganador debe ser "hero" o "villain"');
    const battles = await battleRepository.getBattles();
    const newId = battles.length > 0 ? Math.max(...battles.map(b => b.id)) + 1 : 1;
    const battleData = { id: newId, heroId, villainId, winner, date: new Date().toISOString() };
    return await battleRepository.saveBattle(battleData);
}

async function createTurnBasedTeamBattleManual(heroTeam, villainTeam, userId) {
    // Validar que no haya IDs repetidos dentro de un mismo equipo
    const heroIds = heroTeam.map(c => c.characterId);
    const villainIds = villainTeam.map(c => c.characterId);
    if (new Set(heroIds).size !== heroIds.length) {
        throw new Error('No se pueden repetir personajes dentro del equipo de héroes');
    }
    if (new Set(villainIds).size !== villainIds.length) {
        throw new Error('No se pueden repetir personajes dentro del equipo de villanos');
    }
    // Obtener las batallas existentes del usuario
    const userBattles = await battleRepository.getBattlesByUserId(userId);
    const newId = userBattles.length > 0 ? Math.max(...userBattles.map(b => b.id)) + 1 : 1;
    // Obtener todos los héroes y villanos para buscar los nombres
    const allHeroes = await heroRepository.getHeroes();
    const allVillains = await villainRepository.getVillains();
    // Validar que todos los héroes existen
    for (const member of heroTeam) {
        const hero = allHeroes.find(h => h.id === member.characterId);
        if (!hero) throw new Error(`Héroe con id ${member.characterId} no encontrado`);
    }
    // Validar que todos los villanos existen
    for (const member of villainTeam) {
        const villain = allVillains.find(v => v.id === member.characterId);
        if (!villain) throw new Error(`Villano con id ${member.characterId} no encontrado`);
    }
    // Inicializar los equipos con nombre, vida, escudo y barra de poder
    const initHero = (member) => {
        const hero = allHeroes.find(h => h.id === member.characterId);
        return {
            id: member.characterId,
            name: hero ? hero.name : '',
            life: 200,
            maxLife: 200,
            shield: 100,
            maxShield: 100,
            powerBar: 0
        };
    };
    const initVillain = (member) => {
        const villain = allVillains.find(v => v.id === member.characterId);
        return {
            id: member.characterId,
            name: villain ? villain.name : '',
            life: 200,
            maxLife: 200,
            shield: 100,
            maxShield: 100,
            powerBar: 0
        };
    };
    const fullHeroTeam = heroTeam.map(initHero);
    const fullVillainTeam = villainTeam.map(initVillain);
    const battleData = {
        id: newId,
        userId,
        type: 'turn-based-teams-manual',
        heroTeam: fullHeroTeam,
        villainTeam: fullVillainTeam,
        currentHeroIndex: 0,
        currentVillainIndex: 0,
        currentTurn: 'hero',
        turns: [],
        status: 'active',
        winner: null,
        date: new Date().toISOString()
    };
    return await battleRepository.saveBattle(battleData);
}

async function performTeamTurnAttackManual(battleId, attackerType, attackType) {
    // Buscar la batalla
    const battles = await battleRepository.getBattles();
    const battle = battles.find(b => b.id === battleId);
    if (!battle) throw new Error('Batalla no encontrada');
    if (battle.status !== 'active') throw new Error('La batalla ya terminó');

    // Determinar equipos y turnos
    let attacker, defender, attackerIndex, defenderIndex;
    if (attackerType === 'hero') {
        attackerIndex = battle.currentHeroIndex;
        defenderIndex = battle.currentVillainIndex;
        attacker = battle.heroTeam[attackerIndex];
        defender = battle.villainTeam[defenderIndex];
    } else {
        attackerIndex = battle.currentVillainIndex;
        defenderIndex = battle.currentHeroIndex;
        attacker = battle.villainTeam[attackerIndex];
        defender = battle.heroTeam[defenderIndex];
    }

    // Inicializar valores si no existen
    attacker.powerBar = attacker.powerBar !== undefined ? attacker.powerBar : 0;
    attacker.maxShield = attacker.maxShield !== undefined ? attacker.maxShield : 100;
    attacker.shield = attacker.shield !== undefined ? attacker.shield : 100;
    defender.powerBar = defender.powerBar !== undefined ? defender.powerBar : 0;
    defender.maxShield = defender.maxShield !== undefined ? defender.maxShield : 100;
    defender.shield = defender.shield !== undefined ? defender.shield : 100;

    // Lógica de ataque mejorada
    let damage = 15;
    let isCritical = false;
    let attackDescription = '';
    let specialAvailable = attacker.powerBar === 4;

    if (attackType === 'special') {
        if (!specialAvailable) {
            throw new Error('Golpe especial no disponible');
        }
        damage = 45;
        attackDescription = '¡GOLPE ESPECIAL! (en espera que se llene la barra de poder)';
        attacker.powerBar = 0; // Reiniciar barra
    } else {
        isCritical = Math.random() < 0.2;
        if (isCritical) damage += 10;
        attackDescription = isCritical ? '¡GOLPE CRÍTICO!' : 'Ataque básico';
        // Incrementar barra de poder solo si no es especial
        attacker.powerBar = Math.min(attacker.powerBar + 1, 4);
        if (attacker.powerBar === 4) {
            attackDescription += ' (¡Golpe especial disponible!)';
        }
    }

    // Escudo absorbe primero
    let shieldBefore = defender.shield;
    let lifeBefore = defender.life;
    let shieldAfter = Math.max(0, shieldBefore - damage);
    let damageToLife = Math.max(0, damage - shieldBefore);
    let lifeAfter = Math.max(0, lifeBefore - damageToLife);
    defender.shield = shieldAfter;
    defender.life = lifeAfter;

    // Actualizar turno
    const turnNumber = (battle.turns?.length || 0) + 1;
    const turn = {
        turnNumber,
        attacker: attacker.name,
        defender: defender.name,
        attackType,
        damage,
        isCritical,
        attackDescription,
        attackerLife: attacker.life,
        attackerShield: attacker.shield,
        attackerMaxShield: attacker.maxShield,
        attackerPowerBar: attacker.powerBar,
        defenderLife: defender.life,
        defenderShield: defender.shield,
        defenderMaxShield: defender.maxShield,
        defenderPowerBar: defender.powerBar,
        timestamp: new Date().toISOString()
    };
    battle.turns = battle.turns || [];
    battle.turns.push(turn);

    // Cambiar el turno al siguiente personaje SOLO si el defensor fue derrotado
    if (defender.life <= 0) {
        if (attackerType === 'hero') {
            battle.currentVillainIndex = (battle.currentVillainIndex + 1) % battle.villainTeam.length;
        } else {
            battle.currentHeroIndex = (battle.currentHeroIndex + 1) % battle.heroTeam.length;
        }
    }
    // El turno siempre alterna entre héroe y villano
    battle.currentTurn = attackerType === 'hero' ? 'villain' : 'hero';

    // Revisar si algún equipo perdió
    const allHeroesDead = battle.heroTeam.every(h => h.life <= 0);
    const allVillainsDead = battle.villainTeam.every(v => v.life <= 0);
    if (allHeroesDead) {
        battle.status = 'finished';
        battle.winner = 'villainTeam';
    } else if (allVillainsDead) {
        battle.status = 'finished';
        battle.winner = 'heroTeam';
    }

    // Guardar la batalla actualizada
    await battleRepository.updateBattle(battleId, battle);
    return battle;
}

async function getTurnBasedTeamBattleManual(battleId, userId) {
    const battle = await battleRepository.getBattleById(battleId, userId);
    if (!battle) throw new Error('Batalla no encontrada');
    if (battle.type !== 'turn-based-teams-manual') throw new Error('La batalla no es de tipo 3vs3 manual');
    return battle;
}

export default {
    getAllBattles,
    addBattle,
    createTurnBasedTeamBattleManual,
    performTeamTurnAttackManual,
    getTurnBasedTeamBattleManual
}; 