import express from 'express';
import heroController from './controllers/heroController.js';
import villainController from './controllers/villainController.js';
import battleController from './controllers/battleController.js';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const swaggerDocument = JSON.parse(fs.readFileSync('./swagger.json', 'utf-8'));

const app = express();

app.use(express.json());
app.use('/api', heroController);
app.use('/api', villainController);
app.use('/api', battleController);

// Documentación interactiva Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    console.log(`Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
});