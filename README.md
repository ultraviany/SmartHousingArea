🏠 Smart Housing Area - Sistem Administrasi RT Modern

Project by: Ultra Viany

Email: ultravia914@gmail.com

📌 Daftar Isi

Tentang Project

Persiapan Perangkat (Environment)

Langkah 1: Pengambilan Code

Langkah 2: Instalasi Backend (Laravel)

Langkah 3: Konfigurasi Database & Migrasi

Langkah 4: Instalasi Frontend (React + Vite)

Langkah 5: Menjalankan Aplikasi

Struktur Database (ERD)

Dokumentasi Fitur (Screenshot)

📖 Tentang Project

Smart Housing Area adalah aplikasi berbasis web yang dirancang untuk memodernisasi administrasi di lingkungan perumahan (RT). Aplikasi ini memisahkan antara Backend (menggunakan Laravel) dan Frontend (menggunakan React + Vite) untuk performa yang optimal.

💻 Persiapan Perangkat (Environment)

Pastikan perangkat Anda sudah terinstall software berikut:

Git: Untuk manajemen kode.

PHP (>= 8.1) & Composer: Untuk menjalankan Laravel.

Node.js (LTS) & NPM: Untuk menjalankan React.

MySQL (XAMPP): Sebagai sistem penyimpanan data (DBMS).

📂 Langkah 1: Pengambilan Code

Buka terminal atau Command Prompt (CMD) Anda, lalu jalankan perintah:

git clone [https://github.com/ultraviany/SmartHousingArea](https://github.com/ultraviany/SmartHousingArea)
cd SmartHousingArea


⚙️ Langkah 2: Instalasi Backend (Laravel)

Masuk ke folder backend:

cd backend
composer install --ignore-platform-reqs


Konfigurasi File .env:

Salin file .env.example menjadi .env.

Buka file .env dan pastikan pengaturan database sesuai dengan MySQL Anda:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smarthousing
DB_USERNAME=root
DB_PASSWORD=


Generate kunci aplikasi:

php artisan key:generate


🗄️ Langkah 3: Konfigurasi Database & Migrasi

Buka phpMyAdmin melalui browser (localhost/phpmyadmin).

Buat database baru dengan nama: smarthousing.

Jalankan migrasi tabel secara otomatis melalui terminal:

php artisan migrate:fresh


(Catatan: Jika terjadi error terkait "index length", limit panjang data sudah disesuaikan pada AppServiceProvider).

🎨 Langkah 4: Instalasi Frontend (React + Vite)

Buka terminal baru (tetap di folder project utama), lalu masuk ke folder frontend:

cd frontend
npm install


Catatan Khusus Pengguna macOS:
Jika terjadi masalah izin (permission) pada folder node_modules, jalankan perintah berikut:

sudo xattr -rd com.apple.quarantine .
chmod -R +x node_modules/.bin/


🚀 Langkah 5: Menjalankan Aplikasi

Pastikan MySQL di XAMPP sudah aktif (Running).

Jalankan Server Backend (di terminal backend):

php artisan serve


Server akan berjalan di: http://127.0.0.1:8000

Jalankan Server Frontend (di terminal frontend):

npm run dev


Aplikasi dapat diakses di browser melalui alamat yang muncul (biasanya: http://localhost:5173)

📊 Struktur Database (ERD)

Sistem ini menggunakan struktur database relasional yang mencakup:

Users: Data Admin/Pengelola.

Houses: Data properti (Nomor rumah & status).

Residents: Detail penghuni (KTP, status huni, telepon).

Payments: Pencatatan iuran (Satpam & Kebersihan).

Expenses: Pencatatan pengeluaran kas RT.

(Lihat gambar ERD lengkap pada folder /assets atau file PPT).

📸 Dokumentasi Fitur (Screenshot)

1. Halaman Login & Register

Sistem keamanan untuk masuk ke dashboard admin dan pendaftaran akun pengelola baru.

2. Dashboard Monitoring

Menampilkan ringkasan total rumah, jumlah rumah dihuni vs kosong, serta saldo kas RT secara real-time.

3. Manajemen Penghuni & Rumah

Fitur untuk menambah, melihat, dan mengelola data warga serta status aset rumah perumahan.

4. Transaksi Iuran & Pengeluaran

Pencatatan pembayaran bulanan warga serta transparansi laporan pengeluaran dana kas.

Presentasi Visual Lengkap (Canva): [Link Canva Anda Disini]
