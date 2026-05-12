const express = require('express');
const router = express.Router();
const {
  getAllWisata,
  getWisataById,
  createWisata,
  updateWisata,
  deleteWisata,
} = require('../controllers/wisataController');

// GET    /api/wisata
router.get('/', getAllWisata);

// GET    /api/wisata/:id
router.get('/:id', getWisataById);

// POST   /api/wisata
router.post('/', createWisata);

// PUT    /api/wisata/:id
router.put('/:id', updateWisata);

// DELETE /api/wisata/:id
router.delete('/:id', deleteWisata);

module.exports = router;
