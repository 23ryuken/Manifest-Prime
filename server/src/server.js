import express from 'express';

const app = express();

const PORT = process.env.PORT || 4002;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/echo', (req, res) => {
  res.json({ received: req.body });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});