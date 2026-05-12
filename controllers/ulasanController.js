const db = require('../config/db');

// GET /api/ulasan — Ambil semua ulasan (join nama wisata)
const getAllUlasan = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.nama_pengunjung,
        u.rating,
        u.komentar,
        u.tanggal_kunjungan,
        u.created_at,
        u.updated_at,
        w.id   AS wisata_id,
        w.nama AS wisata_nama
      FROM ulasan u
      JOIN wisata w ON u.id_wisata = w.id
      ORDER BY u.id ASC
    `);
    res.json({
      success: true,
      message: 'Data ulasan berhasil diambil',
      total: rows.length,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/ulasan/:id — Detail ulasan berdasarkan id
const getUlasanById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.nama_pengunjung,
        u.rating,
        u.komentar,
        u.tanggal_kunjungan,
        u.created_at,
        u.updated_at,
        w.id   AS wisata_id,
        w.nama AS wisata_nama
      FROM ulasan u
      JOIN wisata w ON u.id_wisata = w.id
      WHERE u.id = ?
    `, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan' });
    }
    res.json({
      success: true,
      message: 'Data ulasan berhasil diambil',
      data: rows[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/ulasan/wisata/:id_wisata — Ulasan berdasarkan wisata
const getUlasanByWisata = async (req, res) => {
  try {
    const { id_wisata } = req.params;
    const [wisata] = await db.query('SELECT id, nama FROM wisata WHERE id = ?', [id_wisata]);
    if (wisata.length === 0) {
      return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    }
    const [rows] = await db.query(
      'SELECT * FROM ulasan WHERE id_wisata = ? ORDER BY created_at DESC',
      [id_wisata]
    );
    res.json({
      success: true,
      message: `Ulasan untuk wisata "${wisata[0].nama}"`,
      total: rows.length,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/ulasan — Tambah ulasan baru
const createUlasan = async (req, res) => {
  try {
    const { id_wisata, nama_pengunjung, rating, komentar, tanggal_kunjungan } = req.body;
    if (!id_wisata || !nama_pengunjung) {
      return res.status(400).json({
        success: false,
        message: 'Field "id_wisata" dan "nama_pengunjung" wajib diisi',
      });
    }
    const ratingVal = rating ? parseInt(rating) : 5;
    if (ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ success: false, message: 'Rating harus antara 1 sampai 5' });
    }
    // Pastikan id_wisata ada
    const [wisataCheck] = await db.query('SELECT id FROM wisata WHERE id = ?', [id_wisata]);
    if (wisataCheck.length === 0) {
      return res.status(404).json({ success: false, message: 'Wisata tidak ditemukan' });
    }
    const [result] = await db.query(
      `INSERT INTO ulasan (id_wisata, nama_pengunjung, rating, komentar, tanggal_kunjungan)
       VALUES (?, ?, ?, ?, ?)`,
      [
        id_wisata,
        nama_pengunjung,
        ratingVal,
        komentar           || null,
        tanggal_kunjungan  || null,
      ]
    );
    const [newRow] = await db.query(`
      SELECT u.*, w.nama AS wisata_nama
      FROM ulasan u
      JOIN wisata w ON u.id_wisata = w.id
      WHERE u.id = ?
    `, [result.insertId]);
    res.status(201).json({
      success: true,
      message: 'Ulasan berhasil ditambahkan',
      data: newRow[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/ulasan/:id — Update ulasan
const updateUlasan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_pengunjung, rating, komentar, tanggal_kunjungan } = req.body;
    if (!nama_pengunjung) {
      return res.status(400).json({ success: false, message: 'Field "nama_pengunjung" wajib diisi' });
    }
    const ratingVal = rating ? parseInt(rating) : 5;
    if (ratingVal < 1 || ratingVal > 5) {
      return res.status(400).json({ success: false, message: 'Rating harus antara 1 sampai 5' });
    }
    const [check] = await db.query('SELECT id FROM ulasan WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan' });
    }
    await db.query(
      `UPDATE ulasan
       SET nama_pengunjung = ?, rating = ?, komentar = ?, tanggal_kunjungan = ?
       WHERE id = ?`,
      [
        nama_pengunjung,
        ratingVal,
        komentar          || null,
        tanggal_kunjungan || null,
        id,
      ]
    );
    const [updated] = await db.query(`
      SELECT u.*, w.nama AS wisata_nama
      FROM ulasan u
      JOIN wisata w ON u.id_wisata = w.id
      WHERE u.id = ?
    `, [id]);
    res.json({
      success: true,
      message: 'Ulasan berhasil diperbarui',
      data: updated[0],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/ulasan/:id — Hapus ulasan
const deleteUlasan = async (req, res) => {
  try {
    const { id } = req.params;
    const [check] = await db.query('SELECT id FROM ulasan WHERE id = ?', [id]);
    if (check.length === 0) {
      return res.status(404).json({ success: false, message: 'Ulasan tidak ditemukan' });
    }
    await db.query('DELETE FROM ulasan WHERE id = ?', [id]);
    res.json({ success: true, message: 'Ulasan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllUlasan,
  getUlasanById,
  getUlasanByWisata,
  createUlasan,
  updateUlasan,
  deleteUlasan,
};
