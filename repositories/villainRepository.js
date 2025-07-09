let villains = [];

async function getVillains() {
    return villains;
}

async function saveVillains(newVillains) {
    villains = newVillains;
}

export default {
    getVillains,
    saveVillains
}; 