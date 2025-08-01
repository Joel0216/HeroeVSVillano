import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

async function testNewFields() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Importar modelos
    const Hero = mongoose.model('Hero', new mongoose.Schema({
      heroId: { type: String, unique: true, sparse: true },
      name: { type: String, required: true },
      alias: { type: String, required: true },
      city: { type: String, default: '' },
      team: { type: String, default: '' },
      image: { type: String, default: '' },
      specialAttackAnimationUrl: { type: String, default: '' },
      specialAttackSoundUrl: { type: String, default: '' },
      createdBy: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }));

    const Villain = mongoose.model('Villain', new mongoose.Schema({
      villainId: { type: String, unique: true, sparse: true },
      name: { type: String, required: true },
      alias: { type: String, required: true },
      city: { type: String, default: '' },
      team: { type: String, default: '' },
      image: { type: String, default: '' },
      specialAttackAnimationUrl: { type: String, default: '' },
      specialAttackSoundUrl: { type: String, default: '' },
      createdBy: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }));

    // Crear un héroe de prueba con animación y sonido
    const testHero = new Hero({
      name: 'Iron Man Test',
      alias: 'Tony Stark Test',
      city: 'Malibu',
      team: 'Los Vengadores',
      image: 'https://via.placeholder.com/100x100?text=IronMan',
      specialAttackAnimationUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
      specialAttackSoundUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      createdBy: 'ADMIN_001'
    });

    await testHero.save();
    console.log('✅ Héroe de prueba creado con animación y sonido:', testHero);

    // Crear un villano de prueba con animación y sonido
    const testVillain = new Villain({
      name: 'Thanos Test',
      alias: 'The Mad Titan Test',
      city: 'Titan',
      team: 'Los Black Order',
      image: 'https://via.placeholder.com/100x100?text=Thanos',
      specialAttackAnimationUrl: 'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
      specialAttackSoundUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      createdBy: 'ADMIN_001'
    });

    await testVillain.save();
    console.log('✅ Villano de prueba creado con animación y sonido:', testVillain);

    // Verificar que los campos se guardaron correctamente
    const savedHero = await Hero.findOne({ name: 'Iron Man Test' });
    const savedVillain = await Villain.findOne({ name: 'Thanos Test' });

    console.log('\n📋 Verificación de campos:');
    console.log('Héroe - Animación URL:', savedHero.specialAttackAnimationUrl);
    console.log('Héroe - Sonido URL:', savedHero.specialAttackSoundUrl);
    console.log('Villano - Animación URL:', savedVillain.specialAttackAnimationUrl);
    console.log('Villano - Sonido URL:', savedVillain.specialAttackSoundUrl);

    console.log('\n✅ Prueba completada exitosamente');
    console.log('🎮 Ahora puedes probar el juego con estos personajes');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

testNewFields(); 