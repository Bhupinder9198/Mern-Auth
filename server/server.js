import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDb from './config/mongodb.js';
import authRouter from './Routes/authRoutes.js';
import userRouter from './Routes/userRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
connectDb();

const allowedOrigins = ['http://localhost:5173'];  // Ensure there are no spaces before/after the URL
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,  // Allow cookies
}));

// API Endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Use routers
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
