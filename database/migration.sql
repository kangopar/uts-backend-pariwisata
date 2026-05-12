-- ============================================================
-- UTS Backend - Aplikasi Pariwisata
-- Database: uts_backend_dev
-- ============================================================

-- Tabel kategori
CREATE TABLE IF NOT EXISTS kategori (
  id         INT          NOT NULL AUTO_INCREMENT,
  nama       VARCHAR(100) NOT NULL,
  deskripsi  TEXT,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel wisata
CREATE TABLE IF NOT EXISTS wisata (
  id           INT            NOT NULL AUTO_INCREMENT,
  nama         VARCHAR(200)   NOT NULL,
  deskripsi    TEXT,
  lokasi       VARCHAR(255),
  harga_tiket  DECIMAL(12, 2) NOT NULL DEFAULT 0,
  id_kategori  INT,
  gambar       VARCHAR(255),
  created_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_wisata_kategori FOREIGN KEY (id_kategori) REFERENCES kategori (id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel ulasan
CREATE TABLE IF NOT EXISTS ulasan (
  id               INT          NOT NULL AUTO_INCREMENT,
  id_wisata        INT          NOT NULL,
  nama_pengunjung  VARCHAR(100) NOT NULL,
  rating           TINYINT      NOT NULL DEFAULT 5,
  komentar         TEXT,
  tanggal_kunjungan DATE,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_ulasan_wisata FOREIGN KEY (id_wisata) REFERENCES wisata (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Data Sample
-- ============================================================

INSERT INTO kategori (nama, deskripsi) VALUES
  ('Alam',    'Destinasi wisata alam terbuka seperti gunung, pantai, dan hutan'),
  ('Budaya',  'Destinasi wisata berbasis budaya, seni, dan sejarah'),
  ('Kuliner', 'Wisata kuliner dan destinasi makanan khas daerah');

INSERT INTO wisata (nama, deskripsi, lokasi, harga_tiket, id_kategori, gambar) VALUES
  ('Pantai Kuta',       'Pantai populer dengan sunset yang indah',               'Kuta, Bali',             20000, 1, 'pantai_kuta.jpg'),
  ('Candi Borobudur',   'Candi Buddha terbesar di dunia, warisan UNESCO',        'Magelang, Jawa Tengah',  50000, 2, 'borobudur.jpg'),
  ('Kawah Ijen',        'Kawah belerang dengan fenomena api biru yang menakjubkan', 'Banyuwangi, Jawa Timur', 30000, 1, 'kawah_ijen.jpg'),
  ('Keraton Yogyakarta','Istana Sultan Yogyakarta dengan koleksi budaya Jawa',   'Yogyakarta',             15000, 2, 'keraton.jpg'),
  ('Pasar Beringharjo', 'Pusat kuliner dan oleh-oleh khas Yogyakarta',           'Yogyakarta',                 0, 3, 'beringharjo.jpg');

INSERT INTO ulasan (id_wisata, nama_pengunjung, rating, komentar, tanggal_kunjungan) VALUES
  (1, 'Andi Saputra',   5, 'Pantainya sangat indah, sunset-nya luar biasa!',         '2026-01-10'),
  (1, 'Rina Lestari',   4, 'Ramai tapi tetap seru, wajib dikunjungi.',               '2026-02-14'),
  (2, 'Budi Santoso',   5, 'Sangat megah dan bersejarah, recommended banget!',       '2026-01-25'),
  (3, 'Dewi Rahayu',    5, 'Pengalaman melihat api biru sangat tak terlupakan.',     '2026-03-05'),
  (4, 'Rizki Pratama',  4, 'Tempatnya terawat, pemandu wisatanya ramah.',            '2026-04-11'),
  (5, 'Siti Nurhaliza', 5, 'Surga kuliner! Banyak pilihan makanan enak dan murah.', '2026-04-20');
