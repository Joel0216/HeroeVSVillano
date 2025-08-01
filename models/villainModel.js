import mongoose from 'mongoose';

const villainSchema = new mongoose.Schema({
  villainId: { type: String, unique: true, sparse: true },
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
villainSchema.pre('save', async function(next) {
  if (this.isNew && !this.villainId) {
    let villainId;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 8);
      villainId = `VILLAIN_${timestamp}_${random}`;
      
      // Verificar si el ID ya existe
      const existingVillain = await mongoose.model('Villain').findOne({ villainId });
      if (!existingVillain) {
        isUnique = true;
        this.villainId = villainId;
      }
      attempts++;
    }
    
    if (!isUnique) {
      return next(new Error('No se pudo generar un ID único para el villano'));
    }
  }
  next();
});

// Método estático para encontrar villano por características
villainSchema.statics.findByCharacteristics = function(name, alias, city, team) {
  return this.findOne({
    name: name,
    alias: alias,
    city: city,
    team: team
  });
};

export default mongoose.model('Villain', villainSchema); 