import villainRepository from '../repositories/villainRepository.js';

async function getAllVillains() {
    return await villainRepository.getVillains();
}

async function addVillain(villain) {
    if (!villain.name || !villain.alias) {
        throw new Error("El villano debe tener un nombre y un alias.");
    }
    // Buscar el último id para autoincrementar
    const villains = await villainRepository.getVillains();
    const newId = villains.length > 0 ? Math.max(...villains.map(v => v.id)) + 1 : 1;
    const villainData = { ...villain, id: newId };
    return await villainRepository.saveVillain(villainData);
}

async function updateVillain(id, updatedVillain) {
    delete updatedVillain.id;
    return await villainRepository.updateVillain(id, updatedVillain);
}

async function deleteVillain(id) {
    return await villainRepository.deleteVillain(id);
}

export default {
    getAllVillains,
    addVillain,
    updateVillain,
    deleteVillain
}; 