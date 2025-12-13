# 🎓 StudyFlow - Weekly Learning Target Tracker

**StudyFlow** adalah aplikasi web untuk membantu Anda mengatur dan melacak target belajar mingguan dengan lebih efektif. Aplikasi ini dilengkapi dengan fitur Pomodoro Timer, manajemen tugas, dan sistem notifikasi untuk meningkatkan produktivitas belajar Anda.

![StudyFlow](https://img.shields.io/badge/StudyFlow-v1.0.0-purple)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MySQL](https://img.shields.io/badge/MySQL-5.7+-orange)

## 📋 Daftar Isi

- [Fitur Utama](#-fitur-utama)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Proyek](#-struktur-proyek)
- [Persyaratan](#-persyaratan)
- [Instalasi](#-instalasi)
- [Konfigurasi](#-konfigurasi)
- [Menjalankan Aplikasi](#-menjalankan-aplikasi)
- [Database Setup](#-database-setup)
- [API Endpoints](#-api-endpoints)
- [Fitur Detail](#-fitur-detail)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

## ✨ Fitur Utama

### 🎯 Weekly Targets (Target Mingguan)
- Atur jadwal belajar mingguan dengan memilih hari-hari tertentu
- Set periode jadwal dengan tanggal mulai dan akhir
- Tambahkan catatan untuk setiap jadwal
- Visualisasi progress belajar mingguan

### 📝 Task Management (Manajemen Tugas)
- Buat, edit, dan hapus tugas belajar
- Kategorisasi tugas berdasarkan prioritas (Low, Medium, High)
- Status tracking (Pending, In Progress, Completed)
- Set deadline untuk setiap tugas
- Statistik tugas per status

### 🍅 Pomodoro Timer
- Timer belajar dengan 3 mode:
  - **Belajar**: 25 menit
  - **Istirahat Pendek**: 5 menit
  - **Istirahat Panjang**: 15 menit
- Progress circle dengan animasi
- Tracking sesi harian dan total
- Notifikasi saat timer selesai
- Auto-switch mode setelah sesi selesai

### 📊 Dashboard
- Visualisasi progress belajar mingguan dengan chart
- Ringkasan tugas terbaru
- Statistik pomodoro sesi
- Overview target dan actual progress

### 📚 Learning Logs
- Catat progress belajar harian
- Link tugas yang sudah diselesaikan
- Riwayat belajar yang tersimpan

### 🔔 Push Notifications
- Notifikasi harian berdasarkan jadwal belajar
- Integrasi dengan OneSignal
- Pengingat otomatis setiap hari jam 09:00 WIB
- Notifikasi saat pomodoro timer selesai

## 🛠 Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **bcrypt** - Password hashing
- **express-session** - Session management
- **node-cron** - Task scheduler
- **axios v1.6.2** - HTTP client untuk call OneSignal
- **OneSignal API** - Push notifications
- **moment-timezone** - Timezone handling

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling dengan gradient modern
- **Vanilla JavaScript** - Interaktivitas
- **Chart.js** - Data visualization
- **OneSignal SDK** - Push notifications

### Development Tools
- **VS Code** - Code editor
- **Thunder Client (VS Code) / Postman** – API testing
- **phpMyAdmin** – Manajemen database

## 📁 Struktur Proyek

```
weekly target/
├── backend/
│   ├── controllers/          # Controller untuk setiap fitur
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── learningLogController.js
│   │   ├── notificationController.js
│   │   ├── pomodoroController.js
│   │   ├── taskController.js
│   │   └── weeklyTargetController.js
│   ├── db/
│   │   └── index.js          # Database connection
│   ├── middleware/
│   │   └── authMiddleware.js  # Authentication middleware
│   ├── models/               # Database models
│   │   ├── learningLogModel.js
│   │   ├── notificationModel.js
│   │   ├── pomodoroModel.js
│   │   ├── taskModel.js
│   │   ├── userModel.js
│   │   └── weeklyTargetModel.js
│   ├── routes/               # API routes
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── learningLogRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── pomodoroRoutes.js
│   │   ├── taskRoutes.js
│   │   └── weeklyTargetRoutes.js
│   ├── services/             # Business logic services
│   │   ├── oneSignalService.js
│   │   └── schedulerService.js
│   ├── server.js             # Main server file
│   ├── package.json
│   ├── learningweeklytarget_backup.sql
│   └── migration_add_dates_to_weekly_targets.sql
├── frontend/
│   ├── css/
│   │   └── style.css         # Global styles
│   ├── html/                 # HTML pages
│   │   ├── about.html
│   │   ├── dashboard.html
│   │   ├── index.html
│   │   ├── log_progress.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── schedule.html
│   │   └── tasks.html
│   └── js/                   # JavaScript files
│       ├── config.js
│       ├── dashboard.js
│       ├── landing.js
│       ├── log_progress.js
│       ├── login.js
│       ├── navbar.js
│       ├── pomodoro.js
│       ├── register.js
│       ├── script.js
│       └── tasks.js
├── learningweeklytarget.sql  # Database schema
├── package.json
└── README.md
```

## 📋 Persyaratan

Sebelum menginstal, pastikan Anda telah menginstall:

- **Node.js** (v18 atau lebih tinggi)
- **MySQL** (v5.7 atau lebih tinggi)
- **npm** atau **yarn**
- **Git** (opsional)

## 🚀 Instalasi

1. **Clone repository** (atau download dan extract)
```bash
git clone <repository-url>
cd "weekly target"
```

2. **Install dependencies untuk backend**
```bash
cd backend
npm install
```

3. **Install dependencies untuk root** (jika diperlukan)
```bash
cd ..
npm install
```

## ⚙️ Konfigurasi

1. **Buat file `.env` di folder `backend/`**

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=learningweeklytarget
DB_PORT=3306

# Server Configuration
PORT=5001
SESSION_SECRET=your-secret-key-here

# OneSignal Configuration (Opsional - untuk push notifications)
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_REST_API_KEY=your-onesignal-rest-api-key

# Timezone Configuration
TIMEZONE=Asia/Jakarta
REMINDER_TIME=09:00
```

2. **Buat database MySQL**

```sql
CREATE DATABASE learningweeklytarget;
```

3. **Import database schema**

Pilih salah satu:
- **Option 1**: Import `learningweeklytarget.sql` (untuk fresh install)
- **Option 2**: Import `backend/learningweeklytarget_backup.sql` (untuk restore backup)

4. **Jalankan migration** (jika menggunakan database yang sudah ada)

```sql
-- Jalankan file: backend/migration_add_dates_to_weekly_targets.sql
-- Ini akan menambahkan kolom start_date dan end_date ke tabel weekly_targets
```

## 🏃 Menjalankan Aplikasi

### Development Mode

```bash
cd backend
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5001`

### Production Mode

```bash
cd backend
npm start
```

## 🗄️ Database Setup

### Tabel-tabel dalam Database

1. **users** - Data pengguna
   - `id`, `username`, `email`, `password_hash`, `created_at`

2. **weekly_targets** - Target belajar mingguan
   - `id`, `user_id`, `days` (JSON), `start_date`, `end_date`, `note`, `created_at`, `updated_at`

3. **user_tasks** - Tugas pengguna
   - `id`, `user_id`, `title`, `description`, `status`, `priority`, `due_date`, `created_at`, `updated_at`

4. **learning_logs** - Log belajar harian
   - `id`, `user_id`, `log_date`, `notes`, `created_at`

5. **pomodoros** - Data sesi pomodoro
   - `id`, `user_id`, `mode`, `duration`, `completed_at`

6. **notification_tokens** - Token untuk push notifications
   - `id`, `user_id`, `device_token`, `is_enabled`, `created_at`, `updated_at`

### Migration

Jika Anda menggunakan database yang sudah ada, jalankan migration untuk menambahkan fitur tanggal pada jadwal:

```bash
mysql -u root -p learningweeklytarget < backend/migration_add_dates_to_weekly_targets.sql
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Weekly Targets
- `GET /api/targets?user_id={user_id}` - Get semua target user
- `GET /api/targets/:id` - Get target by ID
- `POST /api/targets` - Create target baru
- `PUT /api/targets/:id` - Update target
- `DELETE /api/targets/:id` - Delete target

### Tasks
- `GET /api/tasks?user_id={user_id}` - Get semua tasks user
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task baru
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats?user_id={user_id}` - Get task statistics

### Learning Logs
- `GET /api/logs?user_id={user_id}` - Get semua logs user
- `POST /api/logs` - Create log baru
- `PUT /api/logs/:id` - Update log
- `DELETE /api/logs/:id` - Delete log

### Pomodoro
- `POST /api/pomodoro/session` - Simpan sesi pomodoro
- `GET /api/pomodoro/stats?user_id={user_id}` - Get pomodoro statistics

### Dashboard
- `GET /api/dashboard?user_id={user_id}` - Get dashboard data

### Notifications
- `POST /api/notifications/register` - Register device token
- `POST /api/notifications/test` - Test notification
- `POST /api/notifications/trigger` - Manual trigger scheduler
- `POST /api/notifications/settings` - Toggle notification on/off 
- `GET /api/notifications/status/:user_id` - Get subscription status
- `POST /api/notifications/welcome` - Send welcome message

## 📖 Fitur Detail

### 1. Weekly Targets dengan Periode Tanggal

Anda dapat mengatur jadwal belajar dengan:
- Memilih hari-hari tertentu (Senin, Selasa, dll)
- Menentukan periode dengan tanggal mulai dan akhir
- Menambahkan catatan untuk setiap jadwal

**Contoh:**
- Hari: Senin, Rabu, Jumat
- Periode: 1 Januari 2025 - 31 Januari 2025
- Catatan: "Fokus pada materi Matematika dan Bahasa Inggris"

### 2. Task Management

Fitur lengkap untuk mengelola tugas:
- **Prioritas**: Low, Medium, High
- **Status**: Pending, In Progress, Completed
- **Deadline**: Set tanggal jatuh tempo
- **Filter**: Filter berdasarkan status atau prioritas
- **Statistik**: Lihat jumlah tugas per status

### 3. Pomodoro Timer

Timer produktivitas dengan:
- **3 Mode**: Belajar (25 menit), Istirahat Pendek (5 menit), Istirahat Panjang (15 menit)
- **Visual Progress**: Circle progress dengan animasi
- **Auto Mode Switch**: Otomatis switch ke istirahat setelah sesi belajar
- **Long Break Logic**: Istirahat panjang setiap 4 sesi
- **Statistics**: Tracking sesi harian dan total

### 4. Dashboard dengan Chart

Visualisasi data yang informatif:
- Progress chart untuk target mingguan
- Ringkasan tugas terbaru
- Statistik pomodoro
- Overview target vs actual

### 5. Push Notifications

Sistem notifikasi yang cerdas:
- **Daily Reminders**: Notifikasi harian berdasarkan jadwal
- **Scheduled**: Otomatis setiap hari jam 09:00 WIB
- **Pomodoro Alerts**: Notifikasi saat timer selesai
- **OneSignal Integration**: Support untuk web push notifications

## 🎨 UI/UX Features

- **Modern Gradient Design**: UI dengan gradient purple-blue yang menarik
- **Responsive Layout**: Dapat diakses dari berbagai device
- **Smooth Animations**: Animasi halus untuk interaksi yang lebih baik
- **Intuitive Navigation**: Navigasi yang mudah dipahami
- **Visual Feedback**: Feedback visual untuk setiap aksi

## 🔒 Security Features

- Password hashing dengan bcrypt
- Session management yang aman
- CORS configuration
- Input validation
- SQL injection protection (prepared statements)

## 📝 Catatan Penting

1. **OneSignal Setup**: Untuk menggunakan push notifications, Anda perlu:
   - Membuat akun OneSignal
   - Membuat aplikasi baru
   - Mendapatkan App ID dan REST API Key
   - Mengisi di file `.env`

2. **Timezone**: Default timezone adalah `Asia/Jakarta`. Ubah di `.env` jika diperlukan.

3. **Database Migration**: Pastikan menjalankan migration jika menggunakan database yang sudah ada.

4. **Port**: Default port adalah 5001. Pastikan port tidak digunakan aplikasi lain.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 Lisensi

Proyek ini dibuat untuk keperluan pembelajaran dan dapat digunakan secara bebas.

## 👥 Tim

Dibuat dengan ❤️ oleh tim StudyFlow

---

**StudyFlow** - Reach Your Target Easily 🎯

