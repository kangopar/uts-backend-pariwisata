# UTS Backend — REST API Aplikasi Pariwisata

Backend REST API untuk aplikasi pariwisata menggunakan **Express JS** dan **MySQL**.

---

## Teknologi

| Teknologi | Versi |
|-----------|-------|
| Node.js   | ≥ 18  |
| Express   | ^4.19 |
| mysql2    | ^3.9  |
| dotenv    | ^16.4 |

---

## Struktur Folder

```
uts-backend/
├── app.js                    # Entry point server
├── .env                      # Konfigurasi environment (tidak di-commit)
├── .env.example              # Template konfigurasi
├── package.json
├── config/
│   └── db.js                 # Koneksi database MySQL
├── controllers/
│   ├── kategoriController.js
│   ├── wisataController.js
│   └── ulasanController.js
├── routes/
│   ├── kategoriRoutes.js
│   ├── wisataRoutes.js
│   └── ulasanRoutes.js
├── database/
│   └── migration.sql         # Script pembuatan tabel + data sample
└── postman/
    ├── UTS_Pariwisata.postman_collection.json
    └── UTS_Pariwisata.postman_environment.json
```

---

## Struktur Database

### Tabel `kategori`
| Kolom       | Tipe         | Keterangan           |
|-------------|--------------|----------------------|
| id          | INT PK AI    | Primary key          |
| nama        | VARCHAR(100) | Nama kategori        |
| deskripsi   | TEXT         | Deskripsi kategori   |
| created_at  | TIMESTAMP    | Waktu dibuat         |
| updated_at  | TIMESTAMP    | Waktu diperbarui     |

### Tabel `wisata`
| Kolom       | Tipe          | Keterangan                      |
|-------------|---------------|---------------------------------|
| id          | INT PK AI     | Primary key                     |
| nama        | VARCHAR(200)  | Nama wisata                     |
| deskripsi   | TEXT          | Deskripsi wisata                |
| lokasi      | VARCHAR(255)  | Lokasi wisata                   |
| harga_tiket | DECIMAL(12,2) | Harga tiket masuk               |
| id_kategori | INT FK        | Relasi ke tabel `kategori`      |
| gambar      | VARCHAR(255)  | Nama file gambar                |
| created_at  | TIMESTAMP     | Waktu dibuat                    |
| updated_at  | TIMESTAMP     | Waktu diperbarui                |

### Tabel `ulasan`
| Kolom             | Tipe         | Keterangan                  |
|-------------------|--------------|-----------------------------|
| id                | INT PK AI    | Primary key                 |
| id_wisata         | INT FK       | Relasi ke tabel `wisata`    |
| nama_pengunjung   | VARCHAR(100) | Nama pemberi ulasan         |
| rating            | TINYINT      | Rating 1–5                  |
| komentar          | TEXT         | Komentar ulasan             |
| tanggal_kunjungan | DATE         | Tanggal kunjungan           |
| created_at        | TIMESTAMP    | Waktu dibuat                |
| updated_at        | TIMESTAMP    | Waktu diperbarui            |

**Relasi:** `wisata.id_kategori → kategori.id` dan `ulasan.id_wisata → wisata.id`

---

## Cara Menjalankan

### 1. Import Database

Buka phpMyAdmin (Laragon) atau MySQL client, lalu jalankan file:
```
database/migration.sql
```

### 2. Konfigurasi Environment

Salin `.env.example` menjadi `.env` dan sesuaikan:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=uts_backend_dev
PORT=3000
```

### 3. Install Dependensi

```bash
npm install
```

### 4. Jalankan Server

```bash
# Mode produksi
npm start

# Mode development (auto-restart)
npm run dev
```

Server berjalan di **http://localhost:3000**

---

## Dokumentasi API Endpoint

### Base URL: `http://localhost:3000/api`

---

### Kategori

| Method | Endpoint          | Deskripsi                     |
|--------|-------------------|-------------------------------|
| GET    | /kategori         | Ambil semua kategori          |
| GET    | /kategori/:id     | Ambil kategori berdasarkan id |
| POST   | /kategori         | Tambah kategori baru          |
| PUT    | /kategori/:id     | Update kategori               |
| DELETE | /kategori/:id     | Hapus kategori                |

**POST / PUT Body (JSON):**
```json
{
  "nama": "Alam",
  "deskripsi": "Wisata alam terbuka"
}
```

---

### Wisata

| Method | Endpoint      | Deskripsi                      |
|--------|---------------|--------------------------------|
| GET    | /wisata       | Ambil semua wisata (+kategori) |
| GET    | /wisata/:id   | Detail wisata + ulasan         |
| POST   | /wisata       | Tambah wisata baru             |
| PUT    | /wisata/:id   | Update wisata                  |
| DELETE | /wisata/:id   | Hapus wisata                   |

