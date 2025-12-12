-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 19 Nov 2025 pada 14.56
-- Versi server: 5.7.24
-- Versi PHP: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `learningweeklytarget`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `learning_logs`
--

CREATE TABLE `learning_logs` (
  `id` int(11) NOT NULL,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `log_date` date NOT NULL COMMENT 'Tanggal log belajar',
  `notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Catatan belajar hari ini',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel learning logs - log belajar harian (Anggota 2)';

-- --------------------------------------------------------

--
-- Struktur dari tabel `notification_tokens`
--

CREATE TABLE `notification_tokens` (
  `id` int(11) NOT NULL,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User ID dari tabel users',
  `device_token` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'OneSignal Player ID (UUID format)',
  `is_enabled` tinyint(1) DEFAULT '1' COMMENT '1 = aktif, 0 = nonaktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel notification tokens untuk push notification (Anggota 3)';

--
-- Dumping data untuk tabel `notification_tokens`
--

INSERT INTO `notification_tokens` (`id`, `user_id`, `device_token`, `is_enabled`, `created_at`, `updated_at`) VALUES
(1, 'ibnu', '5f4e8bf4-2040-43cd-9d09-14c23f1388aa', 1, '2025-11-19 05:29:15', '2025-11-19 14:36:00'),
(2, 'testuser', 'test-token-12345-67890', 1, '2025-11-19 12:51:30', '2025-11-19 12:51:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel users untuk authentication (Anggota 4)';

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`) VALUES
(1, 'ibnu', 'ibnu@gmail.com', '$2b$10$xrs/9h6wLlP.xPH4A36KRuYgO9.N4tj/iN85epvemE2Qz1/t05ECy', '2025-11-19 04:24:00');

-- --------------------------------------------------------

--
-- Struktur dari tabel `weekly_targets`
--

CREATE TABLE `weekly_targets` (
  `id` int(11) NOT NULL,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `days` json NOT NULL COMMENT 'Array hari belajar: ["Senin", "Rabu", "Jumat"]',
  `note` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel weekly targets - jadwal belajar mingguan (Anggota 1)';

--
-- Dumping data untuk tabel `weekly_targets`
--

INSERT INTO `weekly_targets` (`id`, `user_id`, `days`, `note`, `created_at`, `updated_at`) VALUES
(1, 'U123', '[\"Kamis\", \"Sabtu\", \"Minggu\"]', 'Target belajar minggu ini', '2025-11-19 03:39:57', '2025-11-19 03:39:57'),
(3, '1', '[\"Monday\", \"Wednesday\", \"Friday\"]', NULL, '2025-11-19 04:24:28', '2025-11-19 04:24:28'),
(6, 'ibnu', '[\"Senin\", \"Rabu\", \"Jumat\"]', 'Target belajar minggu ini', '2025-11-19 05:29:15', '2025-11-19 05:29:15');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `learning_logs`
--
ALTER TABLE `learning_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_log_date` (`log_date`);

--
-- Indeks untuk tabel `notification_tokens`
--
ALTER TABLE `notification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_enabled` (`is_enabled`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `weekly_targets`
--
ALTER TABLE `weekly_targets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `learning_logs`
--
ALTER TABLE `learning_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `notification_tokens`
--
ALTER TABLE `notification_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `weekly_targets`
--
ALTER TABLE `weekly_targets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
