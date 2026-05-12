require('dotenv').config();
const express = require('express');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──────────────────────────────────────────────────
const kategoriRoutes = require('./routes/kategoriRoutes');
const wisataRoutes   = require('./routes/wisataRoutes');
const ulasanRoutes   = require('./routes/ulasanRoutes');

app.use('/api/kategori', kategoriRoutes);
app.use('/api/wisata',   wisataRoutes);
app.use('/api/ulasan',   ulasanRoutes);

// ── Root ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Selamat datang di API Pariwisata 🗺️',
    version: '1.0.0',
    endpoints: {
      kategori: '/api/kategori',
      wisata:   '/api/wisata',
      ulasan:   '/api/ulasan',
    },
  });
});

// ── 404 handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server' });
});

// ── Start server ────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
