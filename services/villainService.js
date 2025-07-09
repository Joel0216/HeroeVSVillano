import villainRepository from '../repositories/villainRepository.js';
import Villain from '../models/villainModel.js';

async function getAllVillains() {
    return await villainRepository.getVillains();
}

async function addVillain(villain) {
    if (!villain.name || !villain.alias) {
        throw new Error("El villano debe tener un nombre y un alias.");
    }
    const villains = await villainRepository.getVillains();
    const newId = villains.length > 0 ? Math.max(...villains.map(v => v.id)) + 1 : 1;
    const newVillain = { ...villain, id: newId };
    villains.push(newVillain);
    await villainRepository.saveVillains(villains);
    return newVillain;
}

async function updateVillain(id, updatedVillain) {
    const villains = await villainRepository.getVillains();
    const index = villains.findIndex(villain => villain.id === parseInt(id));
    if (index === -1) {
        throw new Error('Villano no encontrado');
    }
    delete updatedVillain.id;
    villains[index] = { ...villains[index], ...updatedVillain };
    await villainRepository.saveVillains(villains);
    return villains[index];
}

async function deleteVillain(id) {
    const villains = await villainRepository.getVillains();
    const index = villains.findIndex(villain => villain.id === parseInt(id));
    if (index === -1) {
        throw new Error('Villano no encontrado');
    }
    const filteredVillains = villains.filter(villain => villain.id !== parseInt(id));
    await villainRepository.saveVillains(filteredVillains);
    return { message: 'Villano eliminado' };
}

export default {
    getAllVillains,
    addVillain,
    updateVillain,
    deleteVillain
}; 