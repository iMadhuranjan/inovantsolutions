import { connectDB } from "./database/dbConnect.js";
import express from 'express';
import productRouter from "./routes/productRoute.js";
const app = express();
import cors from 'cors';

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


async function startServer() {
    try {
        await connectDB();
        app.listen(9000);
        console.log("Server is Running at Port 9000")
    } catch (error) {
        console.error('Failed to connect to DB:', error.message);
    }
}


app.use("/api", productRouter)

startServer();


