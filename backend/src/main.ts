import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config()

const app = express();
const PORT = process.env.PORT || 7000


app.use(express.json())

connectDB();

app.listen(PORT,()=>{
     console.log(`Server running on http://localhost:${PORT}`);
})