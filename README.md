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
<img width="1280" height="694" alt="Screenshot 2026-05-09 at 12 44 32" src="https://github.com/user-attachments/assets/a7f7ceba-3a18-4130-a5b1-9e9e701ab111" />



Rangkuman Fitur (Screenshot)
-
Sesuai dengan dokumentasi pada presentasi, aplikasi ini memiliki fitur utama:

Halaman Login & Register: Autentikasi ntuk admin.
-
<img width="1280" height="656" alt="Screenshot 2026-05-09 at 12 42 59" src="https://github.com/user-attachments/assets/e53845f7-72da-41b2-a15e-b0d7774d0849" />
<img width="1280" height="656" alt="Screenshot 2026-05-09 at 12 35 02" src="https://github.com/user-attachments/assets/39e7d75d-e40c-4ac7-bfc5-aad489bd4860" />


Dashboard Utama: Data real-time total rumah, hunian, dan saldo kas.
-
<img width="1280" height="648" alt="Screenshot 2026-05-09 at 12 46 43" src="https://github.com/user-attachments/assets/1de0d316-3186-4632-a669-8ca752a4f048" />


Manajemen Warga: Pendataan penduduk tetap maupun kontrak.
-
<img width="1280" height="648" alt="Screenshot 2026-05-09 at 12 47 25" src="https://github.com/user-attachments/assets/b0eae352-c0e3-4af0-879b-ba5085319169" />

Manajemen Rumah: Data rumah dan detail informasi mengenai rumah
-
<img width="1280" height="653" alt="Screenshot 2026-05-09 at 12 48 18" src="https://github.com/user-attachments/assets/4c9985b5-9d9d-42d4-9d7d-3465c4e22186" />

Manajemen Pemasukan Kas: Laporan pembayaran warga secara transparan.
-
<img width="1280" height="647" alt="Screenshot 2026-05-09 at 12 50 10" src="https://github.com/user-attachments/assets/06c6726c-80af-4261-9df2-f719b8cc69d0" />

Manajemen Pengeluaran Kas: Laporan pengeluaran secara transparan.
-
<img width="1280" height="657" alt="Screenshot 2026-05-09 at 12 51 02" src="https://github.com/user-attachments/assets/8969c376-be02-4df3-a0ca-335437bbb817" />

Laporan Keuangan
-
<img width="1280" height="649" alt="Screenshot 2026-05-09 at 12 52 59" src="https://github.com/user-attachments/assets/5faef5dc-84c5-40e0-aa4b-056c6c5c3f2a" />
<img width="1280" height="650" alt="Screenshot 2026-05-09 at 12 53 13" src="https://github.com/user-attachments/assets/3b58f20c-4dc7-4c11-9fa0-72ab5d4ce4de" />




