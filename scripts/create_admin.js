// Script para crear usuario admin
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority';

async function createAdmin() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conexión exitosa');
    
    // Verificar si ya existe un admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('👑 Admin ya existe:', {
        username: existingAdmin.username,
        userId: existingAdmin.userId,
        role: existingAdmin.role
      });
      return;
    }
    
    // Crear usuario admin
    const adminUsername = 'joel_adminofficial';
    const adminPassword = '080406';
    
    console.log('🔍 Verificando si el usuario admin ya existe...');
    const existingUser = await User.findOne({ username: adminUsername });
    
    if (existingUser) {
      console.log('⚠️ Usuario ya existe, actualizando a admin...');
      existingUser.role = 'admin';
      await existingUser.save();
      console.log('✅ Usuario actualizado a admin');
    } else {
      console.log('👑 Creando nuevo usuario admin...');
      
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        username: adminUsername,
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('✅ Admin creado exitosamente:', {
        username: adminUser.username,
        userId: adminUser.userId,
        role: adminUser.role
      });
    }
    
    console.log('\n🎯 Credenciales de admin:');
    console.log('Usuario:', adminUsername);
    console.log('Contraseña:', adminPassword);
    console.log('Role: admin');
    
  } catch (error) {
    console.error('❌ Error creando admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar script
createAdmin(); 