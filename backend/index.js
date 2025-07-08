import express from 'express';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({});
import connectDB from './utils/db.js'; // Import the connectDB function from the db.js file
import companyRoutes from './routes/company.routes.js';
import jobRoutes from './routes/job.routes.js'
import applicationRoutes from './routes/application.routes.js'

const app=express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions={
  origin:'https://carrerhunt-frontend.onrender.com',
  credentials:true,
}
app.use(cors(corsOptions));
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/company',companyRoutes); // Use the company routes
app.use('/api/v1/job',jobRoutes)
app.use('/api/v1/application',applicationRoutes);

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
   connectDB(); // Call the connectDB function to establish a connection to the database
    console.log(`Server is running on port ${PORT}`);
}) 
