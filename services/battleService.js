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

export default {
    getAllBattles,
    addBattle
}; 