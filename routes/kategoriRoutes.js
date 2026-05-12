const express = require('express');
const router = express.Router();
const {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
} = require('../controllers/kategoriController');

// GET    /api/kategori
router.get('/', getAllKategori);

// GET    /api/kategori/:id
router.get('/:id', getKategoriById);

// POST   /api/kategori
router.post('/', createKategori);

// PUT    /api/kategori/:id
router.put('/:id', updateKategori);

// DELETE /api/kategori/:id
router.delete('/:id', deleteKategori);

module.exports = router;
