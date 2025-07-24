import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../db.js';

async function clearUsers() {
  await connectDB();
  await User.deleteMany({});
  console.log('🗑️ Todos los usuarios eliminados de MongoDB');
  mongoose.connection.close();
}

clearUsers().catch(err => {
  console.error('Error al eliminar usuarios:', err);
  mongoose.connection.close();
}); 