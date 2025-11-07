import express from 'express';
import { sequelize } from "./config/databaseConnection.js";
import subscriberRoutes from './routes/subscriberRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import infoContactRoutes from './routes/infoContactRoutes.js';
import { router as userRoutes } from './routes/usersRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import './models/User.js';
import './models/Subscription.js';



const app = express()
const port = 3000

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

await sequelize.authenticate();
await sequelize.sync({ alter: true });





// Rutas
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/info-contact', infoContactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subscriptions/webhook',
    express.raw({ type: 'application/json' })
);

app.use('/api/subscriptions', subscriptionRoutes);

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
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});


app.listen(port, () => {
    console.log('Server running OK on port:', port)
})


