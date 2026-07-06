import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder statically so images don't disappear when ImageKit is not used
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Routes
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
