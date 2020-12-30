-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 30, 2020 at 03:16 PM
-- Server version: 10.3.26-MariaDB
-- PHP Version: 7.3.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: nhpizuvo__lands
--

--
-- Dumping data for table district
--

INSERT INTO district (district_id, `name`, `type`, location, province_id) VALUES
('760', '1', 'Quận', '10 46 34N, 106 41 45E', '79'),
('761', '12', 'Quận', '10 51 43N, 106 39 32E', '79'),
('762', 'Thủ Đức', 'Quận', '10 51 20N, 106 45 05E', '79'),
('763', '9', 'Quận', '10 49 49N, 106 49 03E', '79'),
('764', 'Gò Vấp', 'Quận', '10 50 12N, 106 39 52E', '79'),
('765', 'Bình Thạnh', 'Quận', '10 48 46N, 106 42 57E', '79'),
('766', 'Tân Bình', 'Quận', '10 48 13N, 106 39 03E', '79'),
('767', 'Tân Phú', 'Quận', '10 47 32N, 106 37 31E', '79'),
('768', 'Phú Nhuận', 'Quận', '10 48 06N, 106 40 39E', '79'),
('769', '2', 'Quận', '10 46 51N, 106 45 25E', '79'),
('770', '3', 'Quận', '10 46 48N, 106 40 46E', '79'),
('771', '10', 'Quận', '10 46 25N, 106 40 02E', '79'),
('772', '11', 'Quận', '10 46 01N, 106 38 44E', '79'),
('773', '4', 'Quận', '10 45 42N, 106 42 09E', '79'),
('774', '5', 'Quận', '10 45 24N, 106 40 00E', '79'),
('775', '6', 'Quận', '10 44 46N, 106 38 10E', '79'),
('776', '8', 'Quận', '10 43 24N, 106 37 40E', '79'),
('777', 'Bình Tân', 'Quận', '10 46 16N, 106 35 26E', '79'),
('778', '7', 'Quận', '10 44 19N, 106 43 35E', '79'),
('783', 'Củ Chi', 'Huyện', '11 02 17N, 106 30 20E', '79'),
('784', 'Hóc Môn', 'Huyện', '10 52 42N, 106 35 33E', '79'),
('785', 'Bình Chánh', 'Huyện', '10 45 01N, 106 30 45E', '79'),
('786', 'Nhà Bè', 'Huyện', '10 39 06N, 106 43 35E', '79'),
('787', 'Cần Giờ', 'Huyện', '10 30 43N, 106 52 50E', '79');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
