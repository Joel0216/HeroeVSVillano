import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority';

export const connectDB = async () => {
  try {
    console.log('🔗 Intentando conectar a MongoDB...');
    console.log('📋 URI:', MONGO_URI.substring(0, 50) + '...');
    
    await mongoose.connect(MONGO_URI);
    console.log('🟢 Conexión a MongoDB Atlas exitosa');
    console.log('📊 Base de datos: test');
    
    // Verificar que la conexión esté activa
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log('🔍 Estado de conexión:', states[dbState]);
    
  } catch (error) {
    console.error('🔴 Error conectando a MongoDB:', error.message);
    console.log('💡 Verifica que tu IP esté en la whitelist de MongoDB Atlas');
    console.log('💡 En Render, configura la variable MONGODB_URI');
    
    // En producción, no salir del proceso, solo loggear el error
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Continuando sin base de datos en producción');
    } else {
      console.log('❌ Saliendo del proceso en desarrollo');
      process.exit(1);
    }
  }
};

// Función para verificar si la base de datos está conectada
export const isDBConnected = () => {
  return mongoose.connection.readyState === 1;
};