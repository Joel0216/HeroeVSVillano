class Battle {
    constructor(id, heroId, villainId, winner, date) {
        this.id = id;
        this.heroId = heroId;
        this.villainId = villainId;
        this.winner = winner; // 'hero' o 'villain'
        this.date = date;
    }
}

export default Battle; 