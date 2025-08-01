import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema({
  heroId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  alias: { type: String, required: true },
  city: { type: String, default: '' },
  team: { type: String, default: '' },
  image: { type: String, default: '' },
  specialAttackAnimationUrl: { type: String, default: '' },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Generar ID único antes de guardar
heroSchema.pre('save', async function(next) {
  if (this.isNew && !this.heroId) {
    let heroId;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 8);
      heroId = `HERO_${timestamp}_${random}`;
      
      // Verificar si el ID ya existe
      const existingHero = await mongoose.model('Hero').findOne({ heroId });
      if (!existingHero) {
        isUnique = true;
        this.heroId = heroId;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return next(new Error('No se pudo generar un ID único para el héroe'));
    }
  }
  next();
});

// Método estático para encontrar héroe por características
heroSchema.statics.findByCharacteristics = function(name, alias, city, team) {
  return this.findOne({
    name: name,
    alias: alias,
    city: city,
    team: team
  });
};

export default mongoose.model('Hero', heroSchema);