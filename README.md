# MKHAEL — Digital Portfolio

Portofolio statis responsif dengan HTML, CSS, dan JavaScript murni. Tidak membutuhkan framework, proses build, API key, atau backend.

## Fitur
- Desain responsif untuk desktop, tablet, dan ponsel
- Mode terang/gelap (preferensi disimpan jika browser mengizinkan)
- Objek kubus 3D CSS yang dapat diputar dengan klik atau drag
- Galeri proyek dengan filter kategori dan modal detail
- Terminal simulasi lokal dengan perintah `help`, `about`, `projects`, `skills`, `date`, `contact`, `clear`, `theme`, dan `whoami`
- Suara ambient sintetis opsional melalui Web Audio (baru berjalan setelah pengguna menekan tombol)
- Navigasi mobile, animasi reveal, dukungan keyboard, dan preferensi reduced motion

## Struktur
```text
mkhael-portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── .gitkeep
    ├── ketua-polisi-taruna-pdh.jpeg
    ├── komandan-batalyon-pedang-pora-poltar.jpg
    ├── paskibra-hut-ri-80-formasi-17.jpeg
    ├── paskibra-kecamatan-pengerek.jpeg
    ├── paskibra-koramil-pengerek.jpeg
    └── polisi-taruna-bersama.jpeg
```

## Jalankan secara lokal
Cara termudah: buka `index.html` di browser. Untuk pengalaman yang lebih konsisten, jalankan server lokal dari folder ini:
```bash
python -m http.server 8000
```
Lalu buka `http://localhost:8000`.

## Deploy ke GitHub + Vercel
1. Buat repository baru di GitHub, misalnya `mkhael-portfolio`.
2. Unggah seluruh isi folder `mkhael-portfolio` ke root repository, termasuk folder `assets/` beserta semua file fotonya. Jangan hanya mengunggah file HTML, CSS, dan JavaScript.
3. Masuk ke Vercel dan pilih **Add New → Project**.
4. Import repository `mkhael-portfolio` dari GitHub.
5. Karena ini situs statis tanpa build step, biarkan Framework Preset sebagai **Other**. Build Command dikosongkan; Output Directory dapat dikosongkan/default.
6. Klik **Deploy**. Setelah selesai, Vercel memberikan URL publik.
7. Untuk update, edit file di GitHub dan commit; Vercel biasanya akan membangun ulang otomatis.

## Sesuaikan sebelum publikasi
Cari dan ubah di `index.html`:
- `hello@mkhael.dev` menjadi email aktif milikmu.
- Deskripsi profil agar sesuai fakta.
- Nama proyek, status, tautan demo, dan repositori agar hanya menampilkan karya yang benar-benar kamu miliki.
- Daftar skill agar sesuai pengalamanmu.

Detail proyek pada modal didefinisikan di objek `projectDetails` dalam `script.js`; filter kartu memakai `data-category` di `index.html`.

## Catatan
- Terminal adalah simulasi untuk interaksi visual; perintah tidak dieksekusi pada komputer pengunjung atau server.
- Musik menggunakan nada ambient sintetis yang dibuat di browser, bukan file musik eksternal. Browser memerlukan interaksi pengguna sebelum memutar audio.
- Font Google Fonts memerlukan koneksi internet; bila tidak tersedia, situs memakai font sistem.
- Form kontak belum ditambahkan karena email, layanan formulir, atau endpoint belum diberikan. Tombol kontak menggunakan `mailto:`.

## Galeri perjalanan
Lima foto yang diberikan telah dimasukkan ke bagian **Perjalanan & Pengabdian**. Foto dapat dibuka dalam lightbox dengan klik/tap. Pastikan semua file di folder `assets/` ikut diunggah ke repository agar foto tampil di Vercel.

- `assets/komandan-batalyon-pedang-pora-poltar.jpg` — Komandan Batalyon Pedang Pora Polisi Taruna.

Git tidak menyimpan folder kosong. File `.gitkeep` di `assets/` menjaga folder tetap muncul di repository jika semua foto dihapus sementara.
