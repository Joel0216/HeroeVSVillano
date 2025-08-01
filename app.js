import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import multer from 'multer';

// Importar conexión a base de datos
import { connectDB } from './db.js';

// Importar controladores
import { getHeroes, createHero, updateHero, deleteHero } from './controllers/heroController.js';
import { getVillains, createVillain, updateVillain, deleteVillain } from './controllers/villainController.js';

// Importar middleware
import { authMiddleware, requireAdmin } from './middleware/auth.js';

// Importar rutas
import authRoutes from './routes/auth.js';
import battleController from './controllers/battleController.js';

// Leer swagger.json
const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

const app = express();
const PORT = process.env.PORT || 3001;

// Conectar a la base de datos
connectDB();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Crear directorios si no existen
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const musicDir = path.join(uploadDir, 'music');
    const imagesDir = path.join(uploadDir, 'images');
    
    [uploadDir, musicDir, imagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
    
    // Determinar el directorio según el tipo de archivo
    if (file.fieldname === 'lobbyMusic' || file.fieldname === 'battleMusic') {
      cb(null, musicDir);
    } else {
      cb(null, imagesDir);
    }
  },
  filename: function (req, file, cb) {
    // Generar nombre único para evitar conflictos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Validar tipos de archivo
    if (file.fieldname === 'lobbyMusic' || file.fieldname === 'battleMusic') {
      // Permitir formatos de audio
      const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/m4a'];
      if (allowedAudioTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de audio (MP3, WAV, OGG, M4A)'), false);
      }
    } else {
      // Permitir formatos de imagen
      const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedImageTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WEBP)'), false);
      }
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de héroes
app.get('/api/heroes', authMiddleware, getHeroes);
app.post('/api/heroes', authMiddleware, requireAdmin, createHero);
app.put('/api/heroes/:heroId', authMiddleware, requireAdmin, updateHero);
app.delete('/api/heroes/:heroId', authMiddleware, requireAdmin, deleteHero);

// Rutas de villanos
app.get('/api/villains', authMiddleware, getVillains);
app.post('/api/villains', authMiddleware, requireAdmin, createVillain);
app.put('/api/villains/:villainId', authMiddleware, requireAdmin, updateVillain);
app.delete('/api/villains/:villainId', authMiddleware, requireAdmin, deleteVillain);

// Rutas de música
app.post('/api/music/lobby', authMiddleware, requireAdmin, upload.single('lobbyMusic'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo de música' });
    }
    
    const musicPath = `/uploads/music/${req.file.filename}`;
    
    // Guardar la configuración en un archivo JSON
    const musicConfigPath = path.join(process.cwd(), 'data', 'music-config.json');
    const musicConfig = {
      lobbyMusic: musicPath,
      lobbyMusicName: req.file.originalname,
      lobbyMusicSize: req.file.size,
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.userId
    };
    
    // Crear directorio si no existe
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(musicConfigPath, JSON.stringify(musicConfig, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Música de lobby guardada exitosamente',
      musicPath: musicPath,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Error al guardar música de lobby:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.post('/api/music/battle', authMiddleware, requireAdmin, upload.single('battleMusic'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo de música' });
    }
    
    const musicPath = `/uploads/music/${req.file.filename}`;
    
    // Guardar la configuración en un archivo JSON
    const musicConfigPath = path.join(process.cwd(), 'data', 'music-config.json');
    let musicConfig = {};
    
    if (fs.existsSync(musicConfigPath)) {
      musicConfig = JSON.parse(fs.readFileSync(musicConfigPath, 'utf-8'));
    }
    
    musicConfig.battleMusic = musicPath;
    musicConfig.battleMusicName = req.file.originalname;
    musicConfig.battleMusicSize = req.file.size;
    musicConfig.updatedAt = new Date().toISOString();
    musicConfig.updatedBy = req.user.userId;
    
    // Crear directorio si no existe
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(musicConfigPath, JSON.stringify(musicConfig, null, 2));
    
    res.json({ 
      success: true, 
      message: 'Música de batalla guardada exitosamente',
      musicPath: musicPath,
      fileName: req.file.originalname
    });
  } catch (error) {
    console.error('Error al guardar música de batalla:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/music/config', (req, res) => {
  try {
    const musicConfigPath = path.join(process.cwd(), 'data', 'music-config.json');
    
    if (fs.existsSync(musicConfigPath)) {
      const musicConfig = JSON.parse(fs.readFileSync(musicConfigPath, 'utf-8'));
      res.json(musicConfig);
    } else {
      res.json({
        lobbyMusic: null,
        battleMusic: null,
        lobbyMusicName: null,
        battleMusicName: null
      });
    }
  } catch (error) {
    console.error('Error al obtener configuración de música:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/music/lobby', authMiddleware, requireAdmin, (req, res) => {
  try {
    const musicConfigPath = path.join(process.cwd(), 'data', 'music-config.json');
    
    if (fs.existsSync(musicConfigPath)) {
      const musicConfig = JSON.parse(fs.readFileSync(musicConfigPath, 'utf-8'));
      
      // Eliminar archivo físico si existe
      if (musicConfig.lobbyMusic) {
        const filePath = path.join(process.cwd(), 'public', musicConfig.lobbyMusic);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      // Actualizar configuración
      delete musicConfig.lobbyMusic;
      delete musicConfig.lobbyMusicName;
      delete musicConfig.lobbyMusicSize;
      musicConfig.updatedAt = new Date().toISOString();
      musicConfig.updatedBy = req.user.userId;
      
      fs.writeFileSync(musicConfigPath, JSON.stringify(musicConfig, null, 2));
    }
    
    res.json({ success: true, message: 'Música de lobby eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar música de lobby:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.delete('/api/music/battle', authMiddleware, requireAdmin, (req, res) => {
  try {
    const musicConfigPath = path.join(process.cwd(), 'data', 'music-config.json');
    
    if (fs.existsSync(musicConfigPath)) {
      const musicConfig = JSON.parse(fs.readFileSync(musicConfigPath, 'utf-8'));
      
      // Eliminar archivo físico si existe
      if (musicConfig.battleMusic) {
        const filePath = path.join(process.cwd(), 'public', musicConfig.battleMusic);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      
      // Actualizar configuración
      delete musicConfig.battleMusic;
      delete musicConfig.battleMusicName;
      delete musicConfig.battleMusicSize;
      musicConfig.updatedAt = new Date().toISOString();
      musicConfig.updatedBy = req.user.userId;
      
      fs.writeFileSync(musicConfigPath, JSON.stringify(musicConfig, null, 2));
    }
    
    res.json({ success: true, message: 'Música de batalla eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar música de batalla:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Rutas de batallas
app.use('/api', battleController);

// Ruta de prueba
app.post('/api/test', (req, res) => {
  res.json({ message: 'Funciona' });
});

// Servir el index.html en la ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Documentación interactiva Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});