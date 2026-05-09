Smart Housing Area - Sistem Administrasi Perumahan Modern

Project by: Ultra Viany

Email: ultravia914@gmail.com

Dokumentasi Visual: https://canva.link/un6g44ogjpfmhw9

[1] Daftar Isi
-
Prasyarat Sistem (Link Download)

Langkah 1: Pengambilan Code (Clone)

Langkah 2: Instalasi Backend (Laravel)

Langkah 3: Konfigurasi Database & Migrasi

Langkah 4: Instalasi Frontend (React + Vite)

Langkah 5: Menjalankan Aplikasi

Struktur Database (ERD)

Rangkuman Fitur (Screenshot)

Prasyarat Sistem (Link Download)
-
Sebelum memulai instalasi, pastikan perangkat Anda sudah terinstall aplikasi berikut:

Git: https://git-scm.com/install/windows

Composer: https://getcomposer.org/Composer-Setup.exe

Node.js: https://nodejs.org/en/download

XAMPP: https://www.apachefriends.org/download (Untuk MySQL)

Langkah 1: Pengambilan Code (Clone)
-
Buka terminal atau Command Prompt (CMD), lalu jalankan perintah berikut:

git clone [https://github.com/ultraviany/SmartHousingArea](https://github.com/ultraviany/SmartHousingArea)
cd SmartHousingArea


Langkah 2: Instalasi Backend (Laravel)
-
Pindah ke folder backend untuk menginstall semua library yang dibutuhkan:

cd backend
composer install --ignore-platform-reqs


Pengaturan File .env:

Salin file .env.example dan ubah namanya menjadi .env

Buka file .env dan sesuaikan pengaturan database Anda:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smarthousing
DB_USERNAME=root
DB_PASSWORD=


Generate Key Aplikasi:

php artisan key:generate


Langkah 3: Konfigurasi Database & Migrasi
-
Jalankan XAMPP dan aktifkan modul Apache dan MySQL.

Akses localhost/phpmyadmin di browser Anda.

Buat database baru dengan nama smarthousing.

Kembali ke terminal (masih di folder backend), jalankan perintah migrasi:

php artisan migrate:fresh


Langkah 4: Instalasi Frontend (React + Vite)
-
Buka terminal baru (tetap di folder utama project), lalu masuk ke folder frontend:

cd frontend
npm install


Catatan Khusus macOS:
Jika muncul error perizinan (permission), jalankan perintah berikut:

sudo xattr -rd com.apple.quarantine .
chmod -R +x node_modules/.bin/


Langkah 5: Menjalankan Aplikasi
-
Buka dua terminal berbeda untuk menjalankan backend dan frontend secara bersamaan:

Jalankan Backend (Terminal 1):

php artisan serve


Aplikasi backend berjalan di: http://127.0.0.1:8000

Jalankan Frontend (Terminal 2):

npm run dev


Aplikasi frontend berjalan di: http://localhost:5173

Struktur Database (ERD)
-
Sistem ini dirancang dengan struktur data yang mencakup:

Users: Pengelolaan akun Administrator.

Houses: Data nomor rumah dan status hunian (Dihuni/Kosong).

Residents: Informasi lengkap penghuni termasuk Foto KTP dan Status Huni.

Payments: Pencatatan transaksi iuran warga (Satpam & Kebersihan).

Expenses: Pencatatan pengeluaran operasional kas RT.

[9] Rangkuman Fitur (Screenshot)

Sesuai dengan dokumentasi pada presentasi, aplikasi ini memiliki fitur utama:

Halaman Login & Register: Autentikasi aman untuk admin.

Dashboard Utama: Statistik real-time total rumah, hunian, dan saldo kas.

Manajemen Warga: Pendataan penduduk tetap maupun kontrak.

Manajemen Iuran: Laporan pembayaran warga yang transparan.

Dokumentasi Lengkap: https://canva.link/un6g44ogjpfmhw9
