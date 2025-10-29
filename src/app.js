import express from 'express';
import { sequelize } from "./config/databaseConnection.js";


const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})
try {
    await sequelize.sync({ force: false });

} catch (error) {
    console.error('Unable to connect to the database:', error);
}
app.listen(port, () => {
    console.log('Server running OK on port:', port)
})


