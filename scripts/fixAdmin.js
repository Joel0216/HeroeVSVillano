import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../db.js';

async function fixAdmin() {
  await connectDB();
  
  console.log('🔧 Arreglando usuarios sin userId...');
  
  // Buscar todos los usuarios sin userId
  const usersWithoutId = await User.find({ userId: { $exists: false } });
  
  console.log(`📋 Encontrados ${usersWithoutId.length} usuarios sin userId`);
  
  for (const user of usersWithoutId) {
    // Generar userId para el usuario
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    user.userId = `USER_${timestamp}_${random}`;
    await user.save();
    console.log(`✅ UserId asignado a ${user.username} (${user.role}): ${user.userId}`);
  }
  
  // Mostrar todos los usuarios
  const allUsers = await User.find({});
  console.log('📋 Todos los usuarios:');
  allUsers.forEach(user => {
    console.log(`- ${user.username} (${user.role}): ${user.userId}`);
  });
  
  mongoose.connection.close();
}

fixAdmin().catch(err => {
  console.error('Error arreglando usuarios:', err);
  mongoose.connection.close();
}); 