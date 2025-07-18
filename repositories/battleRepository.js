import Battle from '../models/battleModel.js';

async function getBattles() {
    return await Battle.find();
}

async function saveBattle(battleData) {
    const battle = new Battle(battleData);
    return await battle.save();
}

async function updateBattle(id, updatedData) {
    return await Battle.findOneAndUpdate({ id: parseInt(id) }, updatedData, { new: true });
}

async function deleteBattle(id) {
    return await Battle.findOneAndDelete({ id: parseInt(id) });
}

async function getBattleById(id, userId) {
    return await Battle.findOne({ id: parseInt(id), userId });
}

async function getBattlesByUserId(userId) {
    return await Battle.find({ userId });
}

export default {
    getBattles,
    saveBattle,
    updateBattle,
    deleteBattle,
    getBattleById,
    getBattlesByUserId
}; 