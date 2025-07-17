import Villain from '../models/villainModel.js';

async function getVillains() {
    return await Villain.find();
}

async function saveVillain(villainData) {
    const villain = new Villain(villainData);
    return await villain.save();
}

async function updateVillain(id, updatedData) {
    return await Villain.findOneAndUpdate({ id: parseInt(id) }, updatedData, { new: true });
}

async function deleteVillain(id) {
    return await Villain.findOneAndDelete({ id: parseInt(id) });
}

export default {
    getVillains,
    saveVillain,
    updateVillain,
    deleteVillain
}; 