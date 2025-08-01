// Script para probar conexión a base de datos
import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔗 Probando conexión a MongoDB...');
    console.log('📋 URI:', MONGO_URI);
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conexión exitosa a MongoDB');
    
    // Listar las colecciones
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📊 Colecciones disponibles:', collections.map(c => c.name));
    
    // Verificar si existe la colección de usuarios
    const userCollection = collections.find(c => c.name === 'users');
    if (userCollection) {
      console.log('✅ Colección "users" encontrada');
      
      // Contar usuarios
      const userCount = await mongoose.connection.db.collection('users').countDocuments();
      console.log('👥 Número de usuarios:', userCount);
      
      // Listar usuarios
      const users = await mongoose.connection.db.collection('users').find({}).toArray();
      console.log('📋 Usuarios en la base de datos:');
      users.forEach(user => {
        console.log(`  - ${user.username} (${user.role}) - ID: ${user.userId}`);
      });
    } else {
      console.log('❌ Colección "users" no encontrada');
    }
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar prueba
testConnection(); 