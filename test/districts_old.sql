-- phpMyAdmin SQL Dump
-- version 4.0.10deb1ubuntu0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 30, 2020 at 10:59 AM
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
-- Table structure for table `districts`
--

CREATE TABLE IF NOT EXISTS `districts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8 NOT NULL,
  `stateid` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=691 ;

--
-- Dumping data for table `districts`
--

INSERT INTO `districts` (`id`, `name`, `stateid`) VALUES
(489, 'Bình Chánh', 46),
(490, 'Bình Thạnh', 46),
(491, 'Cần Giờ', 46),
(492, 'Củ Chi', 46),
(493, 'Gò Vấp', 46),
(494, 'Hóc Môn', 46),
(495, 'Nhà Bè', 46),
(496, 'Phú Nhuận', 46),
(497, 'Quận 1', 46),
(498, 'Quận 10', 46),
(499, 'Quận 11', 46),
(500, 'Quận 12', 46),
(501, 'Quận 2', 46),
(502, 'Quận 3', 46),
(503, 'Quận 4', 46),
(504, 'Quận 5', 46),
(505, 'Quận 6', 46),
(506, 'Quận 7', 46),
(507, 'Quận 8', 46),
(508, 'Quận 9', 46),
(509, 'Tân Bình', 46),
(510, 'Tân Phú', 46),
(511, 'Thủ Đức', 46);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
