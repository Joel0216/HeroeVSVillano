import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function clearCharacters() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Obtener las colecciones
    const db = mongoose.connection.db;
    
    // Limpiar colección de héroes
    const heroResult = await db.collection('heros').deleteMany({});
    console.log(`🗑️ Eliminados ${heroResult.deletedCount} héroes`);
    
    // Limpiar colección de villanos
    const villainResult = await db.collection('villains').deleteMany({});
    console.log(`🗑️ Eliminados ${villainResult.deletedCount} villanos`);
    
    // Limpiar colección de batallas
    const battleResult = await db.collection('battles').deleteMany({});
    console.log(`🗑️ Eliminadas ${battleResult.deletedCount} batallas`);
    
    // Limpiar colección de logs de batalla
    const battleLogResult = await db.collection('battlelogs').deleteMany({});
    console.log(`🗑️ Eliminados ${battleLogResult.deletedCount} logs de batalla`);
    
    console.log('✅ Base de datos limpiada completamente');
    console.log('📝 Ahora puedes registrar nuevos personajes con los campos de animación y sonido');
    
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

clearCharacters(); 