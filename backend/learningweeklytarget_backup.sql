-- MySQL dump 10.13  Distrib 9.3.0, for macos15.4 (arm64)
--
-- Host: localhost    Database: learningweeklytarget
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'b1211004-466d-11f0-b8c8-7c74d0b92cb2:1-237';

--
-- Table structure for table `learning_logs`
--

DROP TABLE IF EXISTS `learning_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel learning logs - log belajar harian (Anggota 2)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `learning_logs`
--

LOCK TABLES `learning_logs` WRITE;
/*!40000 ALTER TABLE `learning_logs` DISABLE KEYS */;
INSERT INTO `learning_logs` VALUES (4,'2','2025-12-10','selesai','2025-12-10 13:59:12',NULL);
/*!40000 ALTER TABLE `learning_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_tokens`
--

DROP TABLE IF EXISTS `notification_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel notification tokens untuk push notification (Anggota 3)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_tokens`
--

LOCK TABLES `notification_tokens` WRITE;
/*!40000 ALTER TABLE `notification_tokens` DISABLE KEYS */;
INSERT INTO `notification_tokens` VALUES (1,'ibnu','5f4e8bf4-2040-43cd-9d09-14c23f1388aa',1,'2025-11-19 05:29:15','2025-11-19 14:36:00'),(2,'testuser','test-token-12345-67890',1,'2025-11-19 12:51:30','2025-11-19 12:51:30');
/*!40000 ALTER TABLE `notification_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pomodoro_sessions`
--

DROP TABLE IF EXISTS `pomodoro_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pomodoro_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'work',
  `completed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_completed_at` (`completed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pomodoro_sessions`
--

LOCK TABLES `pomodoro_sessions` WRITE;
/*!40000 ALTER TABLE `pomodoro_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `pomodoro_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('jfN7ONihrTJuYwPe8jYEyCRNd5AtM63p',1765465159,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-12-11T13:22:05.041Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":2}'),('rGPyNOAlQ5H_o3rtSQICe0X7nRlpQ0cX',1765462333,'{\"cookie\":{\"originalMaxAge\":86400000,\"expires\":\"2025-12-11T13:37:08.360Z\",\"secure\":false,\"httpOnly\":true,\"path\":\"/\"},\"userId\":2}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tasks`
--

DROP TABLE IF EXISTS `user_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel tasks untuk tugas per user';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tasks`
--

LOCK TABLES `user_tasks` WRITE;
/*!40000 ALTER TABLE `user_tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel users untuk authentication (Anggota 4)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'ibnu','ibnu@gmail.com','$2b$10$xrs/9h6wLlP.xPH4A36KRuYgO9.N4tj/iN85epvemE2Qz1/t05ECy','2025-11-19 04:24:00'),(2,'christopher083','christopher078@gmail.com','$2b$10$u6Bn9EWX.rQP7cKC.HF67uC5FtvdAtSzYT1K9niXMEykX21wvjeea','2025-12-10 13:22:05');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_targets`
--

DROP TABLE IF EXISTS `weekly_targets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_targets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `days` json NOT NULL COMMENT 'Array hari belajar: ["Senin", "Rabu", "Jumat"]',
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabel weekly targets - jadwal belajar mingguan (Anggota 1)';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_targets`
--

LOCK TABLES `weekly_targets` WRITE;
/*!40000 ALTER TABLE `weekly_targets` DISABLE KEYS */;
INSERT INTO `weekly_targets` VALUES (1,'U123','[\"Kamis\", \"Sabtu\", \"Minggu\"]','Target belajar minggu ini','2025-11-19 03:39:57','2025-11-19 03:39:57'),(3,'1','[\"Monday\", \"Wednesday\", \"Friday\"]',NULL,'2025-11-19 04:24:28','2025-11-19 04:24:28'),(6,'ibnu','[\"Senin\", \"Rabu\", \"Jumat\"]','Target belajar minggu ini','2025-11-19 05:29:15','2025-11-19 05:29:15'),(7,'2','[\"Senin\", \"Selasa\", \"Rabu\", \"Kamis\", \"Jumat\", \"Sabtu\", \"Minggu\"]','asah','2025-12-10 13:22:59','2025-12-10 14:14:22');
/*!40000 ALTER TABLE `weekly_targets` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-11  3:03:34
