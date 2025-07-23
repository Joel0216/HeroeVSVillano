import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://Joel:080406Joel@cluster0.l4feayw.mongodb.net/test?retryWrites=true&w=majority';

async function clearCollections() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // Nombres de las colecciones a limpiar
  const collections = ['users', 'heros', 'villains', 'battles'];

  for (const name of collections) {
    try {
      await db.collection(name).deleteMany({});
      console.log(`🗑️ Colección '${name}' vaciada`);
    } catch (err) {
      console.log(`⚠️  No se pudo limpiar la colección '${name}':`, err.message);
    }
  }

  mongoose.connection.close();
  console.log('🚀 Base de datos limpia');
}

clearCollections().catch(err => {
  console.error('Error al limpiar la base de datos:', err);
  mongoose.connection.close();
}); 