require('dotenv').config();
const express = require('express');
const app     = express();

app.use(express.json());

// ── Routes ──────────────────────────────────────────────
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));

// ── Health check ────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'OK', message: 'API Node.js corriendo' }));

// ── Global error handler ────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
