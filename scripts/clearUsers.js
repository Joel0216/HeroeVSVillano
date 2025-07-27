import mongoose from 'mongoose';
import User from '../models/User.js';
import Hero from '../models/heroModel.js';
import Villain from '../models/villainModel.js';
import { connectDB } from '../db.js';

async function clearAll() {
  await connectDB();
  
  console.log('🗑️ Eliminando todas las colecciones...');
  
  try {
    // Eliminar todas las colecciones completamente
    await mongoose.connection.db.dropCollection('users');
    console.log('✅ Colección users eliminada');
  } catch (err) {
    console.log('⚠️ Colección users no existía');
  }
  
  try {
    await mongoose.connection.db.dropCollection('heros');
    console.log('✅ Colección heros eliminada');
  } catch (err) {
    console.log('⚠️ Colección heros no existía');
  }
  
  try {
    await mongoose.connection.db.dropCollection('villains');
    console.log('✅ Colección villains eliminada');
  } catch (err) {
    console.log('⚠️ Colección villains no existía');
  }
  
  console.log('✅ Todas las colecciones e índices eliminados completamente');
  mongoose.connection.close();
}

clearAll().catch(err => {
  console.error('Error al limpiar la base de datos:', err);
  mongoose.connection.close();
}); 