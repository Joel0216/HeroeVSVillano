import mongoose from 'mongoose';
import Hero from './models/heroModel.js';
import Villain from './models/villainModel.js';
import Battle from './models/battleModel.js';
import User from './models/User.js';
import { connectDB } from './db.js';

async function clearAll() {
  await connectDB();

  await Hero.deleteMany({});
  console.log('🗑️ Héroes eliminados');

  await Villain.deleteMany({});
  console.log('🗑️ Villanos eliminados');

  await Battle.deleteMany({});
  console.log('🗑️ Batallas eliminadas');

  await User.deleteMany({});
  console.log('🗑️ Usuarios eliminados');

  mongoose.connection.close();
  console.log('🚀 Base de datos completamente vacía');
}

clearAll().catch(err => {
  console.error('Error al limpiar la base de datos:', err);
  mongoose.connection.close();
}); 