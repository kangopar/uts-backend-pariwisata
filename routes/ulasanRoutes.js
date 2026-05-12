const express = require('express');
const router = express.Router();
const {
  getAllUlasan,
  getUlasanById,
  getUlasanByWisata,
  createUlasan,
  updateUlasan,
  deleteUlasan,
} = require('../controllers/ulasanController');

// GET    /api/ulasan
router.get('/', getAllUlasan);

// GET    /api/ulasan/wisata/:id_wisata  — harus sebelum /:id
router.get('/wisata/:id_wisata', getUlasanByWisata);

// GET    /api/ulasan/:id
router.get('/:id', getUlasanById);

// POST   /api/ulasan
router.post('/', createUlasan);

// PUT    /api/ulasan/:id
router.put('/:id', updateUlasan);

// DELETE /api/ulasan/:id
router.delete('/:id', deleteUlasan);

module.exports = router;
