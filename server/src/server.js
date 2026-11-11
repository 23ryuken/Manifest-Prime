import 'dotenv/config';
import express from 'express';
import cors from "cors"
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import { ensureUploadDir } from "./services/storage.service.js"


const app = express();

const PORT = process.env.PORT || 4002;

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'}))
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

await connectDB();
await ensureUploadDir();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});