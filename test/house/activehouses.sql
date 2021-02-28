-- phpMyAdmin SQL Dump
-- version 4.0.10deb1ubuntu0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 27, 2021 at 09:42 PM
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
-- Table structure for table `activehouses`
--

CREATE TABLE IF NOT EXISTS `activehouses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userid` int(11) DEFAULT NULL,
  `userid_updated` int(11) DEFAULT NULL,
  `modified` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deletetime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `portion` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addressnumber` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `streetid` int(11) DEFAULT NULL,
  `wardid` int(11) DEFAULT NULL,
  `lng` double DEFAULT NULL,
  `lat` double DEFAULT NULL,
  `addressnumber_old` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `streetid_old` int(11) DEFAULT NULL,
  `wardid_old` int(11) DEFAULT NULL,
  `width` double DEFAULT NULL,
  `height` double DEFAULT NULL,
  `acreage` double DEFAULT NULL,
  `landarea` double DEFAULT NULL,
  `floorarea` double DEFAULT NULL,
  `direction` int(11) DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `roadwidth` double DEFAULT NULL,
  `floor` int(11) DEFAULT NULL,
  `basement` int(11) DEFAULT NULL,
  `bedroom` int(11) DEFAULT NULL,
  `living` int(11) DEFAULT NULL,
  `toilet` int(11) DEFAULT NULL,
  `kitchen` int(11) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `pricerent` double DEFAULT NULL,
  `structure` int(11) DEFAULT NULL,
  `advancedetruct` int(11) DEFAULT '0',
  `name` varchar(1024) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8_unicode_ci,
  `status` int(11) DEFAULT NULL,
  `censorship` int(11) DEFAULT '0',
  `juridical` int(11) DEFAULT '0',
  `parentid` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='salestatus_0:none,1:còn bán:10còn cho thuê,11 còn bán và còn cho thuê' AUTO_INCREMENT=143826 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
