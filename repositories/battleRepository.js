let battles = [];

async function getBattles() {
    return battles;
}

async function saveBattles(newBattles) {
    battles = newBattles;
}

export default {
    getBattles,
    saveBattles
}; 