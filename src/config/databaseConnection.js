import Sequelize from "sequelize";
import dotenv from 'dotenv'


dotenv.config()


export const sequelize = new Sequelize(
    process.env.DB_NAME,      // nombre de la base de datos
    process.env.DB_USER,      // usuario
    process.env.DB_PASSWORD,  // contraseña
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        logging: false, // cambiar a console.log para ver las queries SQL
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