**POST / PUT Body (JSON):**
```json
{
  "nama": "Pantai Kuta",
  "deskripsi": "Pantai dengan sunset indah",
  "lokasi": "Kuta, Bali",
  "harga_tiket": 20000,
  "id_kategori": 1,
  "gambar": "pantai_kuta.jpg"
}
```

---

### Ulasan

| Method | Endpoint                  | Deskripsi                          |
|--------|---------------------------|------------------------------------|
| GET    | /ulasan                   | Ambil semua ulasan (+nama wisata)  |
| GET    | /ulasan/:id               | Detail ulasan berdasarkan id       |
| GET    | /ulasan/wisata/:id_wisata | Ulasan berdasarkan wisata tertentu |
| POST   | /ulasan                   | Tambah ulasan baru                 |
| PUT    | /ulasan/:id               | Update ulasan                      |
| DELETE | /ulasan/:id               | Hapus ulasan                       |

**POST Body (JSON):**
```json
{
  "id_wisata": 1,
  "nama_pengunjung": "Andi",
  "rating": 5,
  "komentar": "Tempat yang sangat indah!",
  "tanggal_kunjungan": "2026-05-10"
}
```

---

## Contoh Response

**GET /api/wisata — 200 OK**
```json
{
  "success": true,
  "message": "Data wisata berhasil diambil",
  "total": 5,
  "data": [
    {
      "id": 1,
      "nama": "Pantai Kuta",
      "deskripsi": "Pantai populer dengan sunset yang indah",
      "lokasi": "Kuta, Bali",
      "harga_tiket": "20000.00",
      "gambar": "pantai_kuta.jpg",
      "created_at": "...",
      "updated_at": "...",
      "kategori_id": 1,
      "kategori_nama": "Alam"
    }
  ]
}
```

**Error 404**
```json
{
  "success": false,
  "message": "Wisata tidak ditemukan"
}
```

---

## Testing dengan Postman

File Postman tersedia di folder `postman/`:

| File | Keterangan |
|------|------------|
| `UTS_Pariwisata.postman_collection.json` | Koleksi 16 request (CRUD semua resource) |
| `UTS_Pariwisata.postman_environment.json` | Environment variable (base_url, id dinamis) |

### Cara Import

1. Buka **Postman** → klik tombol **Import** (pojok kiri atas)
2. Import file environment terlebih dahulu:
   - Pilih file `postman/UTS_Pariwisata.postman_environment.json`
3. Import file collection:
   - Pilih file `postman/UTS_Pariwisata.postman_collection.json`
4. Pilih environment **"UTS Pariwisata - Local"** di dropdown pojok kanan atas Postman
5. Pastikan server sudah berjalan (`npm run dev`), lalu kirim request

### Environment Variables

| Variable | Default Value | Keterangan |
|----------|---------------|------------|
| `base_url` | `http://localhost:3000` | Base URL server |
| `kategori_id` | `1` | ID kategori aktif (auto-update setelah POST) |
| `wisata_id` | `1` | ID wisata aktif (auto-update setelah POST) |
| `ulasan_id` | `1` | ID ulasan aktif (auto-update setelah POST) |

### Daftar Request dalam Collection

#### 📁 Root
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Cek server & lihat daftar endpoint |

#### 📁 Kategori
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/kategori` | Ambil semua kategori |
| GET | `/api/kategori/{{kategori_id}}` | Ambil kategori by ID |
| POST | `/api/kategori` | Tambah kategori baru |
| PUT | `/api/kategori/{{kategori_id}}` | Update kategori |
| DELETE | `/api/kategori/{{kategori_id}}` | Hapus kategori |

#### 📁 Wisata
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/wisata` | Ambil semua wisata (join kategori) |
| GET | `/api/wisata/{{wisata_id}}` | Detail wisata + ulasan |
| POST | `/api/wisata` | Tambah wisata baru |
| PUT | `/api/wisata/{{wisata_id}}` | Update wisata |
| DELETE | `/api/wisata/{{wisata_id}}` | Hapus wisata |

#### 📁 Ulasan
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/ulasan` | Ambil semua ulasan (join wisata) |
| GET | `/api/ulasan/{{ulasan_id}}` | Detail ulasan by ID |
| GET | `/api/ulasan/wisata/{{wisata_id}}` | Filter ulasan by wisata |
| POST | `/api/ulasan` | Tambah ulasan baru |
| PUT | `/api/ulasan/{{ulasan_id}}` | Update ulasan |
| DELETE | `/api/ulasan/{{ulasan_id}}` | Hapus ulasan |

> **Tip:** Setiap request **POST** memiliki test script yang otomatis menyimpan ID hasil insert ke variable environment, sehingga request GET/PUT/DELETE selanjutnya langsung menggunakan ID tersebut tanpa perlu mengubah manual.
