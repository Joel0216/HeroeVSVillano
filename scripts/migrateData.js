import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Hero from '../models/heroModel.js';
import Villain from '../models/villainModel.js';

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/superheroes_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', async () => {
  console.log('✅ Conectado a MongoDB');
  
  try {
    console.log('🔄 Iniciando migración de datos...');
    
    // Eliminar campo specialAttackSoundUrl de héroes
    const heroResult = await Hero.updateMany(
      {},
      { $unset: { specialAttackSoundUrl: "" } }
    );
    console.log(`✅ Héroes actualizados: ${heroResult.modifiedCount}`);
    
    // Eliminar campo specialAttackSoundUrl de villanos
    const villainResult = await Villain.updateMany(
      {},
      { $unset: { specialAttackSoundUrl: "" } }
    );
    console.log(`✅ Villanos actualizados: ${villainResult.modifiedCount}`);
    
    console.log('🎉 Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}); 