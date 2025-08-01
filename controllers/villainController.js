import Villain from '../models/villainModel.js';

// Obtener todos los villanos
const getVillains = async (req, res) => {
  try {
    console.log('📋 GET /villains - Usuario:', req.user);
    const villains = await Villain.find().sort({ createdAt: -1 });
    res.json(villains);
  } catch (error) {
    console.error('❌ Error al obtener villanos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Crear un nuevo villano
const createVillain = async (req, res) => {
  try {
    console.log('📋 POST /villains - Usuario:', req.user);
    const { name, alias, city, team, image, specialAttackAnimationUrl } = req.body;
    
    // Validar campos requeridos
    if (!name || !alias) {
      return res.status(400).json({ error: 'Nombre y alias son requeridos' });
    }
    
    // Verificar si ya existe un villano con las mismas características
    const existingVillain = await Villain.findByCharacteristics(name, alias, city, team);
    if (existingVillain) {
      return res.status(409).json({ 
        error: 'Ya existe un villano con estas características',
        existingVillain: {
          villainId: existingVillain.villainId,
          name: existingVillain.name,
          alias: existingVillain.alias
        }
      });
    }
    
    // Verificar si existe un villano con el mismo nombre
    const villainWithSameName = await Villain.findOne({ name: name });
    if (villainWithSameName) {
      return res.status(409).json({ 
        error: 'Ya existe un villano con este nombre',
        existingVillain: {
          villainId: villainWithSameName.villainId,
          name: villainWithSameName.name,
          alias: villainWithSameName.alias
        }
      });
    }
    
    const villain = new Villain({
      name,
      alias,
      city: city || '',
      team: team || '',
      image: image || '',
      specialAttackAnimationUrl: specialAttackAnimationUrl || '',
      createdBy: req.user.userId
    });
    
    await villain.save();
    console.log('✅ Villano creado:', villain);
    res.status(201).json(villain);
  } catch (error) {
    console.error('❌ Error al crear villano:', error);
    if (error.code === 11000) {
      res.status(409).json({ error: 'Error de duplicado en la base de datos' });
    } else {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

// Actualizar un villano
const updateVillain = async (req, res) => {
  try {
    console.log('📋 PUT /villains - Usuario:', req.user);
    const { villainId } = req.params;
    const { name, alias, city, team, image, specialAttackAnimationUrl } = req.body;
    
    console.log('📋 VillainId:', villainId);
    
    const villain = await Villain.findOneAndUpdate(
      { villainId },
      { name, alias, city, team, image, specialAttackAnimationUrl },
      { new: true, runValidators: true }
    );
    
    if (!villain) {
      return res.status(404).json({ error: 'Villano no encontrado' });
    }
    
    console.log('✅ Villano actualizado:', villain);
    res.json(villain);
  } catch (error) {
    console.error('❌ Error al actualizar villano:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar un villano
const deleteVillain = async (req, res) => {
  try {
    console.log('📋 DELETE /villains - Usuario:', req.user);
    const { villainId } = req.params;
    
    const villain = await Villain.findOneAndDelete({ villainId });
    
    if (!villain) {
      return res.status(404).json({ error: 'Villano no encontrado' });
    }
    
    console.log('✅ Villano eliminado:', villain);
    res.json({ message: 'Villano eliminado correctamente', deletedVillain: villain });
  } catch (error) {
    console.error('❌ Error al eliminar villano:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export {
  getVillains,
  createVillain,
  updateVillain,
  deleteVillain
}; 