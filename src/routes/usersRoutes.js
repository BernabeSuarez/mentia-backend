// routes/userRoutes.js
import { Router } from 'express';
import userController from '../controllers/usersController.js';

export const router = Router();

// Ruta de autenticación
router.post('/login', userController.login);

// Rutas CRUD de usuarios (proteger con middleware de autenticación en producción)
router.post('/',  // #swagger.tags = ['Users']
    // #swagger.description = 'Crear un nuevo usuario'
    userController.create);
router.get('/', // #swagger.tags = ['Users']
    // #swagger.description = 'Obtener todos los usuarios'
    userController.getAll);
router.get('/:id', // #swagger.tags = ['Users']
    // #swagger.description = 'Obtener un usuario por su ID'
    userController.getById);
router.get('/email/:email', //#swagger.tags = ['Users']
    // #swagger.description = 'Obtener un usuario por su Email'
    userController.getByEmail);
router.get('/username/:username', //#swagger.tags = ['Users']
    // #swagger.description = 'Obtener un usuario por su Username'
    userController.getByUsername);
router.put('/:id', //#swagger.tags = ['Users']
    // #swagger.description = 'Actualizar un usuario'
    userController.update);
router.delete('/:id', //#swagger.tags = ['Users']
    // #swagger.description = 'Eliminar un usuario'
    userController.delete);

// Rutas de gestión de estado
router.patch('/:id/suspend', //#swagger.tags = ['Users']
    // #swagger.description = 'Suspender la cuenta de un usuario'
    userController.suspend);
router.patch('/:id/activate',//#swagger.tags = ['Users']
    // #swagger.description = 'Reactivar la cuenta de un usuario'
    userController.activate);

