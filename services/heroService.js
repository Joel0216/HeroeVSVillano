import heroRepository from '../repositories/heroRepository.js';

async function getAllHeroes() {
    return await heroRepository.getHeroes();
}

async function addHero(hero) {
    if (!hero.name || !hero.alias) {
        throw new Error("El héroe debe tener un nombre y un alias.");
    }
    // Buscar el último id para autoincrementar
    const heroes = await heroRepository.getHeroes();
    const newId = heroes.length > 0 ? Math.max(...heroes.map(h => h.id)) + 1 : 1;
    const heroData = { ...hero, id: newId };
    return await heroRepository.saveHero(heroData);
}

async function updateHero(id, updatedHero) {
    delete updatedHero.id;
    return await heroRepository.updateHero(id, updatedHero);
}

async function deleteHero(id) {
    return await heroRepository.deleteHero(id);
}

async function findHeroesByCity(city) {
    const heroes = await heroRepository.getHeroes();
    return heroes.filter(hero => hero.city.toLowerCase() === city.toLowerCase());
}

async function faceVillain(heroId, villain) {
    const hero = (await heroRepository.getHeroes()).find(hero => hero.id === parseInt(heroId));
    if (!hero) {
        throw new Error('Héroe no encontrado');
    }
    return `${hero.alias} enfrenta a ${villain}`;
}

export default {
    getAllHeroes,
    addHero,
    updateHero,
    deleteHero,
    findHeroesByCity,
    faceVillain
};