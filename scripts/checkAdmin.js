import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../db.js';

async function checkAdmin() {
  try {
    await connectDB();
    console.log('🔍 Verificando usuarios en la base de datos...');
    
    const allUsers = await User.find({});
    console.log('📋 Todos los usuarios:');
    
    if (allUsers.length === 0) {
      console.log('❌ No hay usuarios en la base de datos');
    } else {
      allUsers.forEach(user => {
        console.log(`- ${user.username} (${user.role}): ${user.userId}`);
      });
    }
    
    // Buscar específicamente el admin
    const admin = await User.findOne({ username: 'joel_adminofficial' });
    if (admin) {
      console.log('👑 Admin encontrado:', {
        username: admin.username,
        role: admin.role,
        userId: admin.userId
      });
    } else {
      console.log('❌ No se encontró el admin');
    }
    
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error);
    mongoose.connection.close();
  }
}

checkAdmin(); 