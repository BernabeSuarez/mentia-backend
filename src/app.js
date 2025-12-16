import express from 'express';
import { sequelize } from "./config/databaseConnection.js";
import subscriberRoutes from './routes/subscriberRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import infoContactRoutes from './routes/infoContactRoutes.js';
import { router as userRoutes } from './routes/usersRoutes.js';
import { router as subscriptionRoutes } from './routes/subscriptionRoutes.js';
import hubspotRoutes from './routes/hubspotRoutes.js'
import './models/User.js';
import cors from 'cors';
import { logger } from '../utils/logger.js';
import swaggerUi from "swagger-ui-express"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger-output.json');




const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

await sequelize.authenticate();
await sequelize.sync({ alter: true });





// Rutas
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/info-contact', infoContactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/hubspot', hubspotRoutes);



// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'La API esta funcionando OK.' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});


app.listen(port, () => {
    logger.info('Server running OK on port:', port)
})


