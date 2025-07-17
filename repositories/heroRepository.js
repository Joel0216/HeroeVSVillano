import Hero from '../models/heroModel.js';

async function getHeroes() {
    return await Hero.find();
}

async function saveHero(heroData) {
    const hero = new Hero(heroData);
    return await hero.save();
}

async function updateHero(id, updatedData) {
    return await Hero.findOneAndUpdate({ id: parseInt(id) }, updatedData, { new: true });
}

async function deleteHero(id) {
    return await Hero.findOneAndDelete({ id: parseInt(id) });
}

export default {
    getHeroes,
    saveHero,
    updateHero,
    deleteHero
};