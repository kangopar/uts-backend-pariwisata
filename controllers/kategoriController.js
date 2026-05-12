const db = require('../config/db');

// GET /api/kategori — Ambil semua kategori
const getAllKategori = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM kategori ORDER BY id ASC'
    );
    res.json({
      success: true,
      message: 'Data kategori berhasil diambil',
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/kategori/:id — Ambil kategori berdasarkan id
const getKategoriById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM kategori WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    res.json({
      success: true,
      message: 'Data kategori berhasil diambil',
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/kategori — Tambah kategori baru
const createKategori = async (req, res) => {
  try {
    const { nama, deskripsi } = req.body;
    if (!nama) {
      return res.status(400).json({ success: false, message: 'Field "nama" wajib diisi' });
    }
    const [result] = await db.query(
      'INSERT INTO kategori (nama, deskripsi) VALUES (?, ?)',
      [nama, deskripsi || null]
    );
    const [newRow] = await db.query('SELECT * FROM kategori WHERE id = ?', [result.insertId]);
    res.status(201).json({
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data: newRow[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/kategori/:id — Update kategori
const updateKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi } = req.body;
    if (!nama) {
      return res.status(400).json({ success: false, message: 'Field "nama" wajib diisi' });
    }
    const [check] = await db.query('SELECT id FROM kategori WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    await db.query(
      'UPDATE kategori SET nama = ?, deskripsi = ? WHERE id = ?',
      [nama, deskripsi || null, id]
    );
    const [updated] = await db.query('SELECT * FROM kategori WHERE id = ?', [id]);
    res.json({
      success: true,
      message: 'Kategori berhasil diperbarui',
      data: updated[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/kategori/:id — Hapus kategori
const deleteKategori = async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await db.query('SELECT id FROM kategori WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Kategori tidak ditemukan' });
    }
    await db.query('DELETE FROM kategori WHERE id = ?', [id]);
    res.json({ success: true, message: 'Kategori berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,
};
