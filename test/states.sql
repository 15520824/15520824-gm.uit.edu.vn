-- phpMyAdmin SQL Dump
-- version 4.0.10deb1ubuntu0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 30, 2020 at 06:59 AM
-- Server version: 5.5.62-0ubuntu0.14.04.1
-- PHP Version: 5.5.9-1ubuntu4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `real`
--

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE IF NOT EXISTS `states` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `nationid` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT AUTO_INCREMENT=106 ;

--
-- Dumping data for table `states`
--

INSERT INTO `states` (`id`, `name`, `nationid`) VALUES
(1, 'Hà Tĩnh', 1),
(2, 'Nghệ An', 1),
(3, 'Quảng Bình', 1),
(4, 'Quảng Trị', 1),
(5, 'Thanh Hoá', 1),
(6, 'Thừa Thiên Huế', 1),
(7, 'Bắc Giang', 1),
(8, 'Bắc Kạn', 1),
(9, 'Cao Bằng', 1),
(10, 'Hà Giang', 1),
(11, 'Lạng Sơn', 1),
(12, 'Lào Cai', 1),
(13, 'Phú Thọ', 1),
(14, 'Quảng Ninh', 1),
(15, 'Thái Nguyên', 1),
(16, 'Tuyên Quang', 1),
(17, 'Yên Bái', 1),
(18, 'An Giang', 1),
(19, 'Bạc Liêu', 1),
(20, 'Bến Tre', 1),
(21, 'Cà Mau', 1),
(22, 'Cần Thơ', 1),
(23, 'Đồng Tháp', 1),
(24, 'Hậu Giang', 1),
(25, 'Kiên Giang', 1),
(26, 'Long An', 1),
(27, 'Sóc Trăng', 1),
(28, 'Tiền Giang', 1),
(29, 'Trà Vinh', 1),
(30, 'Vĩnh Long', 1),
(31, 'Bắc Ninh', 1),
(32, 'Hải Dương', 1),
(33, 'Hải Phòng', 1),
(34, 'Hà Nam', 1),
(35, 'Hà Nội', 1),
(36, 'Hưng Yên', 1),
(37, 'Nam Định', 1),
(38, 'Ninh Bình', 1),
(39, 'Thái Bình', 1),
(40, 'Vĩnh Phúc', 1),
(41, 'Bà Rịa - Vũng Tàu', 1),
(42, 'Bình Dương', 1),
(43, 'Bình Phước', 1),
(44, 'Bình Thuận', 1),
(45, 'Đồng Nai', 1),
(46, 'Hồ Chí Minh', 1),
(47, 'Ninh Thuận', 1),
(48, 'Tây Ninh', 1),
(49, 'Bình Định', 1),
(50, 'Đà Nẵng', 1),
(51, 'Khánh Hoà', 1),
(52, 'Phú Yên', 1),
(53, 'Quảng Nam', 1),
(54, 'Quảng Ngãi', 1),
(55, 'Điện Biên', 1),
(56, 'Hoà Bình', 1),
(57, 'Lai Châu', 1),
(58, 'Sơn La', 1),
(59, 'Đắk Lăk', 1),
(60, 'Đắk Nông', 1),
(61, 'Gia Lai', 1),
(62, 'Kon Tum', 1),
(63, 'Lâm Đồng', 1);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
