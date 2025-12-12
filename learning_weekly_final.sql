-- MySQL dump - Learning Weekly Target Final
-- StudyFlow Application Database
-- 
-- Host: localhost    Database: learningweeklytarget
-- ------------------------------------------------------
-- Server version: 9.5.0 (or compatible)
-- Dump date: 2025-12-11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;

--
-- Database: `learningweeklytarget`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel users untuk authentication';

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`) VALUES
(1, 'ibnu', 'ibnu@gmail.com', '$2b$10$xrs/9h6wLlP.xPH4A36KRuYgO9.N4tj/iN85epvemE2Qz1/t05ECy', '2025-11-19 04:24:00'),
(2, 'christopher083', 'christopher078@gmail.com', '$2b$10$u6Bn9EWX.rQP7cKC.HF67uC5FtvdAtSzYT1K9niXMEykX21wvjeea', '2025-12-10 13:22:05');
UNLOCK TABLES;

-- --------------------------------------------------------

--
-- Table structure for table `weekly_targets`
--

DROP TABLE IF EXISTS `weekly_targets`;
CREATE TABLE `weekly_targets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `days` json NOT NULL COMMENT 'Array hari belajar: ["Senin", "Rabu", "Jumat"]',
  `start_date` date DEFAULT NULL COMMENT 'Tanggal mulai jadwal',
  `end_date` date DEFAULT NULL COMMENT 'Tanggal akhir jadwal',
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_start_date` (`start_date`),
  KEY `idx_end_date` (`end_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel weekly targets - jadwal belajar mingguan';

--
-- Dumping data for table `weekly_targets`
--

LOCK TABLES `weekly_targets` WRITE;
INSERT INTO `weekly_targets` (`id`, `user_id`, `days`, `start_date`, `end_date`, `note`, `created_at`, `updated_at`) VALUES
(1, 'U123', '[\"Kamis\", \"Sabtu\", \"Minggu\"]', NULL, NULL, 'Target belajar minggu ini', '2025-11-19 03:39:57', '2025-11-19 03:39:57'),
(3, '1', '[\"Monday\", \"Wednesday\", \"Friday\"]', NULL, NULL, NULL, '2025-11-19 04:24:28', '2025-11-19 04:24:28'),
(6, 'ibnu', '[\"Senin\", \"Rabu\", \"Jumat\"]', NULL, NULL, 'Target belajar minggu ini', '2025-11-19 05:29:15', '2025-11-19 05:29:15'),
(7, '2', '[\"Senin\", \"Selasa\", \"Rabu\", \"Kamis\", \"Jumat\", \"Sabtu\", \"Minggu\"]', NULL, NULL, 'asah', '2025-12-10 13:22:59', '2025-12-10 14:14:22');
UNLOCK TABLES;

-- --------------------------------------------------------

--
-- Table structure for table `user_tasks`
--

DROP TABLE IF EXISTS `user_tasks`;
CREATE TABLE `user_tasks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','in_progress','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `priority` enum('low','medium','high') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_due_date` (`due_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel tasks untuk tugas per user';

--
-- Dumping data for table `user_tasks`
--

LOCK TABLES `user_tasks` WRITE;
UNLOCK TABLES;

-- --------------------------------------------------------

--
-- Table structure for table `learning_logs`
--

DROP TABLE IF EXISTS `learning_logs`;
CREATE TABLE `learning_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `log_date` date NOT NULL COMMENT 'Tanggal log belajar',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Catatan belajar hari ini',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `related_task_ids` json DEFAULT NULL COMMENT 'Array task IDs yang terkait dengan log ini',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_log_date` (`log_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel learning logs - log belajar harian';

--
-- Dumping data for table `learning_logs`
--

LOCK TABLES `learning_logs` WRITE;
INSERT INTO `learning_logs` (`id`, `user_id`, `log_date`, `notes`, `created_at`, `related_task_ids`) VALUES
(4, '2', '2025-12-10', 'selesai', '2025-12-10 13:59:12', NULL);
UNLOCK TABLES;

-- --------------------------------------------------------

--
-- Table structure for table `pomodoro_sessions`
--

DROP TABLE IF EXISTS `pomodoro_sessions`;
CREATE TABLE `pomodoro_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'work',
  `completed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_completed_at` (`completed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel pomodoro sessions - sesi pomodoro timer';

--
-- Dumping data for table `pomodoro_sessions`
--

LOCK TABLES `pomodoro_sessions` WRITE;
UNLOCK TABLES;

-- --------------------------------------------------------

--
-- Table structure for table `notification_tokens`
--

DROP TABLE IF EXISTS `notification_tokens`;
CREATE TABLE `notification_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'User ID dari tabel users',
  `device_token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'OneSignal Player ID (UUID format)',
  `is_enabled` tinyint(1) DEFAULT '1' COMMENT '1 = aktif, 0 = nonaktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel notification tokens untuk push notification';

--
-- Dumping data for table `notification_tokens`
--

LOCK TABLES `notification_tokens` WRITE;
INSERT INTO `notification_tokens` (`id`, `user_id`, `device_token`, `is_enabled`, `created_at`, `updated_at`) VALUES
(1, 'ibnu', '5f4e8bf4-2040-43cd-9d09-14c23f1388aa', 1, '2025-11-19 05:29:15', '2025-11-19 14:36:00'),
(2, 'testuser', 'test-token-12345-67890', 1, '2025-11-19 12:51:30', '2025-11-19 12:51:30');
UNLOCK TABLES;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tabel sessions untuk express-session';

--
-- Dumping data for table `sessions`
-- Note: Session data is temporary and may be empty on fresh install

LOCK TABLES `sessions` WRITE;
UNLOCK TABLES;

--
-- AUTO_INCREMENT values
--

ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

ALTER TABLE `weekly_targets`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

ALTER TABLE `user_tasks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

ALTER TABLE `learning_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

ALTER TABLE `pomodoro_sessions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

ALTER TABLE `notification_tokens`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Dump completed
-- Database: learningweeklytarget
-- StudyFlow Application - Final Version

