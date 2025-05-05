import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import sequelize from './db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/AuthRoutes.js';
import examRoutes from './routes/ExamRoutes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}) 

async function testConnection() {
    try {
        const res = await sequelize.query('SELECT NOW()');
        console.log('Connect to DB successfully!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

testConnection();