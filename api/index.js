import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from '../api/routes/userRoute.js'
import authRoutes from '../api/routes/authRoute.js'
dotenv.config()

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Connected to Mongodb")
})
.catch((err)=>{
    console.log(err)
});

const app = express();
app.use(express.json())

app.listen(4000,() => {
    console.log('Server listening on port 4000');    
});

app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)

app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})