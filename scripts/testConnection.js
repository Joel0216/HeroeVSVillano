import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../db.js';

async function testConnection() {
  try {
    console.log('🔍 Probando conexión a MongoDB...');
    await connectDB();
    console.log('✅ Conexión exitosa');
    
    console.log('🔍 Probando creación de usuario...');
    const testUser = new User({
      username: 'test_user',
      password: 'test123',
      role: 'user'
    });
    
    await testUser.save();
    console.log('✅ Usuario creado exitosamente:', {
      userId: testUser.userId,
      username: testUser.username,
      role: testUser.role
    });
    
    // Limpiar usuario de prueba
    await User.deleteOne({ username: 'test_user' });
    console.log('✅ Usuario de prueba eliminado');
    
    console.log('🎉 Todas las pruebas pasaron');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error en pruebas:', error);
    mongoose.connection.close();
  }
}

testConnection(); 