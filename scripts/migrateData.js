import mongoose from 'mongoose';
import Hero from '../models/heroModel.js';
import Villain from '../models/villainModel.js';
import { connectDB } from '../db.js';

async function migrateData() {
  await connectDB();
  
  console.log('🔄 Migrando datos existentes...');
  
  // Migrar héroes
  const heroes = await Hero.find({ heroId: { $exists: false } });
  console.log(`📋 Encontrados ${heroes.length} héroes sin heroId`);
  
  for (const hero of heroes) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    hero.heroId = `HERO_${timestamp}_${random}`;
    hero.createdBy = hero.createdBy || 'ADMIN_MIGRATION'; // Asignar por defecto
    await hero.save();
    console.log(`✅ Héroe migrado: ${hero.name} -> ${hero.heroId}`);
  }
  
  // Migrar villanos
  const villains = await Villain.find({ villainId: { $exists: false } });
  console.log(`📋 Encontrados ${villains.length} villanos sin villainId`);
  
  for (const villain of villains) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    villain.villainId = `VILLAIN_${timestamp}_${random}`;
    villain.createdBy = villain.createdBy || 'ADMIN_MIGRATION'; // Asignar por defecto
    await villain.save();
    console.log(`✅ Villano migrado: ${villain.name} -> ${villain.villainId}`);
  }
  
  console.log('✅ Migración completada');
  mongoose.connection.close();
}

migrateData().catch(err => {
  console.error('Error en migración:', err);
  mongoose.connection.close();
}); 