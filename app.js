import express from 'express';
import cors from 'cors';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

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