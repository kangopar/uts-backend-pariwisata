const db = require('../config/db');

// GET /api/wisata — Ambil semua wisata (join dengan kategori)
const getAllWisata = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        w.id,
        w.nama,
        w.deskripsi,
        w.lokasi,
        w.harga_tiket,
        w.gambar,
        w.created_at,
        w.updated_at,
        k.id   AS kategori_id,
        k.nama AS kategori_nama
      FROM wisata w
      LEFT JOIN kategori k ON w.id_kategori = k.id
      ORDER BY w.id ASC
    `);
    res.json({
      success: true,
      message: 'Data wisata berhasil diambil',
      total: rows.length,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/wisata/:id — Detail wisata beserta ulasan
const getWisataById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ambil data wisata join kategori
    const [wisataRows] = await db.query(`
      SELECT
        w.id,
        w.nama,
        w.deskripsi,
        w.lokasi,
        w.harga_tiket,
        w.gambar,
        w.created_at,
        w.updated_at,
        k.id   AS kategori_id,
        k.nama AS kategori_nama
      FROM wisata w
      LEFT JOIN kategori k ON w.id_kategori = k.id
      WHERE w.id = ?
    `, [id]);

    if (wisataRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    }

    // Ambil ulasan terkait
    const [ulasanRows] = await db.query(
      'SELECT * FROM ulasan WHERE id_wisata = ? ORDER BY created_at DESC',
      [id]
    );

    const wisata = wisataRows[0];
    wisata.ulasan = ulasanRows;

    res.json({
      success: true,
      message: 'Detail wisata berhasil diambil',
      data: wisata,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/wisata — Tambah wisata baru
const createWisata = async (req, res) => {
  try {
    const { nama, deskripsi, lokasi, harga_tiket, id_kategori, gambar } = req.body;
    if (!nama) {
      return res.status(400).json({ success: false, message: 'Field "nama" wajib diisi' });
    }
    const [result] = await db.query(
      `INSERT INTO wisata (nama, deskripsi, lokasi, harga_tiket, id_kategori, gambar)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nama,
        deskripsi   || null,
        lokasi      || null,
        harga_tiket || 0,
        id_kategori || null,
        gambar      || null,
      ]
    );
    const [newRow] = await db.query(`
      SELECT w.*, k.nama AS kategori_nama
      FROM wisata w
      LEFT JOIN kategori k ON w.id_kategori = k.id
      WHERE w.id = ?
    `, [result.insertId]);
    res.status(201).json({
      success: true,
      message: 'Wisata berhasil ditambahkan',
      data: newRow[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/wisata/:id — Update wisata
const updateWisata = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, deskripsi, lokasi, harga_tiket, id_kategori, gambar } = req.body;
    if (!nama) {
      return res.status(400).json({ success: false, message: 'Field "nama" wajib diisi' });
    }
    const [check] = await db.query('SELECT id FROM wisata WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    }
    await db.query(
      `UPDATE wisata
       SET nama = ?, deskripsi = ?, lokasi = ?, harga_tiket = ?, id_kategori = ?, gambar = ?
       WHERE id = ?`,
      [
        nama,
        deskripsi   || null,
        lokasi      || null,
        harga_tiket || 0,
        id_kategori || null,
        gambar      || null,
        id,
      ]
    );
    const [updated] = await db.query(`
      SELECT w.*, k.nama AS kategori_nama
      FROM wisata w
      LEFT JOIN kategori k ON w.id_kategori = k.id
      WHERE w.id = ?
    `, [id]);
    res.json({
      success: true,
      message: 'Wisata berhasil diperbarui',
      data: updated[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/wisata/:id — Hapus wisata
const deleteWisata = async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await db.query('SELECT id FROM wisata WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    }
    await db.query('DELETE FROM wisata WHERE id = ?', [id]);
    res.json({ success: true, message: 'Wisata berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllWisata,
  getWisataById,
  createWisata,
  updateWisata,
  deleteWisata,
};
