import mongoose from 'mongoose';
import fs from 'fs-extra';
import Hero from './models/heroModel.js';
import Villain from './models/villainModel.js';
import Battle from './models/battleModel.js';
import { connectDB } from './db.js';

async function migrate() {
  await connectDB();

  // Migrar héroes
  const heroesData = await fs.readJson('./data/superheroes.json');
  await Hero.deleteMany({});
  await Hero.insertMany(heroesData);
  console.log('✅ Héroes migrados');

  // Migrar villanos
  const villainsData = await fs.readJson('./data/villains.json');
  await Villain.deleteMany({});
  await Villain.insertMany(villainsData);
  console.log('✅ Villanos migrados');

  // Migrar batallas
  const battlesData = await fs.readJson('./data/battles.json');
  await Battle.deleteMany({});
  await Battle.insertMany(battlesData);
  console.log('✅ Batallas migradas');

  mongoose.connection.close();
  console.log('🚀 Migración completada y conexión cerrada');
}

migrate().catch(err => {
  console.error('Error en la migración:', err);
  mongoose.connection.close();
}); 