-- phpMyAdmin SQL Dump
-- version 5.0.0-alpha1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 13, 2021 at 06:22 PM
-- Server version: 10.2.27-MariaDB
-- PHP Version: 7.2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `admin_pizo`
--

-- --------------------------------------------------------

--
-- Table structure for table `purpose`
--

CREATE TABLE `purpose` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Muc dich su dung';

--
-- Dumping data for table `purpose`
--

INSERT INTO `purpose` (`id`, `name`, `description`, `created_at`, `updated_at`) VALUES
(1, 'Để ở', NULL, '2018-09-17 09:31:14', '2018-09-17 09:31:14'),
(2, 'Kinh doanh', NULL, '2018-09-17 09:31:17', '2018-09-17 09:31:17'),
(3, 'Cho thuê', NULL, '2018-09-17 09:31:20', '2018-09-17 09:31:20'),
(4, 'Làm văn phòng', NULL, '2018-09-17 09:31:20', '2018-09-17 09:31:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `purpose`
--
ALTER TABLE `purpose`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `purpose`
--
ALTER TABLE `purpose`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

