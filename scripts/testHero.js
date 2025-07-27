import mongoose from 'mongoose';
import Hero from '../models/heroModel.js';
import { connectDB } from '../db.js';

async function testHero() {
  try {
    console.log('🔍 Probando creación de héroe...');
    await connectDB();
    console.log('✅ Conexión exitosa');
    
    const testHero = new Hero({
      name: 'Tony Stark',
      alias: 'Iron Man',
      city: 'Malibu',
      team: 'Los Vengadores',
      image: 'https://example.com/ironman.jpg',
      createdBy: 'TEST_ADMIN'
    });
    
    await testHero.save();
    console.log('✅ Héroe creado exitosamente:', {
      heroId: testHero.heroId,
      name: testHero.name,
      alias: testHero.alias
    });
    
    // Limpiar héroe de prueba
    await Hero.deleteOne({ name: 'Tony Stark' });
    console.log('✅ Héroe de prueba eliminado');
    
    console.log('🎉 Prueba de héroe exitosa');
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error en prueba de héroe:', error);
    mongoose.connection.close();
  }
}

testHero(); 