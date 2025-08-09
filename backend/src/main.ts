import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import morgan from 'morgan'
import superAdminRouter from './interfaces/routes/superAdminRoutes';
import companyRouter from './interfaces/routes/companyRoutes';
dotenv.config()

const app = express();



app.use(express.json());
app.use(morgan('dev'));

connectDB();

app.use('/super-admin',superAdminRouter)
app.use('/company',companyRouter)

const PORT = process.env.PORT || 7000;
app.listen(PORT,()=>{
     console.log(`Server running on http://localhost:${PORT}`);
})

 






