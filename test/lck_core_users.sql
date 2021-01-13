-- phpMyAdmin SQL Dump
-- version 5.0.0-alpha1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 13, 2021 at 03:53 PM
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
-- Table structure for table `users`
--

-- CREATE TABLE `users` (
--   `id` int(11) NOT NULL,
--   `fullname` varchar(255) DEFAULT NULL,
--   `email` varchar(191) DEFAULT NULL,
--   `phone` varchar(20) DEFAULT NULL,
--   `password` varchar(191) DEFAULT NULL,
--   `remember_token` varchar(100) DEFAULT NULL,
--   `created_at` datetime DEFAULT NULL,
--   `updated_at` datetime DEFAULT NULL,
--   `status` tinyint(1) NOT NULL DEFAULT 0,
--   `fcm_token` varchar(255) DEFAULT NULL,
--   `device_id` varchar(255) DEFAULT NULL,
--   `device_os` varchar(255) DEFAULT NULL,
--   `recommender` varchar(20) DEFAULT NULL,
--   `gender` tinyint(1) DEFAULT NULL,
--   `birthday` date DEFAULT NULL,
--   `cardid` varchar(20) DEFAULT NULL,
--   `avatar` varchar(255) DEFAULT NULL,
--   `rating` decimal(2,1) UNSIGNED DEFAULT 0.0,
--   `balance` double DEFAULT 0,
--   `point` float(2,1) DEFAULT 0.0,
--   `address` varchar(255) DEFAULT NULL,
--   `facebook_id` varchar(255) DEFAULT NULL,
--   `google_id` varchar(255) DEFAULT NULL,
--   `account_position` int(2) DEFAULT NULL,
--   `account_type` int(2) DEFAULT NULL,
--   `deleted_at` datetime DEFAULT NULL COMMENT 'ngay xoa'
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tai khoan' ROW_FORMAT=COMPACT;

-- --
-- -- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `created`, `modified`, `status`, `gender`, `birthday`, `avatar`, `positionid`) VALUES
(1, 'Phạm Linh', 'phamcanhlinh@gmail.com', '0977777777', '$2y$10$mCCx.6gbIAVP9oDWsLzT4uTQqnR.WgSz6xyVfBxtrrCxwqkLqxuXy', '2018-06-19 20:04:02', '2021-01-10 01:32:45', 1, NULL, '1993-07-16', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 1),
(2, 'Thanh Luan', 'thienminh1@gmail.com', '0979427220', '$2y$10$42QlPUjx3S.k33nKuWESY.ftNZ1Fdhq4c775v7vnSigqmQDhsQzm.', '2018-09-09 15:51:34', '2020-11-05 09:11:28', 3, 1, '2004-01-01', 'https://pizo.vn/storage/uploads/2018/12/28/19360a4e750118dc5be3076f2142cfde.jpeg', 5),
(5, 'Thanh Nguyen', NULL, '0908589220', '$2y$10$fyQkFYw6edWyuIHJm2sgx.CXIFlqn.JtXSV7/i794nTxi8JciIDbG', '2018-09-09 16:01:04', '2020-03-01 13:15:50', 3, NULL, NULL, 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(8, '01654564346', NULL, '01654564346', '$2y$10$vOndHGlqaLaE2jYulJIa0.m7PG3TJbuJWjDcp.x6G/tRdTWe8y6aS', '2018-09-21 23:28:03', '2020-03-01 13:15:03', 3, NULL, NULL, 'https://pizo.vn/storage/uploads/avatar/avatar.png', 2),
(9, '0937586028', NULL, '0937586028', '$2y$10$LNm.V9Jiu9EFS3xEb/X34uBCb6MopgT/wyQqZXwf.JjT7WO.EPEwO', '2018-09-25 20:16:11', '2020-04-09 17:32:13', 1, NULL, NULL, 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(10, 'tesst', NULL, NULL, '$2y$10$bgCJFJLYeJ49uOK9Pqfll./iCH4.cYxIlcikzIqLI6zXKPAjGh90W', '2018-09-25 20:16:31', '2020-02-26 18:24:26', 1, NULL, NULL, 'https://pizo.vn/storage/uploads/2019/08/21/a3eed887992d1db43a2f773bf6461461.jpeg', NULL),
(11, 'minh tuấn 123', NULL, NULL, '$2y$10$vyL1lTb6xdh0SEEmAVPFNuwtbo/GiDHEEtguFx6vnSAwAwfn8zwgu', '2018-09-25 23:58:29', '2018-12-23 21:40:10', 1, 1, '2016-12-31', 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(12, '0945796465', NULL, '0945796465', '$2y$10$KilmyxmP1Ti4qkNkxBkaFOksSob0Lfj3uOAC1XQi5IGJ2jCQcuDLO', '2018-10-15 16:57:02', '2020-02-28 10:58:08', 3, 1, '2018-01-01', 'https://pizo.vn/storage/uploads/2018/12/28/064306819076c02f5df89b4457d2525c.jpeg', 4),
(13, '0988913547', NULL, '0988913547', '$2y$10$83TsX76fEjT4XEl0toww1eqxB9DQKfkb6VEyANIbbOnc0VeBEHRlm', '2018-10-16 14:30:23', '2018-12-07 23:01:38', 1, NULL, NULL, 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(14, '0939551190', NULL, '0939551190', '$2y$10$iN5N75rE1RRKBASri35ouuNeChCKXRtMFAt40yEFRVc8y09xLtXiW', '2018-10-16 19:18:52', '2020-03-01 13:16:39', 3, NULL, NULL, 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(15, 'tesst 01', NULL, NULL, '$2y$10$1DnruRbsBqv7/YtdammE8OrHPlvRS58ivsXRSEp0m5pMV0xJgLJ1C', '2018-11-04 09:37:01', '2018-11-04 09:39:00', 1, NULL, NULL, 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(113, 'Trinhj Huu Thinhj', 'info.polang@gmail.com', '0977456788', '$2y$10$UizVc4AnTd4I0Alrp7LOQe7aOv4GBqrXRMU35MHa4aaxUDABVNJF.', '2017-06-14 20:47:46', '2020-02-27 16:55:44', 3, NULL, '2017-11-06', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(126, 'camcu camcu', 'thienminh001@gmail.com', '0905769999', '$2y$10$Y.Gt.18RS00a.oFPM/.8PuGEB8e57KpWtrybzKPRfXzf12sKN11NG', '2018-10-26 21:37:55', '2020-09-10 19:05:57', 1, 1, '2018-06-28', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(127, 'CAO THỊ THU THỦY', 'thienminhcapital002@gmail.com', '0987627862', '$2y$10$4Nzlpj06Yqs2kgUtbIxuQesbrtTO/tihpVOtbFYu98MeUJsG.8gei', '2018-06-29 19:25:54', '2020-03-01 13:15:20', 3, NULL, '2018-09-15', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 2),
(128, 'Thiên Minh Capital', 'thienminhcapital003@gmail.com', '0938245958', '$2y$10$ueJWNgteW2QN/jZvOVQkcucEIBo/eXnU5grgqBG9z/PzpqyT7gUnW', '2018-11-19 16:27:03', '2021-01-08 19:37:26', 1, 2, '2018-06-29', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 2),
(129, 'phạm hưu phong', 'thienminh004@gmail.com', '0937557836', '$2y$10$SesrlJ24WUe/8in4fNa3B.9XpcLcgIQqdEr0dw4m/OQAHndwD/Y86', '2018-07-30 14:45:32', '2020-02-27 16:57:18', 3, NULL, '1986-01-28', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(130, 'VŨ QUANG Dũng', 'quangdungitc@gmail.com', '0973606666', '$2y$10$BaNMfHLbNRFAiKoAt2Pgd.PA8LC8C9S5Ak56bcu8i3xITZ32cQ032', '2018-07-08 11:11:21', '2020-02-27 16:56:33', 3, NULL, '1980-10-23', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(131, 'hồ thị  mỹ phương', 'thienminh005@gmail.com', '0916768413', '$2y$10$mAb3j08TiXq7JbG5sxqQ3uDHkwG3iiDRx7opAlitC.7vTTpP5JdIS', '2018-09-12 08:36:47', '2020-02-28 10:06:16', 3, NULL, '1928-10-11', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(132, 'phạm nhật long', 'thienminh006@gmail.com', '0944553089', '$2y$10$1d2Ic9ivLspBcyo4hIgeSuT7t1PfBOqEtOHDVF/zdwa2TO0QLHHoy', '2018-08-01 16:33:24', '2020-02-28 10:57:10', 1, 1, '2000-11-15', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 3),
(133, 'Lê Thị Phương Thảo', 'thienminh007@gmail.com', '0908147074', '$2y$10$WMtvzdEq11dzhUeTrjAScerfgfyh/.U/156AS3jjReCQDVYjvlt8G', '2018-07-28 11:29:54', '2020-02-27 16:56:49', 3, NULL, '1981-12-13', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(134, 'NGUYỄN THỊ  GIA LINH', 'thienminh008@gmail.com', '0971910899', '$2y$10$o4N3o/HaAvqsP/CuYYTddOWELxnGXSWjBmSuSm3wM6s//D0TjdxZC', '2018-11-10 15:28:52', '2020-02-27 08:34:17', 3, NULL, '1996-07-26', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(135, 'NGUYỄN THỊ THANH NGUYÊN', 'thienminh009@gmail.com', '0904535148', '$2y$10$atsK6pVc6tsN.qhZoEfjhuJO5Lt.paykvhYF.dGBYZlnT7PvRmzh2', '2018-11-10 15:29:03', '2020-02-28 10:58:24', 3, NULL, '1997-01-15', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(136, 'BỒ CÔNG ANH', 'thienminhcapital010@gmail.com', '0941087122', '$2y$10$7R/f4FxOprd/9AHaLEwaluGBsNlADZUalKNG7gE3cAre6vc4..dc.', '2018-11-20 08:48:04', '2020-05-26 16:10:55', 3, 1, '2018-09-04', 'https://pizo.vn/storage/uploads/2019/08/29/ff59adcb10eec983eb43b936e6da3013.jpeg', 4),
(137, 'nguyễn thị test', 'test123@gmail.com', '0905769999', '$2y$10$PwEVak5.WnXLTsvSmPBmJezb4CItoL1w70Cz04axer.VMGp8KI2HW', '2018-11-23 20:01:19', '2020-02-28 10:58:37', 3, NULL, '2018-09-19', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(138, 'PHẠM CẢNH LINH', 'thienminh2@gmail.com', '0905769898', '$2y$10$Stk9EMUHLkGCW9kU3kL00.NcFETMyfyBKHpAGByXwpk6b1BgFdos.', '2018-10-08 09:50:49', '2020-11-05 09:10:27', 1, 1, '1929-02-13', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 1),
(139, 'VĂN ĐÌNH NGỌC', 'thienminhcapital012@gmail.com', '0914640163', '$2y$10$U8kVsyg76A815kg2SDs7q.bVyL5SWwT3Ul6zdmyBq0QHJevCr65ZC', '2018-10-21 08:26:08', '2020-02-28 11:00:43', 3, NULL, '1983-10-25', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(140, 'LÊ MINH LÂM', 'thienminhcapital013@gmail.com', '0902918748', '$2y$10$wT0trhz4zTJGAeRE4xpWDe0e6rlLdgqCyGKwC4tktjPVAq3HL248m', '2018-11-04 17:56:43', '2020-02-28 10:54:27', 3, NULL, '1984-03-08', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(141, 'Bap Cui', 'test1234@gmail.com', '1123124', '$2y$10$Wk24T.cuXQkR.WWb4Wy/WejgW2/S894o95ySfUWNGfBazK8fIuhiC', '2018-12-08 11:27:37', '2020-02-26 18:27:36', 1, NULL, '2018-12-19', 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(142, 'Nguyễn Trung Chính', 'thienminhcapital014@gmail.com', '0933673876', '$2y$10$z90tMeYZkHN6a.oEEDSBIeG27jl/qDzp8Ejk.cgr7ObEHmcnGdlfu', '2018-12-23 21:19:16', '2020-11-05 09:13:37', 3, 1, '1978-04-30', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(143, 'Vũ Mạnh Long', 'thienminhcapital015@gmail.com', '0944575521', '$2y$10$RdRTU7UeeUZdDWKSlFlL5OWI.5Snp9GcBlLC3BUCIUS3IePFeN4lS', '2018-12-27 08:29:20', '2020-04-24 18:24:51', 1, 1, '1993-01-19', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(144, 'THÁI ANH LUÂN', 'thienminhcapital016@gmail.com', '0966825863', '$2y$10$Fak1P4Jr/5GgWDXJ2ZQ9/.12FKFCMrYyMFbWXI3GPRR6LAwAqCu8a', '2020-02-26 18:16:08', '2020-03-04 09:08:52', 1, 1, '1995-07-16', NULL, 4),
(145, 'NGUYỄN  KHÁNH HÀ', 'thienminhcapital017@gmail.com', '0776166193', '$2y$10$3UDLUUyQF5v5z2aqnydVWOJwgMgupN.u2NYFET8xiJjWTqjL6r6KO', '2018-12-28 15:31:11', '2020-02-28 11:01:28', 3, 1, '1993-10-05', 'https://pizo.vn/storage/uploads/2019/06/19/0c4dc49999964aa122a1b1c843b36025.jpeg', 4),
(146, 'LÊ VĂN HƯỞNG', 'thienminhcapital018@gmail.com', '0901047813', '$2y$10$T7fDPuyxT4vWmFwMzVwt4.vkNG4Kf9Ei8.NI6wVwuGolOGQ6V5Ptu', '2019-01-15 07:54:23', '2020-02-28 10:05:47', 3, NULL, '2000-10-13', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(147, 'PHẠM NGỌC ĐỨC', 'thienminhcapital019@gmail.com', '0966668744', '$2y$10$sce/4OOArzn5Hg28J30zCuBPDqa2yWeT7qI/usaq7sIoldlhk3Ulu', '2019-02-15 12:01:15', '2020-02-28 11:01:14', 3, NULL, '1988-03-21', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(148, 'PHẠM QUỐC TRƯỜNG', 'thienminhcapital020@gmail.com', '0906320089', '$2y$10$sxRbtnU598AQ2U0D5/yJZ.i7JslWjW.wIpF23Di3nBeP.H7dsmVuy', '2019-02-20 10:34:13', '2020-02-28 11:01:04', 3, NULL, '2018-03-23', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(149, 'ĐẶNG QUỐC  TÙNG', 'thienminhcapital021@gmail.com', '0906111018', '$2y$10$39h4P8g63kUkC..Ad3Il/uXQlFt6qDpknyUtDs8EDwtCIo81Se7nS', '2019-03-23 18:18:07', '2020-02-28 10:58:48', 3, NULL, '2018-09-27', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(150, 'PHAN PHƯƠNG GIA  HUY', 'thienminhcapital022@gmail.com', '0783876549', '$2y$10$J9N7HjNkET8/jm03dC/cQeIJhpkaKCbmF31TknCYioLd4L8Z5GFs.', '2019-04-02 14:37:48', '2020-02-28 10:06:03', 3, NULL, '2018-03-21', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(151, 'PHẠM HÀNG HẢI', 'thienminhcapital023@gmail.com', '0918460646', '$2y$10$izoyTUo4etJOOXSR0Q037uH0X3D7PY78D0MZaOxwrLHV18fnGWRRO', '2019-05-09 07:54:34', '2020-02-28 11:00:55', 3, NULL, '2018-11-02', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(152, 'ĐỔ MINH NHỰT', 'thienminhcapital024@gmail.com', '0903640975', '$2y$10$TZAcTFoQxpWOxk1EnKEOfui3AKp5QqMX94Yhh7Qv/KgwEIaaLqGJy', '2020-02-26 18:16:09', '2020-02-26 22:17:42', 3, NULL, '2019-06-24', NULL, 4),
(153, 'PHẠM THIÊN PHÚC', 'thienminhcapital025@gmail.com', '0909513345', '$2y$10$OfcAb0DbVUK79dsrYz.oLO3hzhChKLEMoQUlvdE2DTjzDpDDtooem', '2019-05-09 18:23:45', '2020-07-16 16:48:55', 3, 1, '1995-06-01', 'https://pizo.vn/storage/uploads/2020/02/27/1af456d775948c0329e5e207b1d5ab80.jpeg', 4),
(154, 'NGUYỄN THU THỦY', 'thienminhcapital026@gmail.com', '0903696441', '$2y$10$3LXIG.Vr3pya9sP27gMxXeJMFL73tvyX5bfyX1OF2RGrCFkgK33WG', '2020-02-26 18:16:09', '2020-02-28 18:32:39', 3, NULL, '2018-06-06', NULL, 2),
(155, 'CAO THỊ THU  THỦY', 'thienminhcapital027@gmail.com', '0987627862', '$2y$10$ffI08DFXpyjhAqluCV75AuF2qBbqXFJ.i71yeNW5HodrROmatHOIy', '2019-05-14 08:21:07', '2020-04-20 17:52:01', 3, NULL, '1996-12-27', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 2),
(156, 'NGUYỄN ĐỖ THANH TÚ', 'thienminhcapital028@gmail.com', '0903272198', '$2y$10$3eZ3UEP5gjpxGa7TM94EQuhh.BzeMNcXg1Z8Msi5D6vTvj3Fh55je', '2019-05-28 18:46:12', '2020-02-28 11:00:16', 3, NULL, '2019-03-23', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(157, 'NGUYỄN VĨNH  BÌNH', 'thienminhcapital029@gmail.com', '0907386888', '$2y$10$xqC25sQ1t89DYzzJNHOsNe1qki0dSwtTd.5KngevidYCMhYXlXCx6', '2020-02-26 18:16:09', '2020-02-26 22:18:00', 3, NULL, '2019-10-16', NULL, 4),
(158, 'PHAN TUẤN THANH', 'thienminhcapital030@gmail.com', '0909634078', '$2y$10$gzm4HGJprL/r74ypy3yEoe0vmPgs2dczjmCTBVtj2K/IGs.aFeztS', '2019-06-14 15:34:49', '2020-02-28 11:00:06', 3, NULL, '2019-01-29', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(159, 'anh  hiếu', 'hieu123@gmail.com', '0905769999', '$2y$10$0VdWYb4LXkRw6Bshky3hxOXU.zh4z07HISNHnBYwRi5ygwkV8P.Ji', '2019-06-15 08:28:48', '2020-02-28 10:59:52', 3, NULL, '1918-10-15', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(160, 'Bích Ngân', 'thienminhcapital031@gmail.com', '0938432879', '$2y$10$ivI019k4Fpz9OWPQ6pc39OkdCeH5.R0kyLSiSSuZFJ6pAbz8lpMgy', '2019-08-02 18:35:15', '2020-09-21 14:53:44', 3, 2, '1987-08-21', 'https://pizo.vn/storage/uploads/2020/05/19/d7ed65f9121d146470fdc92312183ba7.jpeg', 4),
(161, 'TRẦN VĂN TUYẾN', 'thienminhcapital032@gmail.com', '0372114855', '$2y$10$X7PLjqGfTyZ9B.oguJ871esh.IUfOEIcsQG3xiG6i8L4bZ6HOLwSC', '2019-08-14 16:20:43', '2020-02-28 10:59:33', 3, NULL, '1981-04-15', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(162, 'NGUYỄN TRỌNG  HỮU', 'thienminhcapital033@gmail.com', '0902149950', '$2y$10$92KERh58C4xpAeBz5.Myhua8si60EnIubPgdpYvRv7D6goJ0qmq56', '2019-09-25 10:30:19', '2020-08-20 10:31:26', 1, 1, '1993-11-01', 'https://pizo.vn/storage/uploads/2020/08/20/5dae1bd0bcdd45e0cbb419b8e999dac3.jpeg', 4),
(163, 'NGUYỄN NGỌC ANH SƠN', 'thienminhcapital034@gmail.com', '0981714237', '$2y$10$WdItC89awIotJZvdpfbNHOG9.DVkXl3gJKeXFgZuOP0WSjv0zLxD2', '2019-10-03 14:56:57', '2020-02-28 10:59:21', 3, NULL, '2987-02-13', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(164, 'NGUYỄN NGỌC THẠCH THẢO', 'thienminhcapital035@gmail.com', '0796217308', '$2y$10$8/h.TSSgFw.Ib3M1Gw4UU.DP1pRJl5oFTGal5LSH4oDjQDz5aQGYS', '2020-02-07 10:54:52', '2020-02-28 10:59:10', 3, NULL, '1993-07-08', 'https://pizo.vn/storage/uploads/avatar/avatar.png', 4),
(165, 'Trương Thị Thu Huyền', 'thienminhcapital036@gmail.com', '0936937417', '$2y$10$8FNzKo/mxbo4/yDwTu0S0u/nWWg8MkBahFY0hbVDAUV2DVrp7SYUO', '2020-02-24 19:35:41', '2020-02-28 10:58:58', 3, NULL, '1993-08-31', NULL, 4),
(166, 'ĐÀO HÙNG KHOA', 'thienminhcapital037@gmail.com', '0943680113', '$2y$10$8ZYUmRvNCzGly6BBRR4wJeukzZJGO.UfqVfg//MNxZDPOf82fylO.', '2020-02-24 19:35:42', '2020-02-28 10:55:21', 3, NULL, '2019-09-30', NULL, 4),
(167, 'MAI NGỌC  HIỂN', 'thienminhcapital038@gmail.com', '0886214415', '$2y$10$gq46Zl/VbTwGv7DCgBYHHOAPgwfu/QHLjjJo4b/9sdJ.sjqhFbgr.', '2020-02-24 19:35:43', '2020-02-28 10:55:52', 3, NULL, '2019-09-30', NULL, 4),
(168, 'THÁI HOÀNG MINH', 'thienminhcapital039@gmail.com', '0906600168', '$2y$10$pKEelL1rYpK4SrgQ0Rqlt.EJTWum5ZzhYbt9t3VwR0LPotA8gB0iC', '2020-02-24 19:35:43', '2020-02-28 10:54:13', 3, NULL, '2019-09-30', NULL, 4),
(169, 'NGUYỄN CAO CƯỜNG', 'thienminhcapital040@gmail.com', '0914091084', '$2y$10$S9rwZGNbTfutUdKXsuoEDOEhgUeF5mL2lyz2RkpWgLsN00w1392pe', '2020-02-24 19:35:44', '2020-11-05 09:13:09', 3, NULL, '2019-09-30', NULL, 4),
(170, 'MAI QUANG VINH', 'thienminhcapital041@gmail.com', '0927246555', '$2y$10$ZiMekQrMnsdorTepY8dqp.aOxwz7mrZm.caogm4P6ecc8H7Brnvdy', '2020-02-24 19:35:45', '2020-03-01 13:11:09', 1, NULL, '1998-06-12', NULL, 4),
(171, 'TRẦN THỊ DIỄM  XUÂN', 'thienminhcapital042@gmail.com', '0906859902', '$2y$10$Sc4jtAZTzICp0Iwrlk7uO.PjezIAMwCsBNoMLV6ftaXUf2lYhg.0u', '2020-02-24 19:35:45', '2020-02-28 10:55:40', 3, NULL, '2019-10-01', NULL, 4),
(172, 'TRẦN NGỌC HUỲNH', 'thienminhcapital043@gmail.com', '0931444880', '$2y$10$tAHU84ySF6H1OJpyzMa32OfJFnwNkNTM77LDNOAjPaXAkwVo6EzK6', '2020-02-24 19:35:45', '2020-02-28 10:56:03', 3, NULL, '2019-10-02', NULL, 4),
(173, 'TRẦN THANH NGÂN', 'thienminhcapital044@gmail.com', '0357813946', '$2y$10$kX/JmL7erhyLLKBboWJ32ebWbMep95orbx7iduCyiFduTGeOi5fgW', '2020-02-24 19:35:45', '2020-02-28 10:56:17', 3, NULL, '2019-10-01', NULL, 4),
(174, 'LÊ THỊ THANH THÚY', 'thienminhcapital045@gmail.com', '0917457399', '$2y$10$XwBNgYix8tC.qpK7blPWaO34Du3mr17i.0VzA7ltSqdVz9TGZsXVG', '2020-02-24 19:35:45', '2020-07-03 11:34:42', 1, NULL, '1999-10-08', NULL, 4),
(175, 'TRẦN MINH KHANG', 'thienminhcapital046@gmail.com', '0896416638', '$2y$10$zmyZVqQt7P80QUPJhy2roOpzVM2q53xOPLsgLM7NRHh6BBVDa92gC', '2020-02-24 19:35:45', '2020-02-28 10:53:11', 3, NULL, '2019-10-05', NULL, 4),
(176, 'NGUYỄN THỊ THANH THÚY', 'thienminhcapital047@gmail.com', '0707277841', '$2y$10$UeyhBq2VvWMLxrIHuYLxJeJOukDw1XAuR2zwd2/p3WIEYIkrE0Vqe', '2020-02-24 19:35:45', '2021-01-05 09:05:55', 1, NULL, '2019-10-09', NULL, 4),
(177, 'BÙI THANH MINH', 'thienminhcapital048@gmail.com', '0987676090', '$2y$10$JilKOGSx.PBFKXcD.SQxZO3nSfrPO/HeG9BVDZ1hsWMG/WuY/gdyK', '2020-02-24 19:35:45', '2020-03-03 16:36:54', 1, 2, '2019-10-09', NULL, 4),
(178, 'VŨ MINH TÂM', 'thienminhcapital049@gmail.com', '0908955900', '$2y$10$k6zHGtFtWZcNlySKr18hNeBzQAg701z/10SQKagxRE5Io1qV7Wj82', '2020-02-24 19:35:45', '2020-02-28 10:54:02', 3, NULL, '2019-10-10', NULL, 4),
(179, 'NGUYỄN ĐỨC  TUẤN', 'thienminhcapital050@gmail.com', '0967460717', '$2y$10$I3QWUDHsng9G0CxqHtmRv.xK9azxnA0i/8k2NfCfAJ1CdDE31Wg1S', '2020-02-24 19:35:46', '2020-03-17 07:53:58', 3, NULL, '2004-02-11', 'https://pizo.vn/storage/uploads/2020/02/26/941d693a100892687661ce281cdd30b9.jpeg', 4),
(180, 'Nguyễn Ngọc Quý', 'thienminhcapital051@gmail.com', '0399135544', '$2y$10$QbA.VojjMgHvEfVB9Xic1eaYQlWJHXBIkQ2poDyOQD.PewLzT7QVW', '2020-02-24 19:35:46', '2020-04-25 07:59:03', 1, 1, '2019-10-22', NULL, 4),
(181, 'NGUYỄN THU HUYỀN', 'thienminhcapital052@gmail.com', '0982896456', '$2y$10$Ir/brqNSa.ZImvsqw90lNulInHhLSyAbcjj.5sKKdjN3z5Y7r060i', '2020-02-24 19:35:46', '2020-02-26 22:19:29', 3, NULL, '1914-11-04', NULL, 4),
(182, 'VÕ TẤN THÀNH', 'thienminhcapital053@gmail.com', '0906601050', '$2y$10$52Gt5ODOXUs5s5OR/4YJyO4GCu92hmhjr1wivyq4Q6bjUXCfcBmdu', '2020-02-24 19:35:46', '2020-10-31 15:46:35', 1, NULL, '1997-01-30', NULL, 4),
(183, 'LÊ NGUYỄN TUYẾT NHY', 'thienminhcapital054@gmail.com', '0905361140', '$2y$10$PwDO4QIOX2ElFAzlLGih4.h9S.T0J7C54plwwifQLcERFxIIFeX4C', '2020-02-24 19:35:46', '2020-02-26 22:20:02', 3, NULL, '2019-12-03', NULL, 4),
(184, 'HỒ KÍNH  ĐỨC', 'thienminhcapital055@gmail.com', '0932660158', '$2y$10$ynRb6PQ6iTY/U7ArI716guaOyYsXM2TP84qsc8yetom56gw1xrs0K', '2020-02-24 19:35:46', '2020-02-26 22:20:12', 3, NULL, '2019-12-03', NULL, 4),
(185, 'HUỲNH QUANG PHÚC', 'thienminhcapital056@gmail.com', '0909852183', '$2y$10$4q12sX.28p.snLoJeypk0OXfiKuItPF1MamG0EYhvVZOoPTsYR5dW', '2020-02-24 19:35:46', '2020-02-28 10:55:06', 3, NULL, '1914-07-15', NULL, 4),
(186, 'LÊ HỒNG PHONG', 'thienminhcapital057@gmail.com', '0948758855', '$2y$10$uK1bfrZNC6qSHD0DpMqZUeBEBt9UtwqvBMmadglxPfypeTdPgES5S', '2020-02-24 19:35:46', '2020-04-27 11:04:28', 3, NULL, '2020-01-14', NULL, 4),
(187, 'Nguyễn Đình Chung', 'thienminhcapital058@gmail.com', '0338336201', '$2y$10$4W.PwlJaORgS2iLq3VhEAu5iNxDuGaOM/RrQv4iMtyr0VQ4nMnZkG', '2020-02-24 19:35:47', '2020-04-27 11:06:31', 3, NULL, '1955-03-09', NULL, 4),
(188, 'NGUYỄN VIẾT  HUY', 'thienminhcapital059@gmail.com', '0938737616', '$2y$10$dHh.LzMJzzmQ5Gyj0WQuJetCiLNqf94W3yXimR0RP5z7gIZEXwbN.', '2020-02-24 19:35:47', '2020-02-26 22:18:56', 3, NULL, '2020-02-05', NULL, 4),
(189, 'NGUYỄN THỊ KIM NHUNG', 'thienminhcapital060@gmail.com', '0932827926', '$2y$10$pogBp3iK75yQzL.nffxJ4uJBUK1aCcrUM9hjIbcplH9qgo6ImLFpm', '2020-02-24 19:35:47', '2020-10-07 17:59:46', 1, NULL, '1955-03-09', NULL, 4),
(190, 'Nguyễn Hồng  Nhật', 'thienminhcapital061@gmail.com', '0979792970', '$2y$10$fLtXXYVYHmgx7ms1ibABk.kcjtVp.fOchwR6vuhmmqS0jdXThcXWa', '2020-02-24 19:35:47', '2020-04-27 10:54:29', 3, 1, '1955-03-08', 'https://pizo.vn/storage/uploads/2020/02/26/6f8eba352ca2b505855fbbf61c22cd5a.jpeg', 4),
(191, 'Bảo Quý  Anh', 'thienminhcapital062@gmail.com', '0836646093', '$2y$10$YuUd7aOi8btxaS7QdCgUkeZPbz2aHZZRq4k6gAFUF2UkEJOBfpcLa', '2020-02-24 19:35:47', '2020-07-16 16:47:55', 3, 1, '1955-03-01', NULL, 4),
(192, 'Lê Mạnh  Trường', 'thienminhcapital063@gmail.com', '0902395125', '$2y$10$kEYZChjrgZoNO9waZj1dHOr5L0L6qVsDGqpz7PigUlys4kb2Wzyj.', '2020-02-24 19:35:47', '2020-02-26 22:19:10', 3, NULL, '1955-01-10', NULL, 4),
(193, 'Trần Bảo Trân', 'thienminhcapital064@gmail.com', '0925324498', '$2y$10$TwkeJ.Bfrxa.zC3fSBzvW.BDrz6SnCBr9u/2w3wfHRMTDa.N1iktS', '2020-02-24 19:35:47', '2020-12-20 11:56:15', 1, NULL, '1955-03-01', NULL, 4),
(194, 'LƯU MỸ MỸ', 'thienminhcapital065@gmail.com', '0343486777', '$2y$10$Ed30ByJVrfc.j.kL04GSFuOsLI6pohmvmRta7uAgp5lOsrwQSw2hi', '2020-02-24 19:35:47', '2020-07-20 15:37:04', 3, 2, '1955-02-15', NULL, 4),
(195, 'LÊ THỊ Ý NHI', 'thienminhcapital066@gmail.com', '0902802242', '$2y$10$VMQM8Ku/xGBLLdhntBbI4udC2z0/4wkvNu9bykCTd6KwacN8WcE1i', '2020-02-24 19:35:47', '2020-07-20 15:37:18', 3, 2, '2020-02-20', NULL, 4),
(200, NULL, NULL, '0976337424', '$2y$10$f938jxXH8yxd0Ad/6g6DMepUY5tLrAJCc/8beYQIZ8C9rJbT7BjWe', '2020-02-27 10:01:14', '2020-12-16 09:18:11', 1, NULL, NULL, 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(201, 'NGUYỄN THANH VŨ', 'thienminhcapital067@gmail.com', '0934821395', '$2y$10$UdV0xtvI2Q4auWVn7g3GG.MCTbtLrN6zcy69mEWoxWINDt5gF8S0S', '2020-03-02 17:35:54', '2020-04-04 16:20:41', 1, 1, '1992-10-10', NULL, 4),
(202, 'LONG HẢI YẾN', 'thienminhcapital068@gmail.com', '0932914196', '$2y$10$rZa8CsCIzowvHMMWq71Db.pCE.HWImsg7kx87Ej2VPoOwsAcMaVQ2', '2020-03-04 14:00:49', '2020-03-05 21:21:12', 3, 1, '1996-06-23', NULL, 4),
(203, 'NGUYỄN HẢI NAM', 'thienminhcapital069@gmail.com', '0903034456', '$2y$10$b8j0akR5RPCMnWlADaRp.euhpKvK0WVCQ0uEUboDID3VpDbZjxPz2', '2020-03-04 14:02:21', '2020-03-07 14:18:15', 3, 1, '1980-07-20', NULL, 4),
(204, 'TẤT BÁ ĐẠT', 'thienminhcapital070@gmail.com', '0908026235', '$2y$10$vhmw98DDEx4sI7pzmAoj0emcMqS2b17S20a4JRCg1rJt1igw2i4s6', '2020-03-05 11:26:38', '2020-06-16 19:03:32', 3, 1, '1980-04-06', NULL, 4),
(205, 'TẠ CÔNG MINH', 'thienminhcapital071@gmail.com', '0777102394', '$2y$10$GZnk1R2RpotqsYfjqN18Ke9ffl7ZHvVCQOaAcI4tUIKGE6BwgBJWy', '2020-03-05 11:28:52', '2020-03-06 18:33:09', 3, 1, '1994-12-21', NULL, 4),
(206, 'ĐẶNG VĂN THẮNG', 'thienminhcapital072@gmail.com', '0909213936', '$2y$10$M6XN8PwY9TW/HkgAK1.DT.xuB0C1AyV9B3uYgRnUvErVE9n02bKae', '2020-03-19 09:33:51', '2020-06-16 19:03:14', 3, 1, '1986-11-16', NULL, 4),
(207, 'HOÀNG KỲ THẮNG', 'thienminhcapital073@gmail.com', '0988828202', '$2y$10$WRrbrJGif3XJ7ywY/rtjFu3x1iWpv7Szc7jtTxtjt8kjWPJi8Z/5m', '2020-03-26 09:13:47', '2020-07-20 15:39:51', 3, 1, '1990-07-25', NULL, 4),
(208, 'NGÔ ĐA LONG', 'thienminhcapital074@gmail.com', '0374895877', '$2y$10$VAhY8Inkf/rq.fRkG2LuXuvsJgliUCwHtn4FKghTOxG2xY3xSfJIC', '2020-03-27 09:08:28', '2020-04-03 16:53:39', 3, 1, '1999-06-16', NULL, 4),
(209, 'Lê Bảo Long', 'thienminhcapital075@gmail.com', '0857751688', '$2y$10$9k7Gj9VaAg9NJQFsGEFruen/jTdt59Mi282LSX6FuVxRRih1oubbm', '2020-03-31 18:17:06', '2020-03-31 18:17:27', 1, 1, '2001-08-01', NULL, 4),
(210, 'TÔ NGỌC NAM', 'thienminhcapital076@gmail.com', '0522060501', '$2y$10$JI/AVWMgTkjb55XFsmoESOVNaAFmF1mMsdBUEEPsIc5i7dUB5UU1G', '2020-04-03 16:53:02', '2020-12-16 09:18:05', 1, 1, '1997-05-12', NULL, NULL),
(211, 'TÔ NGỌC NAM', 'thienminhcapital0760@gmail.com', '0928948984', '$2y$10$NA4st33FW7g1LgnLRHGtqu3REJhnZqkJ3j7fB8.WwvkoWB/ZPUviy', '2020-04-03 17:02:40', '2020-05-22 09:16:59', 3, 1, '1997-05-12', 'https://pizo.vn/storage/uploads/2020/04/03/54f4401f954b8d103c2c8f19035aff52.jpeg', 4),
(212, 'NGUYỄN THỊ TUYẾT MAI', 'thienminhcapital077@gmail.com', '0932634174', '$2y$10$UhKhbYrpGyZL9Zv8f6uMNeZRcpTx.lLkIA8k/N5TTiFLZDOtMToZq', '2020-04-07 09:21:25', '2020-10-20 16:34:54', 1, 1, '1998-04-17', NULL, 4),
(213, 'NGUYỄN HOÀNG TRUNG', 'thienminhcapital078@gmail.com', '0906861665', '$2y$10$udH7g/K/Mxs1fZ7vEKVUou.nuA9m7J3iH3EgPi3LDiKWgMyhk2VLu', '2020-04-15 11:07:46', '2020-04-27 10:54:50', 3, 1, '1997-11-05', NULL, 4),
(214, 'HOÀNG VĂN ĐẠI', 'thienminhcapital079@gmail.com', '0903864079', '$2y$10$vNV4K1/eRblverAasXs5teXWKWMj5YBP7PjJzV8F.301ae7PkaHZy', '2020-04-21 11:30:43', '2020-05-22 09:15:30', 3, 1, '1976-10-12', NULL, 4),
(215, 'NGUYỄN ĐỨC TÂM', 'thienminhcapital081@gmail.com', '0925049575', '$2y$10$EiX8hUzy7lG1B9nGEPWAy.Kxr6Iw/q.OD9zcYb/EeUS8qXTfOp76q', '2020-04-25 14:15:36', '2020-04-25 15:02:34', 1, 1, '1991-01-11', NULL, 4),
(216, 'Trần Thị Mỹ Duyên', 'thienminhcapital082@gmail.com', '0931532734', '$2y$10$eq8SQVjLy7CItAVkRoeouec4olBnMNRbfNWaqVKmMzryqI5tEDYcK', '2020-04-28 11:33:54', '2020-04-28 16:23:23', 1, 1, '1994-08-20', NULL, 4),
(217, 'HOÀNG ĐÌNH SƠN', 'thienminhcapital083@gmail.com', '0868099459', '$2y$10$YsYJ4hJfcLaKxG3n/sOaiupXNj002g1T/PB06RjTASQkl/xQZOnbm', '2020-05-13 14:52:12', '2020-07-16 16:48:34', 3, 1, '1998-03-30', NULL, 4),
(218, 'NGUYỄN THANH TIÊN', 'thienminhcapital084@gmail.com', '0777622875', '$2y$10$xH.E5g8Dr6arq9u2SHUR9OcldGJNLnNk7ORxVXxqmMiNMOdcN3TkO', '2020-05-13 14:54:26', '2020-05-22 09:15:56', 3, 2, '1996-10-15', NULL, 4),
(219, 'ĐOÀN MINH CHÍNH', 'thienminhcapital085@gmail.com', '0772033400', '$2y$10$ZY8..JyBhNeWk3XZTnqBW.hm4PjltwOO0eYK1vq4Mr9pLyrGIt7RK', '2020-05-13 14:56:10', '2020-05-22 09:16:18', 3, 1, '1995-08-17', NULL, 4),
(220, 'LÊ MINH HẢI', 'thienminhcapital086@gmail.com', '0385653701', '$2y$10$6EqqWdHlMC9MFI/0vUbEA..oFu3idHk0zqRV6XQZjNknVEnmt.biC', '2020-05-20 14:18:25', '2020-05-21 07:40:59', 1, 1, '1995-12-24', NULL, 4),
(221, 'Đặng Minh Nhựt', 'thienminhcapital088@gmail.com', '0909645116', '$2y$10$Rj1f4I2Ji6l8SVVpReNcuevDGA8FM0xX1SUZAQf3MlVv3PJTPegp2', '2020-05-25 14:55:47', '2020-07-16 17:24:19', 3, 1, '1988-08-17', NULL, 4),
(222, 'LÊ MINH NHẬT', 'thienminhcapital090@gmail.com', '09111621656', '$2y$10$WStP.mqfQzz5Z85vC/4HFePWjRlT.ooISFuf0ZJcgOnXcTkDVkgJa', '2020-05-26 08:30:26', '2020-07-16 16:49:13', 3, 1, '1996-09-01', NULL, 4),
(223, 'TRẦN NGỌC BÍCH TUYỀN', 'thienminhcapital089@gmail.com', '0937470514', '$2y$10$9wFx5r8EGKVFc4RP89fwcOtRYXPg2fG8EjIr/86ZJLOmLdVSQ4FOS', '2020-05-26 08:32:38', '2020-12-17 13:45:49', 3, 2, '1988-05-14', NULL, 4),
(224, 'HUỲNH NGỌC CHUÂN KHANG', 'thienminhcapital087@gmail.com', '0889478887', '$2y$10$iSGTNAMs20cfzJL418YcZeS0xBBzrzcxT144X5LnLmwp.5sSOTGH6', '2020-05-26 08:34:22', '2020-07-16 16:48:10', 3, 1, '1973-05-25', NULL, 4),
(225, 'PHẠM TƯỜNG HUY', 'thienminhcapital091@gmail.com', '0914887970', '$2y$10$UhcQ718F3tjffb2LaLVAGuiQGU1r3Jblr.mGcdhK1jZtaYSE5m/tW', '2020-06-10 19:04:31', '2020-11-05 09:12:22', 3, 1, '1996-08-11', 'https://pizo.vn/storage/uploads/2020/06/11/b2bf35ec7215cd09819a3e524e29ad19.jpeg', 4),
(226, 'Huỳnh Trần Long', 'thienminhcapital092@gmail.com', '0966660968', '$2y$10$R.1WPoW3iDxiNahCiYNQIuesCRD37LLoj2EmN9dJz5xyhPnc2EIe6', '2020-06-11 09:08:42', '2020-07-30 15:50:02', 3, 1, '1990-09-05', NULL, 4),
(227, 'NGUYỄN HẢI THÀNH', 'thienminhcapital093@gmail.com', '0929268792', '$2y$10$JCqXgjBtlcM7k80dFUyRDenF4nahm1mSLkTmg8dJdJhyxijFgx9XO', '2020-06-19 09:04:50', '2020-07-20 15:38:23', 3, 1, '1992-10-03', NULL, 4),
(228, 'Trịnh Lê Minh Thái', 'thienminhcapital094@gmail.com', '0523484870', '$2y$10$JG16R5DWKo015.qZWHjssOzjiU/O..0LKcfSvD1BrY.96br5Q0gha', '2020-06-25 12:34:18', '2020-06-25 12:36:18', 1, 1, '2001-01-04', NULL, 4),
(229, 'NGUYỄN HUY HẬU', 'thienminhcapital095@gmail.com', '0933883792', '$2y$10$kqS26whM5m8tLqiEQ82SVeuldeiJ89inAUS3uau2jgKT8I2fpUurW', '2020-06-25 12:35:50', '2020-07-20 15:38:44', 3, 1, '1992-07-07', NULL, 4),
(230, 'Nguyễn Yến Ngọc', 'ngoc@gmail.com', '0918900694', '$2y$10$xb7od4NmEgmUrhQWk0XV9eBZ3FFbXcDFCJGvKYTW18Xjx8tpEDnxC', '2020-07-07 09:11:30', '2020-08-03 15:21:13', 1, 1, '2010-02-18', NULL, 2),
(231, 'Trang Thị Hồng Huế', 'thienminhcapital096@gmail.com', '0919641357', '$2y$10$CfPzIXPlaihlhlYAH/KcEuuIG4SWZgPmp3W5vdqm/vglb7KBu8H0G', '2020-07-08 17:03:14', '2020-08-18 09:36:20', 3, 2, '1988-02-15', NULL, 4),
(232, 'Nguyễn Quỳnh Vi', 'thienminhcapital097@gmail.com', '0968961645', '$2y$10$q0XUV7bbhTKeRQBcIwIjOuBKKEZgQkfCe7VEOkHLG5vNoFxoWHRUq', '2020-08-03 15:35:34', '2020-09-10 13:58:31', 1, 2, '1996-04-19', 'https://pizo.vn/storage/uploads/2020/09/10/536201a34aa943c025e809a5e22c349f.jpeg', 4),
(233, 'Lê Hồng Ý Nhi', 'thienminhcapital098@gmail.com', '0869869244', '$2y$10$TSDraL1zyzxrn7BmKwcshuo36c7ODigliKk/k5OkRDIUpsiARfSL2', '2020-08-03 15:42:04', '2020-08-30 17:39:30', 3, 2, '1997-09-08', NULL, 2),
(234, 'Mai Phương Quân', 'thienminhcapital099@gmail.com', '0336302732', '$2y$10$rUSk5JSSeKx..enxf4d.QeRi9Qcq7VAbUxc1cYbeMVMeS87PGew9a', '2020-08-03 15:45:21', '2020-08-30 17:39:15', 3, 2, '1997-08-12', NULL, 2),
(235, 'ĐOÀN NHẬT NAM', 'thienminhcapital100@gmail.com', '0934228611', '$2y$10$ndmceNUsmiY.ShgOL7Qzl.ePUq2aOjGegsKWmAEv2OjEidT/J0bwO', '2020-08-19 16:20:10', '2020-08-19 16:20:23', 1, 1, '1997-05-07', NULL, 4),
(236, 'NGUYỄN NGỌC BẢO TRÂN', 'thienminhcapital101@gmail.com', '0777979555', '$2y$10$ApALXTdJWCzo1QTb1hqjAuS8EPcWtKKx6IyN8OpZigLJ1ad8zIm0C', '2020-08-25 14:59:05', '2020-08-30 17:38:57', 3, 1, '1996-06-18', NULL, 2),
(237, 'Ngô Nguyễn Thị Kim Dung', 'thienminhcapital102@gmail.com', '0905254844', '$2y$10$J5TzlfsW8y0FqKV9/7ldbexJ0QSp4V2kMcg3x55NX3XruoGwVLIRy', '2020-08-25 15:01:21', '2020-08-25 17:10:01', 1, 2, '1996-04-24', NULL, 2),
(238, 'LÊ THỊ THU HẰNG', 'thienminhcapital103@gmail.com', '0848293502', '$2y$10$SthqxcvGD7JXu2y/RUlSEuxLqMVOunXVjGUJFjRcSqntDdXXb0hXm', '2020-09-09 11:01:16', '2020-09-10 11:45:59', 1, 2, '1996-02-17', NULL, 4),
(239, 'NGUYỄN NGỌC THẢO', 'thienminhcapital104@gmail.com', '0938683354', '$2y$10$Byn5ZLvUItIjDM4OumkAlOOxzXRKMKTeHjTmtXiCqDQTeOQljOeNm', '2020-09-09 11:02:20', '2021-01-08 09:30:11', 3, 2, '1998-01-09', NULL, 4),
(240, 'PHẠM THỊ ANH THƯ', 'thienminhcapital105@gmail.com', '0346773931', '$2y$10$1/R2NNFctwqVyejSSvxqdeNdP3fLg20fPOw8Ug3VSJNjY6loRxvFS', '2020-09-09 11:03:30', '2020-12-30 09:10:31', 1, 2, '1998-01-10', NULL, 4),
(241, 'Nguyễn Thị Phước', 'thienminhcapital107@gmail.com', '0706676255', '$2y$10$9tkPDjLM.xCq/rFHmp/N7OHCB4mH6ZPVxyoM0LOMzVs8H0WFvfPD.', '2020-10-01 11:16:25', '2020-12-16 10:13:15', 1, 2, '1981-10-20', NULL, 4),
(242, 'ĐỖ HOÀNG NGỌC QUYÊN', 'thienminhcapital108@gmail.com', '0888436409', '$2y$10$Rka6hSThHelordauiUAil.Tn6h5g1FSHIYYSkznjodmHJN10QMBt2', '2020-10-03 08:52:21', '2020-10-16 10:02:19', 1, 2, '1998-09-29', 'https://pizo.vn/storage/uploads/2020/10/16/9b6802e59ba2345ef4fcca58dffb2df1.jpeg', 4),
(243, 'HỒ PHƯƠNG THẢO', 'thienminhcapital111@gmail.com', '0922011812', '$2y$10$zx01ReAALelYiPI2o.thA.N.NscE0POGU.fknLotdr0FEZbb6AJqi', '2020-10-05 19:07:51', '2020-10-05 19:08:15', 1, 2, '1992-11-20', NULL, 4),
(244, 'HOÀNG TRỌNG TRUNG', 'thienminhcapital109@gmail.com', '0904088980', '$2y$10$mNICiELTDxKo1LbbUHB/Du7JxBjLxpybUMLA416n3164rNb/sJyVW', '2020-10-12 09:12:32', '2020-12-17 13:57:40', 3, 1, '1994-05-30', NULL, 4),
(245, 'MAI THIÊN KIM', 'thienminhcapital110@gmail.com', '0907621011', '$2y$10$ViKJFb5zABVLM81TIPn1ouedhPhcG0z8xeXxj1j2I2ibVXefEa3ee', '2020-10-12 09:13:57', '2020-10-15 09:08:46', 1, 2, '1988-12-25', NULL, 4),
(246, 'NGUYỄN HUỲNH NGA', 'thienminhcapital112@gmail.com', '0963742545', '$2y$10$Hlt.7SPV6.eJ6VuuyNmLv.kzlzCq3iK.wBcvi5.DGZK1vQ9P3jKpW', '2020-10-29 09:23:38', '2020-11-30 03:28:07', 1, 2, '1998-06-20', NULL, 2),
(248, 'TỪ TIỂU MY', 'thienminhcapital113@gmail.com', '0932693561', '$2y$10$TZOVsvluFVLxTHBUfPChmeW2SoQzDA0UjYGMMZ.1T3WB9xjuAJfzi', '2020-11-18 10:34:18', '2020-11-25 10:34:25', 3, 2, '1986-03-10', NULL, 4),
(249, 'NGÔ TẤN NGHĨA', 'thienminhcapital114@gmail.com', '0385330048', '$2y$10$vipZ8gb5l1AKuYaXOZSNqu.V67QifZDojdiLbf/MjDuw1FErjb6LS', '2020-11-25 10:37:02', '2020-11-25 12:09:53', 1, 1, '2001-03-24', NULL, 4),
(250, 'NGUYỄN HẢI LY', 'thienminhcapital115@gmail.com', '0328655687', '$2y$10$JNdHtqZXHXKO6G/F2vEU6ezh8BOIwW.OdyGcgfCtetQlkSI19TT9K', '2020-11-25 10:38:46', '2020-11-25 10:39:28', 1, 2, '1993-11-13', NULL, 4),
(251, 'TRƯƠNG PHẠM MINH QUÂN', 'thienminhcapital117@gmail.com', '0915288772', '$2y$10$xyBRMarcCuHxc14h75Ynr.JlEfebmfLg/pXlFeNqGoO8dkt1E1R/K', '2020-11-27 14:14:29', '2020-11-27 14:14:42', 1, 1, '2000-11-25', NULL, 4),
(252, 'Mai Trúc Quỳnh', 'quynhmt98@gmail.com', '0366862326', '$2y$10$GwJpQFhQE.7/z4tm71hTOOQClVXV8G2fQyrl1lYMf28jwnOoELGNW', '2020-12-15 08:41:30', '2020-12-16 09:18:02', 1, 2, '1998-05-18', 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(253, 'Đỗ Thị Phương Uyên', 'phuonguyen9192@gmail.com', '0888936979', '$2y$10$TQqyHGsKp9BsuDJ8XCsrq..NfWiD6mtWWvNYaIR8M0IdRZkOKM4iW', '2020-12-15 08:43:34', '2020-12-16 09:17:59', 1, 2, '1999-05-14', 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(254, 'Vũ Anh Khoa', 'vakhoa869@gmail.com', '0384890787', '$2y$10$IhiPrCEloG5s/DBV9nFtuejzgsj86V/B8VJ3weeenexvg7nlmR2Va', '2020-12-15 08:44:44', '2020-12-16 09:17:54', 1, 1, '1999-06-08', 'https://pizo.vn/storage/uploads/avatar/avatar.png', NULL),
(255, 'Mai Trúc Quỳnh', 'thienminhcapital@gmail.com', '0366862326', '$2y$10$9tHImYz5HIrM4YQHWl8gr.E5Xi7kfqxij13G69792vyqYXIPcQT8G', '2020-12-16 09:25:39', '2020-12-16 09:37:56', 1, 2, '1998-05-18', NULL, 2),
(256, 'Đỗ Thị Phương Uyên', 'phuonguyen9192a@gmail.com', '0888936979', '$2y$10$FjwbGzBiMeGMVs5Jb7mATexSuKUFN.y.yV6Bs4sFNJjYxPe94tU8u', '2020-12-16 09:30:07', '2020-12-16 09:37:46', 1, 2, '1999-05-14', NULL, 2),
(257, 'Vũ Anh Khoa', 'vakhoa869a@gmail.com', '0384890787', '$2y$10$4TL3UpKBAa/VHWqZZdNJouIlyONGgnNdWz0TvrUJ5aq3tWi/s1gUm', '2020-12-16 09:31:08', '2020-12-16 09:37:34', 1, 1, '1999-06-08', NULL, 2),
(258, 'NGUYỄN CẨM HIỀN', 'thienminhcapital118@gmail.com', '0938169427', '$2y$10$w2qW3sx/lYoYZCQ3fHMKT.00WVH/qxgUhpMXLysKEC3WrjkMh4EBa', '2020-12-16 09:41:59', '2020-12-16 09:42:12', 1, 1, '1995-02-04', NULL, 4),
(259, 'ĐẶNG THỊ NHÂN TÂM', 'thienminhcapital119@gmail.com', '0932723936', '$2y$10$nGh33uSZhTTAio97xtEL0.UrqJYIUBEjZFNsJuP2NOEpPF/8EjWOa', '2020-12-18 10:53:07', '2021-01-05 07:20:56', 1, 2, '1982-01-01', NULL, 4),
(260, 'VÒNG TRÔI HƯNG', 'thienminhcapital121@gmail.com', '0906844273', '$2y$10$g0PUF3umogjMckKiaeky3ua2MOu3kk1rz05JGZ527NkF6dcBN2hly', '2020-12-30 08:49:03', '2020-12-30 19:49:10', 1, 1, '1997-09-23', NULL, 4),
(261, 'Lê Hùng Vương', 'hungvuong21pk@gmail.com', '0971144974', '$2y$10$0KaMFAmLLAFvJeh552SuHOXGW24dX6IkltuAImjSSbmhU0ufWe3NO', '2021-01-08 08:18:29', '2021-01-08 08:18:41', 1, 1, '1999-11-07', NULL, 2),
(262, 'TRƯƠNG VĂN THẮNG', 'thienminhcapital124@gmail.com', '0973802876', '$2y$10$IykXSAhXqMZdipDk4rNxq.FFJZKoNv4MoqbSCI6Zm8zpqN8Zxbeyq', '2021-01-08 09:23:16', '2021-01-08 09:23:35', 1, 1, '1999-09-01', NULL, 4),
(263, 'HUỲNH KHẢ HÂN', 'thienminhcapital122@gmail.com', '0798054179', '$2y$10$tuPbj3ptRSGhrvkph59ayuZUbbueuGjcI/r8nGiYNHo9okojjzICG', '2021-01-09 18:07:13', '2021-01-11 10:17:13', 1, 2, '1995-10-06', NULL, 4),
(264, 'Lê Văn Thành', 'thienminhcapital123@gmail.com', '0962094426', '$2y$10$.sd9nwN5BoEGKDPk6.fLwuwuevBx1fKB/4bSuLNIufwXr7OaAkzvq', '2021-01-09 18:08:30', '2021-01-09 18:08:43', 1, 1, '1997-03-15', NULL, 4);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
-- --
-- ALTER TABLE `users`
--   ADD PRIMARY KEY (`id`) USING BTREE;

-- --
-- -- AUTO_INCREMENT for dumped tables
-- --

-- --
-- -- AUTO_INCREMENT for table `users`
-- --
-- ALTER TABLE `users`
--   MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=265;
-- COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

