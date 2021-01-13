-- phpMyAdmin SQL Dump
-- version 5.0.0-alpha1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 13, 2021 at 06:17 PM
-- Server version: 10.2.27-MariaDB
-- PHP Version: 7.2.24

-- SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
-- SET AUTOCOMMIT = 0;
-- START TRANSACTION;
-- SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_pizo`
--

-- --------------------------------------------------------

--
-- Table structure for table `lck_convenience`
--

-- CREATE TABLE `lck_convenience` (
--   `id` int(11) NOT NULL,
--   `name` varchar(255) DEFAULT NULL,
--   `description` varchar(255) DEFAULT NULL,
--   `user_id_created` int(1) DEFAULT NULL,
--   `created_at` datetime DEFAULT NULL,
--   `updated_at` datetime DEFAULT NULL,
--   `deleted_at` datetime(6) DEFAULT NULL
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Danh sach tien nghi trong nha';

--
-- Dumping data for table `lck_convenience`
--

INSERT INTO `equipments` (`id`, `name`, `userid`, `created`, `modified`) VALUES
(1, 'Có Wifi, Internet', NULL, '2018-09-17 09:31:14', '2018-10-23 15:41:11'),
(2, 'Tủ lạnh', NULL, '2018-09-17 09:31:17', '2018-09-17 09:31:17'),
(3, 'Máy giặt', NULL, '2018-09-17 09:31:20', '2018-09-17 09:31:20'),
(4, 'Tivi, radio', NULL, '2018-09-17 09:31:26', '2018-09-17 09:31:26'),
(5, 'Điều hòa', NULL, '2018-09-17 09:31:29', '2018-09-17 09:31:29'),
(6, 'Tủ quần áo', NULL, '2018-09-17 09:31:32', '2018-09-17 09:31:32'),
(7, 'Kệ sách, tủ sách', NULL, '2018-09-17 09:31:41', '2018-09-17 09:31:41'),
(8, 'Có bếp nấu', NULL, '2018-09-17 09:31:46', '2018-09-17 09:31:46'),
(9, 'Ban công', NULL, '2018-09-17 09:31:50', '2018-09-17 09:31:50'),
(11, 'Có thang máy', NULL, '2018-09-17 09:31:53', '2018-09-17 09:31:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lck_convenience`
--
-- ALTER TABLE `lck_convenience`
--   ADD PRIMARY KEY (`id`);

-- --
-- -- AUTO_INCREMENT for dumped tables
-- --

-- --
-- -- AUTO_INCREMENT for table `lck_convenience`
-- --
-- ALTER TABLE `lck_convenience`
--   MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
-- COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

