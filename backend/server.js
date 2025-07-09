import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import urlRoutes from './routes/urlRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();


// app.use(cors({
//   origin: process.env.NODE_ENV === 'production' 
//     ? ['https://yourfrontend.com'] 
//     : ['http://localhost:3000', 'http://localhost:5173'], // Common dev ports
//   credentials: true, // If you need to send cookies
//   optionsSuccessStatus: 200
// }));
app.use(cors());
// whats happening now ??
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   credentials: false
// }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', urlRoutes);
app.use('/', urlRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 