import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 Conexión a MongoDB Atlas exitosa');
    console.log('📊 Base de datos: test');
  } catch (error) {
    console.error('🔴 Error conectando a MongoDB:', error);
    console.log('💡 Verifica que tu IP esté en la whitelist de MongoDB Atlas');
    process.exit(1);
  }
};