import express from 'express';
import cors from 'cors';
import heroController from './controllers/heroController.js';
import villainController from './controllers/villainController.js';
import battleController from './controllers/battleController.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.js';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api', heroController);
app.use('/api', villainController);
app.use('/api', battleController);
app.get('/', (req, res) => {
  res.send('¡API de Héroes vs Villanos funcionando! 🚀');
});
app.post('/api/test', (req, res) => {
  res.json({ message: 'Funciona' });
});

// Documentación interactiva Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Conectar a MongoDB sin bloquear el servidor
connectDB().catch(err => {
  console.log('⚠️  MongoDB no disponible, pero el servidor continuará funcionando');
  console.log('⚠️  Las funcionalidades de autenticación y base de datos no estarán disponibles');
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});