import Hero from '../models/heroModel.js';

// Obtener todos los héroes
const getHeroes = async (req, res) => {
  try {
    console.log('📋 GET /heroes - Usuario:', req.user);
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.json(heroes);
  } catch (error) {
    console.error('❌ Error al obtener héroes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo héroe
const createHero = async (req, res) => {
  try {
    console.log('📋 POST /heroes - Usuario:', req.user);
    const { name, alias, city, team, image, specialAttackAnimationUrl } = req.body;
    
    // Validar campos requeridos
    if (!name || !alias) {
      return res.status(400).json({ error: 'Nombre y alias son requeridos' });
    }
    
    // Verificar si ya existe un héroe con las mismas características
    const existingHero = await Hero.findByCharacteristics(name, alias, city, team);
    if (existingHero) {
      return res.status(409).json({ 
        error: 'Ya existe un héroe con estas características',
        existingHero: {
          heroId: existingHero.heroId,
          name: existingHero.name,
          alias: existingHero.alias
        }
      });
    }
    
    // Verificar si existe un héroe con el mismo nombre
    const heroWithSameName = await Hero.findOne({ name: name });
    if (heroWithSameName) {
      return res.status(409).json({ 
        error: 'Ya existe un héroe con este nombre',
        existingHero: {
          heroId: heroWithSameName.heroId,
          name: heroWithSameName.name,
          alias: heroWithSameName.alias
        }
      });
    }
    
    const hero = new Hero({
      name,
      alias,
      city: city || '',
      team: team || '',
      image: image || '',
      specialAttackAnimationUrl: specialAttackAnimationUrl || '',
      createdBy: req.user.userId
    });
    
    await hero.save();
    console.log('✅ Héroe creado:', hero);
    res.status(201).json(hero);
  } catch (error) {
    console.error('❌ Error al crear héroe:', error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'Error de duplicado en la base de datos' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Actualizar un héroe
const updateHero = async (req, res) => {
  try {
    console.log('📋 PUT /heroes - Usuario:', req.user);
    const { heroId } = req.params;
    const { name, alias, city, team, image, specialAttackAnimationUrl } = req.body;
    
    console.log('📋 HeroId:', heroId);
    
    const hero = await Hero.findOneAndUpdate(
      { heroId },
      { name, alias, city, team, image, specialAttackAnimationUrl },
      { new: true, runValidators: true }
    );
    
    if (!hero) {
      return res.status(404).json({ error: 'Héroe no encontrado' });
    }
    
    console.log('✅ Héroe actualizado:', hero);
    res.json(hero);
  } catch (error) {
    console.error('❌ Error al actualizar héroe:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un héroe
const deleteHero = async (req, res) => {
  try {
    console.log('📋 DELETE /heroes - Usuario:', req.user);
    const { heroId } = req.params;
    
    const hero = await Hero.findOneAndDelete({ heroId });
    
    if (!hero) {
      return res.status(404).json({ error: 'Héroe no encontrado' });
    }
    
    console.log('✅ Héroe eliminado:', hero);
    res.json({ message: 'Héroe eliminado correctamente', deletedHero: hero });
  } catch (error) {
    console.error('❌ Error al eliminar héroe:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export {
  getHeroes,
  createHero,
  updateHero,
  deleteHero
};