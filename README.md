# SmartHousingArea
Aplikasi manajemen penghuni perumahan menggunakan Laravel dan React.

Fitur Utama
* Manajemen data penghuni (CRUD).
* Upload foto KTP.
* Preview data penghuni.

Cara Instalasi
1. Clone repository ini.
2. Jalankan `composer install` di folder backend.
3. Jalankan `npm install` di folder frontend.
4. Jangan lupa jalankan `php artisan storage:link`.


Smart Housing Area 
Sistem Administrasi. Proyek ini adalah aplikasi manajemen perumahan yang dibangun dengan Laravel (Backend) dan React + Vite (Frontend) dengan menggunakan MySQL sebagai database.  

Prasyarat Sistem Sebelum memulai instalasi project 
-------------------------------------------------------
pastikan perangkat Anda sudah terinstall software berikut:  
Git: Download Git   
Composer: Download Composer   
Node.js: Download Node.js   
XAMPP (untuk MySQL & Apache): Download XAMPP   

Langkah Instalasi 
--------------------
1. Clone Repository buka terminal atau Git Bash, lalu jalankan perintah berikut:

git clone https://github.com/ultraviany/SmartHousingArea
cd SmartHousingArea

2. Istalasi Backend (Laravel)Masuk ke folder backend:

cd backend
composer install --ignore-platform-reqs

Konfigurasi Environment (.env):  Salin file .env.example menjadi .env 
Buka file .env dan sesuaikan konfigurasi database berikut:  

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smarthousing
DB_USERNAME=root
DB_PASSWORD=


Generate kunci aplikasi: 
php artisan key:generate


3. Konfigurasi Database & Migrasi
Buka phpMyAdmin dan buat database baru dengan nama smarthousing.
Jalankan migrasi untuk membentuk tabel:

php artisan migrate:fresh

Catatan: Jika terjadi error "index length", atur limit panjang data pada app/Providers/AppServiceProvider.php menjadi 191 karakter.

4. Instalasi Frontend (React + Vite)Buka terminal baru, masuk ke folder frontend:
   
cd frontend
npm install


[ Khusus pengguna macOS: Jika terjadi masalah izin (permission), jalankan perintah sudo xattr -rd com.apple.quarantine ]


-------------------------
Menjalankan Aplikasi
-------------------------

Pastikan Apache dan MySQL di XAMPP sudah dalam status Running.  
Jalankan Backend (di folder /backend): 

php artisan serve

Jalankan Frontend (di folder /frontend): 

npm run dev


--------------
Database (ERD)Berikut adalah struktur tabel utama dalam sistem Smart Housing Area:  
---------------
Users: Data administrator 
Houses: Data nomor rumah dan status hunian 
Residents: Data detail penghuni (KTP, status, dll)
Payments: Pencatatan iuran satpam dan kebersihan
Expenses: Pencatatan pengeluaran kas RT.  

<img width="1280" height="800" alt="Screenshot 2026-05-08 at 17 17 49" src="https://github.com/user-attachments/assets/bee94d84-1a09-483f-b9f1-f7a113685a9e" />



-----------------------------------------
Dokumentasi FiturHalaman 
Login & Register: Akses masuk untuk admin.  

Dashboard: Ringkasan total rumah, saldo kas, dan aktivitas terakhir. 
Manajemen Penghuni: Pengelolaan data warga tetap maupun kontrak.  M
anajemen Pembayaran: Pencatatan iuran bulanan warga.  
Laporan Pengeluaran: Detail penggunaan dana kas RT.  
