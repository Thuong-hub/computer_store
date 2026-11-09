-- Dữ liệu mẫu (đã ẩn danh) cho đồ án Computer Store
-- Tài khoản demo: admin01 / Admin@123  |  user01 / User@123
-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `computer_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `brand_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`brand_id`, `name`, `description`) VALUES
(1, 'Intel', 'Hãng sản xuất CPU và linh kiện máy tính'),
(2, 'AMD', 'Hãng sản xuất CPU và GPU'),
(3, 'NVIDIA', 'Hãng sản xuất GPU'),
(4, 'ASUS', 'Hãng sản xuất linh kiện, laptop và phụ kiện'),
(5, 'MSI', 'Hãng sản xuất linh kiện và laptop'),
(6, 'Gigabyte', 'Hãng sản xuất mainboard và card đồ họa'),
(7, 'Kingston', 'Hãng sản xuất RAM và thiết bị lưu trữ'),
(8, 'Corsair', 'Hãng sản xuất RAM, nguồn và phụ kiện'),
(9, 'Samsung', 'Hãng sản xuất SSD và thiết bị điện tử'),
(10, 'Western Digital', 'Hãng sản xuất HDD và SSD'),
(11, 'Seagate', 'Hãng sản xuất ổ cứng'),
(12, 'Cooler Master', 'Hãng sản xuất case, nguồn và tản nhiệt'),
(13, 'Logitech', 'Hãng sản xuất chuột, bàn phím và phụ kiện'),
(14, 'Razer', 'Hãng sản xuất thiết bị gaming'),
(15, 'TestBrand', 'Thương hiệu đã được cập nhật'),
(16, 'Toshiba', 'Toshiba'),
(17, 'DeepCool', 'DeepCool'),
(18, 'Noctua', 'Noctua'),
(19, 'Lenovo', 'Lenovo'),
(20, 'Acer', 'Acer'),
(21, 'Dell', 'Dell'),
(22, 'LG', 'LG'),
(23, 'AKKO', 'AKKO'),
(24, 'Keychron', 'Keychron'),
(25, 'SteelSeries', 'SteelSeries'),
(26, 'HyperX', 'HyperX');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2026-09-28 05:53:00', '2026-09-28 05:53:00'),
(2, 2, '2026-10-06 06:24:55', '2026-10-06 06:24:55'),
(3, 4, '2026-10-13 01:38:23', '2026-10-13 01:38:23'),
(4, 5, '2026-10-14 07:49:36', '2026-10-14 07:49:36'),
(5, 6, '2026-10-14 13:06:23', '2026-10-14 13:06:23'),
(6, 7, '2026-10-15 08:21:46', '2026-10-15 08:21:46'),
(7, 8, '2026-10-19 15:04:14', '2026-10-19 15:04:14'),
(8, 10, '2026-10-20 08:16:16', '2026-10-20 08:16:16'),
(9, 11, '2026-10-20 08:37:20', '2026-10-20 08:37:20'),
(10, 13, '2026-10-20 08:45:35', '2026-10-20 08:45:35'),
(11, 12, '2026-10-20 08:45:47', '2026-10-20 08:45:47');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` bigint(20) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cart_items`
--

INSERT INTO `cart_items` (`cart_item_id`, `cart_id`, `product_id`, `quantity`, `created_at`, `updated_at`) VALUES
(56, 1, 29, 1, '2026-10-13 03:00:15', '2026-10-13 03:00:15'),
(96, 8, 7, 1, '2026-10-20 08:34:02', '2026-10-20 08:34:02'),
(166, 7, 1, 1, '2026-11-01 13:14:00', '2026-11-01 13:14:00'),
(198, 9, 2, 1, '2026-11-05 09:22:02', '2026-11-05 09:22:02'),
(199, 9, 3, 1, '2026-11-05 09:22:02', '2026-11-05 09:22:02'),
(200, 9, 4, 2, '2026-11-05 09:22:02', '2026-11-05 09:22:02'),
(201, 9, 5, 1, '2026-11-05 09:22:02', '2026-11-05 09:22:02'),
(202, 9, 8, 2, '2026-11-05 09:22:02', '2026-11-05 09:22:02'),
(203, 9, 9, 1, '2026-11-05 09:22:02', '2026-11-05 09:22:02'),
(204, 9, 12, 1, '2026-11-05 09:22:02', '2026-11-05 09:22:02');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `category_id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`category_id`, `name`, `description`) VALUES
(1, 'CPU', 'Bộ vi xử lý'),
(2, 'GPU', 'Card đồ họa'),
(3, 'RAM', 'Bộ nhớ RAM'),
(4, 'Mainboard', 'Bo mạch chủ'),
(5, 'SSD', 'Ổ cứng SSD'),
(6, 'HDD', 'Ổ cứng HDD'),
(7, 'PSU', 'Nguồn máy tính'),
(8, 'Case', 'Vỏ máy tính'),
(9, 'Cooling', 'Tản nhiệt'),
(10, 'Laptop', 'Máy tính xách tay'),
(11, 'Monitor', 'Màn hình'),
(12, 'Keyboard', 'Bàn phím'),
(13, 'Mouse', 'Chuột máy tính'),
(14, 'Headset', 'Tai nghe');

-- --------------------------------------------------------

--
-- Table structure for table `component_specs`
--

CREATE TABLE `component_specs` (
  `spec_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `spec_name` varchar(100) NOT NULL,
  `spec_value` varchar(255) NOT NULL,
  `spec_unit` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `component_specs`
--

INSERT INTO `component_specs` (`spec_id`, `product_id`, `spec_name`, `spec_value`, `spec_unit`) VALUES
(1, 1, 'SOCKET', 'LGA1700', NULL),
(2, 1, 'CORES', '14', 'Core'),
(3, 1, 'THREADS', '20', 'Thread'),
(4, 1, 'BASE_CLOCK', '3.5', 'GHz'),
(5, 1, 'MAX_TURBO_CLOCK', '5.3', 'GHz'),
(6, 1, 'TDP', '125', 'W'),
(7, 1, 'RAM_SUPPORT', 'DDR4 / DDR5', NULL),
(8, 2, 'SOCKET', 'AM5', NULL),
(9, 2, 'CORES', '6', 'Core'),
(10, 2, 'THREADS', '12', 'Thread'),
(11, 2, 'BASE_CLOCK', '4.7', 'GHz'),
(12, 2, 'MAX_TURBO_CLOCK', '5.3', 'GHz'),
(13, 2, 'TDP', '105', 'W'),
(14, 2, 'RAM_SUPPORT', 'DDR5', NULL),
(15, 3, 'SOCKET', 'AM5', NULL),
(16, 3, 'CHIPSET', 'B650', NULL),
(18, 3, 'RAM_SLOTS', '4', 'Slot'),
(19, 3, 'MAX_RAM', '128', 'GB'),
(22, 4, 'CAPACITY', '16', 'GB'),
(23, 4, 'SPEED', '5600', 'MHz'),
(24, 4, 'MODULE_COUNT', '1', 'Module'),
(25, 4, 'VOLTAGE', '1.25', 'V'),
(26, 5, 'VRAM', '8', 'GB'),
(27, 5, 'MEMORY_TYPE', 'GDDR6', NULL),
(28, 5, 'BOOST_CLOCK', '2490', 'MHz'),
(30, 5, 'POWER_CONSUMPTION', '115', 'W'),
(31, 5, 'INTERFACE', 'PCIe 4.0', NULL),
(33, 3, 'RAM_TYPE', 'DDR5', NULL),
(34, 4, 'RAM_TYPE', 'DDR5', NULL),
(38, 3, 'FORM_FACTOR', 'ATX', NULL),
(39, 5, 'RECOMMENDED_PSU', '550', 'W'),
(40, 5, 'GPU_LENGTH', '199', 'mm'),
(41, 9, 'WATTAGE', '650', 'W'),
(42, 10, 'SUPPORTED_FORM_FACTOR', 'MICRO_ATX,MINI_ITX', NULL),
(43, 10, 'MAX_GPU_LENGTH', '360', 'mm'),
(44, 11, 'WATTAGE', '450', 'W'),
(45, 12, 'SUPPORTED_FORM_FACTOR', 'ATX,MICRO_ATX,MINI_ITX', NULL),
(46, 12, 'MAX_GPU_LENGTH', '400', 'mm'),
(48, 7, 'SOCKET', 'LGA1700', NULL),
(49, 15, 'SOCKET', 'LGA1700', NULL),
(50, 16, 'SOCKET', 'LGA1700', NULL),
(51, 17, 'SOCKET', 'LGA1700', NULL),
(52, 18, 'SOCKET', 'LGA1700', NULL),
(53, 19, 'SOCKET', 'LGA1700', NULL),
(54, 19, 'RAM_TYPE', 'DDR5', NULL),
(55, 19, 'FORM_FACTOR', 'ATX', NULL),
(56, 20, 'SOCKET', 'LGA1700', NULL),
(57, 20, 'RAM_TYPE', 'DDR5', NULL),
(58, 20, 'FORM_FACTOR', 'ATX', NULL),
(59, 21, 'SOCKET', 'LGA1700', NULL),
(60, 21, 'RAM_TYPE', 'DDR5', NULL),
(61, 21, 'FORM_FACTOR', 'MATX', NULL),
(62, 22, 'SOCKET', 'LGA1700', NULL),
(63, 22, 'RAM_TYPE', 'DDR5', NULL),
(64, 22, 'FORM_FACTOR', 'ATX', NULL),
(65, 23, 'SOCKET', 'LGA1700', NULL),
(66, 23, 'RAM_TYPE', 'DDR5', NULL),
(67, 23, 'FORM_FACTOR', 'ATX', NULL),
(68, 24, 'RAM_TYPE', 'DDR5', NULL),
(69, 24, 'CAPACITY', '32', 'GB'),
(70, 25, 'RAM_TYPE', 'DDR5', NULL),
(71, 25, 'CAPACITY', '32', 'GB'),
(72, 26, 'RAM_TYPE', 'DDR5', NULL),
(73, 26, 'CAPACITY', '32', 'GB'),
(74, 27, 'RAM_TYPE', 'DDR5', NULL),
(75, 27, 'CAPACITY', '32', 'GB'),
(76, 28, 'RAM_TYPE', 'DDR5', NULL),
(77, 28, 'CAPACITY', '64', 'GB'),
(78, 29, 'RAM_TYPE', 'DDR5', NULL),
(79, 29, 'CAPACITY', '64', 'GB'),
(80, 30, 'RECOMMENDED_PSU', '550', 'W'),
(81, 30, 'GPU_LENGTH', '199', 'mm'),
(82, 31, 'RECOMMENDED_PSU', '650', 'W'),
(83, 31, 'GPU_LENGTH', '267', 'mm'),
(84, 32, 'RECOMMENDED_PSU', '700', 'W'),
(85, 32, 'GPU_LENGTH', '308', 'mm'),
(86, 33, 'RECOMMENDED_PSU', '850', 'W'),
(87, 33, 'GPU_LENGTH', '348', 'mm'),
(88, 34, 'RECOMMENDED_PSU', '550', 'W'),
(89, 34, 'GPU_LENGTH', '235', 'mm'),
(90, 35, 'RECOMMENDED_PSU', '550', 'W'),
(91, 35, 'GPU_LENGTH', '227', 'mm'),
(92, 36, 'WATTAGE', '650', 'W'),
(93, 37, 'WATTAGE', '750', 'W'),
(94, 38, 'WATTAGE', '850', 'W'),
(95, 39, 'WATTAGE', '850', 'W'),
(96, 40, 'WATTAGE', '1000', 'W'),
(97, 41, 'SUPPORTED_FORM_FACTOR', 'ATX,MATX', NULL),
(98, 41, 'MAX_GPU_LENGTH', '410', 'mm'),
(99, 42, 'SUPPORTED_FORM_FACTOR', 'ATX,MATX', NULL),
(100, 42, 'MAX_GPU_LENGTH', '360', 'mm'),
(101, 43, 'SUPPORTED_FORM_FACTOR', 'ATX,MATX', NULL),
(102, 43, 'MAX_GPU_LENGTH', '400', 'mm'),
(103, 44, 'SUPPORTED_FORM_FACTOR', 'ATX,MATX', NULL),
(104, 44, 'MAX_GPU_LENGTH', '410', 'mm'),
(105, 45, 'SUPPORTED_FORM_FACTOR', 'ATX,MATX', NULL),
(106, 45, 'MAX_GPU_LENGTH', '350', 'mm'),
(107, 46, 'INTERFACE', 'NVME', NULL),
(108, 46, 'CAPACITY', '1', 'TB'),
(109, 47, 'INTERFACE', 'NVME', NULL),
(110, 47, 'CAPACITY', '2', 'TB'),
(111, 48, 'INTERFACE', 'NVME', NULL),
(112, 48, 'CAPACITY', '1', 'TB'),
(113, 49, 'INTERFACE', 'NVME', NULL),
(114, 49, 'CAPACITY', '2', 'TB'),
(115, 3, 'M2_SLOTS', '3', 'Khe'),
(116, 3, 'SATA_PORTS', '4', 'Cong'),
(117, 19, 'RAM_SLOTS', '4', 'Khe'),
(118, 19, 'M2_SLOTS', '4', 'Khe'),
(119, 19, 'SATA_PORTS', '4', 'Cong'),
(120, 20, 'RAM_SLOTS', '4', 'Khe'),
(121, 20, 'M2_SLOTS', '3', 'Khe'),
(122, 20, 'SATA_PORTS', '4', 'Cong'),
(123, 21, 'RAM_SLOTS', '4', 'Khe'),
(124, 21, 'M2_SLOTS', '2', 'Khe'),
(125, 21, 'SATA_PORTS', '4', 'Cong'),
(126, 22, 'RAM_SLOTS', '4', 'Khe'),
(127, 22, 'M2_SLOTS', '4', 'Khe'),
(128, 22, 'SATA_PORTS', '7', 'Cong'),
(129, 23, 'RAM_SLOTS', '4', 'Khe'),
(130, 23, 'M2_SLOTS', '3', 'Khe'),
(131, 23, 'SATA_PORTS', '4', 'Cong'),
(132, 51, 'INTERFACE', 'SATA', NULL),
(133, 51, 'CAPACITY', '2', 'TB'),
(134, 51, 'RPM', '7200', 'rpm'),
(135, 52, 'INTERFACE', 'SATA', NULL),
(136, 52, 'CAPACITY', '4', 'TB'),
(137, 52, 'RPM', '5400', 'rpm'),
(138, 53, 'INTERFACE', 'SATA', NULL),
(139, 53, 'CAPACITY', '1', 'TB'),
(140, 53, 'RPM', '7200', 'rpm'),
(141, 54, 'TYPE', 'Tản nhiệt khí', NULL),
(142, 54, 'FAN_SIZE', '120', 'mm'),
(143, 55, 'TYPE', 'Tản nhiệt khí', NULL),
(144, 55, 'FAN_SIZE', '120', 'mm'),
(145, 56, 'TYPE', 'Tản nhiệt khí', NULL),
(146, 56, 'FAN_SIZE', '140', 'mm'),
(147, 57, 'TYPE', 'Tản nhiệt nước AIO', NULL),
(148, 57, 'RADIATOR_SIZE', '360', 'mm'),
(149, 58, 'CPU', 'Intel Core i5-12500H', NULL),
(150, 58, 'RAM', '16', 'GB'),
(151, 58, 'STORAGE', '512', 'GB'),
(152, 58, 'SCREEN', '15.6 FHD 144Hz', NULL),
(153, 59, 'CPU', 'Intel Core i5-13420H', NULL),
(154, 59, 'RAM', '16', 'GB'),
(155, 59, 'STORAGE', '512', 'GB'),
(156, 59, 'SCREEN', '15.6 FHD 144Hz', NULL),
(157, 60, 'CPU', 'Intel Core i7-13620H', NULL),
(158, 60, 'RAM', '16', 'GB'),
(159, 60, 'STORAGE', '512', 'GB'),
(160, 60, 'SCREEN', '15.6 FHD 165Hz', NULL),
(161, 61, 'SIZE', '23.8', 'inch'),
(162, 61, 'RESOLUTION', '1920x1080', NULL),
(163, 61, 'REFRESH_RATE', '165', 'Hz'),
(164, 61, 'PANEL', 'IPS', NULL),
(165, 62, 'SIZE', '27', 'inch'),
(166, 62, 'RESOLUTION', '2560x1440', NULL),
(167, 62, 'REFRESH_RATE', '165', 'Hz'),
(168, 62, 'PANEL', 'IPS', NULL),
(169, 63, 'SIZE', '27', 'inch'),
(170, 63, 'RESOLUTION', '2560x1440', NULL),
(171, 63, 'REFRESH_RATE', '165', 'Hz'),
(172, 63, 'PANEL', 'VA cong 1000R', NULL),
(173, 64, 'SIZE', '27', 'inch'),
(174, 64, 'RESOLUTION', '2560x1440', NULL),
(175, 64, 'REFRESH_RATE', '180', 'Hz'),
(176, 64, 'PANEL', 'Nano IPS', NULL),
(177, 65, 'LAYOUT', '65%', NULL),
(178, 65, 'CONNECTION', 'Bluetooth / 2.4G / USB-C', NULL),
(179, 65, 'SWITCH', 'AKKO CS', NULL),
(180, 66, 'LAYOUT', '75%', NULL),
(181, 66, 'CONNECTION', 'Bluetooth / USB-C', NULL),
(182, 66, 'SWITCH', 'Gateron Brown', NULL),
(183, 67, 'LAYOUT', 'Full-size', NULL),
(184, 67, 'CONNECTION', 'USB', NULL),
(185, 67, 'SWITCH', 'Razer Green', NULL),
(186, 68, 'LAYOUT', 'TKL', NULL),
(187, 68, 'CONNECTION', 'Lightspeed / Bluetooth', NULL),
(188, 68, 'SWITCH', 'GX', NULL),
(189, 69, 'DPI', '8500', 'DPI'),
(190, 69, 'CONNECTION', 'Có dây', NULL),
(191, 69, 'BUTTONS', '6', NULL),
(192, 70, 'DPI', '25600', 'DPI'),
(193, 70, 'CONNECTION', 'Có dây', NULL),
(194, 70, 'BUTTONS', '11', NULL),
(195, 71, 'DPI', '30000', 'DPI'),
(196, 71, 'CONNECTION', 'HyperSpeed / Bluetooth', NULL),
(197, 71, 'WEIGHT', '63', 'g'),
(198, 72, 'DPI', '32000', 'DPI'),
(199, 72, 'CONNECTION', 'Lightspeed', NULL),
(200, 72, 'WEIGHT', '60', 'g'),
(201, 73, 'CONNECTION', 'Jack 3.5mm', NULL),
(202, 73, 'DRIVER', '50', 'mm'),
(203, 74, 'CONNECTION', 'Lightspeed / Bluetooth', NULL),
(204, 74, 'WEIGHT', '165', 'g'),
(205, 75, 'CONNECTION', 'USB / Jack 3.5mm', NULL),
(206, 75, 'DRIVER', '53', 'mm'),
(207, 76, 'CONNECTION', 'Jack 3.5mm', NULL),
(208, 76, 'DRIVER', '40', 'mm');

-- --------------------------------------------------------

--
-- Table structure for table `customer_email_history`
--

CREATE TABLE `customer_email_history` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `email_hash` char(64) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customer_email_history`
--

INSERT INTO `customer_email_history` (`id`, `user_id`, `email_hash`, `created_at`) VALUES
(1, 1, '2a6d03765797dd4faacfb20776eb673706ab3a17495a57ccbb9a5bd4e16ea722', '2026-10-20 08:12:08'),
(2, 2, 'e4dce4df2d247e3fbb14f601175d44fe3921a322781cbdc232fa7c0cc16b561c', '2026-10-20 08:12:08'),
(3, 3, 'e439043f82879e9c7ebca0e0dfd2d4ab3d3fa6cc54ea3069402151cdc88c5541', '2026-10-20 08:12:08'),
(4, 4, '69e6267c53626874ae2ad01d9acae62c21ddfc993ae0967df0a69e13ea2747d7', '2026-10-20 08:12:08'),
(5, 5, '6f8abfbcf2a0cb1eaefc56f0f1a562ad9675a7e17ddd559752be0f9f094f04bd', '2026-10-20 08:12:08'),
(6, 6, 'd6ba958f751607bd937dd597602c25e746d4153772f759caf20dcd0ebdc4bb9c', '2026-10-20 08:12:08'),
(7, 7, '1ac69dd3be2693d85bd6fd2ab688e6b7376c443c245df175802c0df2f8e2f449', '2026-10-20 08:12:08'),
(8, 8, '2eeb6767ea98ec7f871f40e4d0e65256be92c788613da2be69668148fef219fc', '2026-10-20 08:12:08'),
(16, 10, '69e6267c53626874ae2ad01d9acae62c21ddfc993ae0967df0a69e13ea2747d7', '2026-10-20 08:16:02'),
(17, 11, '69e6267c53626874ae2ad01d9acae62c21ddfc993ae0967df0a69e13ea2747d7', '2026-10-20 08:37:16'),
(18, 12, '882ecc75a8c8ab735ee5a9223cd6cd5e6bef1eec2a5da7957cb2a8ff7b2ab6cb', '2026-10-20 08:41:29'),
(19, 13, 'f221e7d82b835de7bab094045e7dd90e0451500180497c8c7d4fb5ee19568280', '2026-10-20 08:45:24');

-- --------------------------------------------------------

--
-- Table structure for table `email_change_requests`
--

CREATE TABLE `email_change_requests` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `old_email` varchar(100) NOT NULL,
  `new_email` varchar(100) NOT NULL,
  `code_hash` varchar(100) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_verification_tokens`
--

CREATE TABLE `email_verification_tokens` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `code_hash` varchar(100) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_verification_tokens`
--

-- Dữ liệu bảng `email_verification_tokens` đã được lược bỏ trong bản mẫu (token / mã xác thực tạm thời).

-- --------------------------------------------------------

--
-- Table structure for table `inventory_movements`
--

CREATE TABLE `inventory_movements` (
  `id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `quantity_delta` int(11) NOT NULL,
  `quantity_before` int(11) NOT NULL,
  `quantity_after` int(11) NOT NULL,
  `action` varchar(32) NOT NULL,
  `actor` varchar(100) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `inventory_movements`
--

INSERT INTO `inventory_movements` (`id`, `product_id`, `order_id`, `quantity_delta`, `quantity_before`, `quantity_after`, `action`, `actor`, `note`, `created_at`) VALUES
(1, 4, NULL, 1, 5, 6, 'PRODUCT_EDIT', 'ADMIN', 'Thay đổi tồn kho khi sửa sản phẩm', '2026-10-13 15:36:52.000000'),
(2, 7, NULL, 5, 1, 6, 'MANUAL_IN', 'admin01', 'dot 1', '2026-10-13 15:37:13.000000'),
(3, 1, NULL, 11, 19, 30, 'MANUAL_IN', 'admin01', 'Nhập Hàng', '2026-10-13 16:04:11.000000'),
(4, 1, 23, -1, 30, 29, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 13:35:41.000000'),
(5, 1, 23, 1, 29, 30, 'ORDER_CANCEL', 'user11', 'Hoàn kho khi khách hủy đơn', '2026-10-14 13:36:55.000000'),
(6, 1, 24, -1, 30, 29, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 13:38:18.000000'),
(7, 1, 25, -1, 29, 28, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 14:19:39.000000'),
(8, 1, 26, -1, 28, 27, 'ORDER_OUT', 'user05', 'Xuất kho theo đơn hàng', '2026-10-14 14:51:09.000000'),
(9, 4, 26, -4, 6, 2, 'ORDER_OUT', 'user05', 'Xuất kho theo đơn hàng', '2026-10-14 14:51:09.000000'),
(10, 19, 26, -1, 8, 7, 'ORDER_OUT', 'user05', 'Xuất kho theo đơn hàng', '2026-10-14 14:51:09.000000'),
(11, 32, 26, -1, 7, 6, 'ORDER_OUT', 'user05', 'Xuất kho theo đơn hàng', '2026-10-14 14:51:09.000000'),
(12, 39, 26, -1, 9, 8, 'ORDER_OUT', 'user05', 'Xuất kho theo đơn hàng', '2026-10-14 14:51:09.000000'),
(13, 44, 26, -1, 12, 11, 'ORDER_OUT', 'user05', 'Xuất kho theo đơn hàng', '2026-10-14 14:51:09.000000'),
(14, 47, 26, -2, 12, 10, 'ORDER_OUT', 'user05', 'Xuất kho theo đơn hàng', '2026-10-14 14:51:09.000000'),
(15, 4, NULL, 5, 2, 7, 'MANUAL_IN', 'admin01', 'Test', '2026-10-14 14:55:13.000000'),
(16, 1, NULL, 3, 27, 30, 'MANUAL_IN', 'admin01', 'Đơn mới', '2026-10-14 15:12:44.000000'),
(17, 1, 27, -1, 30, 29, 'ORDER_OUT', 'user06', 'Xuất kho theo đơn hàng', '2026-10-14 20:10:20.000000'),
(18, 4, 27, -2, 7, 5, 'ORDER_OUT', 'user06', 'Xuất kho theo đơn hàng', '2026-10-14 20:10:20.000000'),
(19, 8, 27, -1, 8, 7, 'ORDER_OUT', 'user06', 'Xuất kho theo đơn hàng', '2026-10-14 20:10:20.000000'),
(20, 12, 27, -1, 7, 6, 'ORDER_OUT', 'user06', 'Xuất kho theo đơn hàng', '2026-10-14 20:10:20.000000'),
(21, 19, 27, -1, 7, 6, 'ORDER_OUT', 'user06', 'Xuất kho theo đơn hàng', '2026-10-14 20:10:20.000000'),
(22, 30, 27, -1, 9, 8, 'ORDER_OUT', 'user06', 'Xuất kho theo đơn hàng', '2026-10-14 20:10:20.000000'),
(23, 37, 27, -1, 13, 12, 'ORDER_OUT', 'user06', 'Xuất kho theo đơn hàng', '2026-10-14 20:10:20.000000'),
(24, 1, 28, -1, 29, 28, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 20:54:32.000000'),
(25, 2, 29, -1, 12, 11, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 21:11:53.000000'),
(26, 3, 29, -1, 9, 8, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 21:11:53.000000'),
(27, 4, 29, -2, 5, 3, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 21:11:53.000000'),
(28, 5, 29, -1, 8, 7, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 21:11:53.000000'),
(29, 8, 29, -1, 7, 6, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 21:11:53.000000'),
(30, 9, 29, -1, 7, 6, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 21:11:53.000000'),
(31, 12, 29, -1, 6, 5, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-14 21:11:53.000000'),
(32, 4, NULL, 20, 3, 23, 'MANUAL_IN', 'admin01', 'test', '2026-10-15 14:49:03.000000'),
(33, 2, 30, -1, 11, 10, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-15 15:00:13.000000'),
(34, 3, 30, -1, 8, 7, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-15 15:00:13.000000'),
(35, 4, 30, -4, 23, 19, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-15 15:00:13.000000'),
(36, 5, 30, -1, 7, 6, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-15 15:00:13.000000'),
(37, 8, 30, -4, 6, 2, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-15 15:00:13.000000'),
(38, 9, 30, -1, 6, 5, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-15 15:00:13.000000'),
(39, 12, 30, -1, 5, 4, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-15 15:00:13.000000'),
(40, 14, NULL, -6, 6, 0, 'MANUAL_OUT', 'admin01', 'het hang', '2026-10-16 13:30:48.000000'),
(41, 1, 31, -2, 28, 26, 'ORDER_OUT', 'admin01', 'Xuất kho theo đơn hàng', '2026-10-16 14:49:04.000000'),
(42, 1, 32, -2, 26, 24, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-20 14:12:22.000000'),
(43, 1, 33, -1, 24, 23, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-20 15:33:12.000000'),
(44, 2, 34, -6, 10, 4, 'ORDER_OUT', 'user12', 'Xuất kho theo đơn hàng', '2026-10-20 15:51:48.000000'),
(45, 2, NULL, 45, 4, 49, 'MANUAL_IN', 'admin01', 'Tes', '2026-10-20 15:54:59.000000'),
(46, 1, 35, -1, 23, 22, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:36:56.000000'),
(47, 7, 36, -2, 6, 4, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:39:12.000000'),
(48, 1, 37, -1, 22, 21, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:44:16.000000'),
(49, 19, 37, -1, 6, 5, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:44:16.000000'),
(50, 24, 37, -4, 18, 14, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:44:16.000000'),
(51, 33, 37, -1, 5, 4, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:44:16.000000'),
(52, 38, 37, -1, 10, 9, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:44:16.000000'),
(53, 41, 37, -1, 10, 9, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:44:16.000000'),
(54, 47, 37, -4, 10, 6, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:44:16.000000'),
(55, 7, 38, -1, 4, 3, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:45:18.000000'),
(56, 22, 38, -1, 8, 7, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:45:18.000000'),
(57, 29, 38, -4, 6, 2, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:45:18.000000'),
(58, 33, 38, -1, 4, 3, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:45:18.000000'),
(59, 40, 38, -1, 7, 6, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:45:18.000000'),
(60, 43, 38, -1, 8, 7, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:45:18.000000'),
(61, 47, 38, -4, 6, 2, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:45:18.000000'),
(62, 7, NULL, 20, 3, 23, 'MANUAL_IN', 'admin01', '1', '2026-10-22 12:46:26.000000'),
(63, 8, NULL, 50, 2, 52, 'MANUAL_IN', 'admin01', '123', '2026-10-22 12:46:35.000000'),
(64, 9, NULL, 30, 5, 35, 'MANUAL_IN', 'admin01', '1', '2026-10-22 12:46:42.000000'),
(65, 12, NULL, 25, 4, 29, 'MANUAL_IN', 'admin01', '123', '2026-10-22 12:46:48.000000'),
(66, 19, NULL, 30, 5, 35, 'MANUAL_IN', 'admin01', '123', '2026-10-22 12:46:57.000000'),
(67, 29, NULL, 50, 2, 52, 'MANUAL_IN', 'admin01', '123', '2026-10-22 12:47:02.000000'),
(68, 33, NULL, 52, 3, 55, 'MANUAL_IN', 'admin01', '123', '2026-10-22 12:47:09.000000'),
(69, 47, NULL, 50, 2, 52, 'MANUAL_IN', 'admin01', '123', '2026-10-22 12:47:13.000000'),
(70, 14, NULL, 11, 0, 11, 'MANUAL_IN', 'admin01', '123', '2026-10-22 12:47:22.000000'),
(71, 7, 39, -1, 23, 22, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:15.000000'),
(72, 22, 39, -1, 7, 6, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:15.000000'),
(73, 29, 39, -4, 52, 48, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:15.000000'),
(74, 33, 39, -1, 55, 54, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:15.000000'),
(75, 40, 39, -1, 6, 5, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:15.000000'),
(76, 43, 39, -1, 7, 6, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:15.000000'),
(77, 47, 39, -4, 52, 48, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:15.000000'),
(78, 7, 40, -1, 22, 21, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:34.000000'),
(79, 22, 40, -1, 6, 5, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:34.000000'),
(80, 29, 40, -4, 48, 44, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:34.000000'),
(81, 33, 40, -1, 54, 53, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:34.000000'),
(82, 40, 40, -1, 5, 4, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:34.000000'),
(83, 43, 40, -1, 6, 5, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:34.000000'),
(84, 47, 40, -4, 48, 44, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 12:48:34.000000'),
(85, 1, 41, -1, 21, 20, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 22:06:54.000000'),
(86, 7, 41, -1, 21, 20, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-22 22:06:54.000000'),
(87, 1, 42, -1, 20, 19, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-30 23:02:35.000000'),
(88, 1, 43, -1, 19, 18, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-30 23:11:07.000000'),
(89, 1, 44, -1, 18, 17, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-30 23:14:07.000000'),
(90, 1, 45, -1, 17, 16, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-30 23:20:25.000000'),
(91, 1, 46, -1, 16, 15, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-31 00:38:55.000000'),
(92, 1, 47, -1, 15, 14, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-31 00:53:42.000000'),
(93, 1, 48, -1, 14, 13, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-10-31 01:18:12.000000'),
(94, 50, NULL, 50, 0, 50, 'MANUAL_IN', 'admin01', 'test', '2026-11-02 13:33:53.000000'),
(95, 1, 49, -1, 13, 12, 'ORDER_OUT', 'user11', 'Xuất kho theo đơn hàng', '2026-11-02 16:12:17.000000');

-- --------------------------------------------------------

--
-- Table structure for table `invoice_print_requests`
--

CREATE TABLE `invoice_print_requests` (
  `request_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'PENDING',
  `requested_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `processed_at` datetime(6) DEFAULT NULL,
  `processed_by` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `invoice_print_requests`
--

INSERT INTO `invoice_print_requests` (`request_id`, `order_id`, `user_id`, `status`, `requested_at`, `processed_at`, `processed_by`) VALUES
(1, 35, 11, 'PROCESSED', '2026-10-22 12:37:22.000000', '2026-10-22 12:37:59.000000', 'admin01'),
(2, 36, 11, 'PROCESSED', '2026-10-22 12:39:43.000000', '2026-10-22 12:41:09.000000', 'admin01');

-- --------------------------------------------------------

--
-- Table structure for table `member_benefit_usage`
--

CREATE TABLE `member_benefit_usage` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `benefit_type` varchar(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'USED',
  `used_at` datetime(6) DEFAULT NULL,
  `released_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `recipient_name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `shipping_address` varchar(255) NOT NULL,
  `original_amount` decimal(15,2) NOT NULL,
  `discount_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `promotion_code` varchar(50) DEFAULT NULL,
  `total_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `status` varchar(30) NOT NULL DEFAULT 'PENDING',
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `member_discount_type` varchar(20) DEFAULT NULL,
  `member_discount_percent` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `recipient_name`, `phone`, `shipping_address`, `original_amount`, `discount_amount`, `promotion_code`, `total_amount`, `status`, `note`, `created_at`, `updated_at`, `member_discount_type`, `member_discount_percent`) VALUES
(1, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 11770000.00, 0.00, NULL, 11770000.00, 'CANCELLED', 'Giao hàng giờ hành chính', '2026-09-28 07:14:18', '2026-09-30 13:22:04', NULL, NULL),
(2, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 1390000.00, 0.00, NULL, 1390000.00, 'COMPLETED', 'Đơn test trạng thái', '2026-09-29 02:09:21', '2026-09-30 13:22:04', NULL, NULL),
(3, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 1390000.00, 0.00, NULL, 1390000.00, 'COMPLETED', 'Test thanh toán COD', '2026-09-29 03:26:53', '2026-09-30 13:22:04', NULL, NULL),
(5, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 1390000.00, 208500.00, 'WELCOME15', 1181500.00, 'CANCELLED', 'Test promotion WELCOME15', '2026-09-30 13:46:33', '2026-10-05 09:51:48', NULL, NULL),
(6, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 1390000.00, 0.00, NULL, 1390000.00, 'COMPLETED', 'Test checkout không dùng promotion', '2026-09-30 14:01:16', '2026-10-13 09:05:40', NULL, NULL),
(7, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 69750000.00, 0.00, NULL, 69750000.00, 'COMPLETED', 'Giao hàng giờ hành chính', '2026-10-02 09:27:58', '2026-10-13 09:05:31', NULL, NULL),
(8, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 8880000.00, 0.00, NULL, 8880000.00, 'COMPLETED', 'giao giờ hành chính', '2026-10-05 09:45:32', '2026-10-06 06:39:35', NULL, NULL),
(9, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 2780000.00, 0.00, NULL, 2780000.00, 'COMPLETED', NULL, '2026-10-09 01:37:56', '2026-10-09 01:38:49', NULL, NULL),
(10, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 15000000.00, 300000.00, 'SALE10', 14700000.00, 'CANCELLED', NULL, '2026-10-12 06:57:24', '2026-10-12 07:33:12', NULL, NULL),
(11, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 20000.00, 0.00, NULL, 20000.00, 'CANCELLED', NULL, '2026-10-12 07:07:08', '2026-10-12 07:33:09', NULL, NULL),
(12, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 1390000.00, 139000.00, 'SALE10', 1251000.00, 'COMPLETED', NULL, '2026-10-12 07:07:38', '2026-10-12 07:14:24', NULL, NULL),
(13, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 20000.00, 0.00, NULL, 20000.00, 'CANCELLED', NULL, '2026-10-12 07:28:31', '2026-10-12 07:33:03', NULL, NULL),
(14, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 5990000.00, 300000.00, 'SALE10', 5690000.00, 'COMPLETED', NULL, '2026-10-12 07:33:35', '2026-10-13 09:05:13', NULL, NULL),
(15, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 4990000.00, 300000.00, 'SALE10', 4690000.00, 'COMPLETED', NULL, '2026-10-12 07:34:49', '2026-10-12 07:42:06', NULL, NULL),
(16, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 4170000.00, 625500.00, 'WELCOME15', 3544500.00, 'COMPLETED', NULL, '2026-10-12 07:45:12', '2026-10-12 07:45:43', NULL, NULL),
(17, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 45730000.00, 0.00, NULL, 45730000.00, 'COMPLETED', NULL, '2026-10-12 08:06:51', '2026-10-12 08:07:08', NULL, NULL),
(18, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 1390000.00, 0.00, NULL, 1390000.00, 'CANCELLED', NULL, '2026-10-13 00:48:03', '2026-10-13 00:48:20', NULL, NULL),
(19, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 1390000.00, 0.00, NULL, 1390000.00, 'COMPLETED', NULL, '2026-10-13 00:49:40', '2026-10-13 09:05:08', NULL, NULL),
(22, 1, 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 1390000.00, 139000.00, 'SALE10', 1251000.00, 'COMPLETED', NULL, '2026-10-13 02:09:32', '2026-10-13 09:05:20', NULL, NULL),
(23, 4, 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 7490000.00, 0.00, NULL, 7490000.00, 'CANCELLED', NULL, '2026-10-14 06:35:41', '2026-10-14 06:36:55', NULL, NULL),
(24, 4, 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 7490000.00, 0.00, NULL, 7490000.00, 'COMPLETED', NULL, '2026-10-14 06:38:18', '2026-10-14 06:38:34', NULL, NULL),
(25, 4, 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 7490000.00, 300000.00, 'SALE10', 7190000.00, 'COMPLETED', NULL, '2026-10-14 07:19:39', '2026-10-14 07:19:59', NULL, NULL),
(26, 5, 'Phạm Minh Đức', '0901000005', '45 Cách Mạng Tháng 8, Quận 10, TP.HCM', 58890000.00, 2000000.00, 'SALE20', 56890000.00, 'COMPLETED', NULL, '2026-10-14 07:51:09', '2026-10-14 07:51:25', NULL, NULL),
(27, 6, 'Hoàng Thị Lan', '0901000006', '7 Phạm Văn Đồng, TP. Thủ Đức, TP.HCM', 36920000.00, 2000000.00, 'SALE20', 34920000.00, 'COMPLETED', NULL, '2026-10-14 13:10:20', '2026-10-14 13:11:24', NULL, NULL),
(28, 4, 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 7490000.00, 300000.00, 'SALE10', 7190000.00, 'COMPLETED', NULL, '2026-10-14 13:54:32', '2026-10-14 13:54:49', NULL, NULL),
(29, 4, 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 28620000.00, 0.00, NULL, 28620000.00, 'COMPLETED', NULL, '2026-10-14 14:11:53', '2026-10-14 14:12:05', NULL, NULL),
(30, 4, 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 38570000.00, 2000000.00, 'SALE20', 36570000.00, 'COMPLETED', NULL, '2026-10-15 08:00:13', '2026-10-15 08:00:27', NULL, NULL),
(31, 2, 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 14980000.00, 300000.00, 'SALE10', 14680000.00, 'COMPLETED', NULL, '2026-10-16 07:49:04', '2026-10-16 07:50:07', NULL, NULL),
(32, 4, 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 14980000.00, 0.00, NULL, 14980000.00, 'COMPLETED', NULL, '2026-10-20 07:12:22', '2026-10-20 07:18:00', NULL, NULL),
(33, 10, 'Bùi Văn Nam', '0901000010', '102 Võ Văn Tần, Quận 3, TP.HCM', 7490000.00, 749000.00, 'TEST10', 6741000.00, 'COMPLETED', NULL, '2026-10-20 08:33:12', '2026-10-20 08:33:36', NULL, NULL),
(34, 12, 'Đỗ Minh Tuấn', '0901000012', '5 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 35940000.00, 0.00, NULL, 35940000.00, 'COMPLETED', NULL, '2026-10-20 08:51:48', '2026-10-20 08:55:41', NULL, NULL),
(35, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 7490000.00, 0.00, NULL, 7490000.00, 'COMPLETED', NULL, '2026-10-22 05:36:56', '2026-10-22 05:37:44', NULL, NULL),
(36, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 30000000.00, 0.00, NULL, 30000000.00, 'COMPLETED', NULL, '2026-10-22 05:39:12', '2026-10-22 05:39:36', NULL, NULL),
(37, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 81770000.00, 0.00, NULL, 81770000.00, 'COMPLETED', NULL, '2026-10-22 05:44:16', '2026-10-22 05:48:59', NULL, NULL),
(38, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 110080000.00, 0.00, NULL, 110080000.00, 'COMPLETED', NULL, '2026-10-22 05:45:18', '2026-10-22 05:48:54', NULL, NULL),
(39, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 110080000.00, 0.00, NULL, 110080000.00, 'COMPLETED', NULL, '2026-10-22 05:48:15', '2026-10-22 05:48:48', NULL, NULL),
(40, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 110080000.00, 0.00, NULL, 110080000.00, 'COMPLETED', NULL, '2026-10-22 05:48:34', '2026-10-22 05:48:43', NULL, NULL),
(41, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 22490000.00, 6747000.00, 'VIP-KH000011', 15743000.00, 'COMPLETED', NULL, '2026-10-22 15:06:54', '2026-10-22 15:08:12', 'VIP', 30.00),
(42, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2500.00, 'BLACK-FRIDAY', 7500.00, 'CONFIRMED', NULL, '2026-10-30 16:02:35', '2026-10-30 16:03:57', NULL, NULL),
(43, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2000.00, 'VIP-KH000011', 8000.00, 'CONFIRMED', NULL, '2026-10-30 16:11:07', '2026-10-30 16:15:16', 'VIP', 20.00),
(44, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2000.00, 'VIP-KH000011', 8000.00, 'CONFIRMED', NULL, '2026-10-30 16:14:07', '2026-10-30 16:15:20', 'VIP', 20.00),
(45, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2000.00, 'VIP-KH000011', 8000.00, 'PENDING', NULL, '2026-10-30 16:20:25', '2026-10-30 16:20:25', 'VIP', 20.00),
(46, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2000.00, 'VIP-KH000011', 8000.00, 'PENDING', NULL, '2026-10-30 17:38:55', '2026-10-30 17:38:55', 'VIP', 20.00),
(47, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2000.00, 'VIP-KH000011', 8000.00, 'CONFIRMED', NULL, '2026-10-30 17:53:42', '2026-11-02 09:15:56', 'VIP', 20.00),
(48, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2000.00, 'VIP-KH000011', 8000.00, 'CONFIRMED', NULL, '2026-10-30 18:18:12', '2026-10-30 18:18:38', 'VIP', 20.00),
(49, 11, 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 10000.00, 2000.00, 'VIP-KH000011', 8000.00, 'CONFIRMED', NULL, '2026-11-02 09:12:17', '2026-11-02 09:14:02', 'VIP', 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `subtotal` decimal(15,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `discount_amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `discount_label` varchar(60) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `price`, `subtotal`, `created_at`, `discount_amount`, `discount_label`) VALUES
(1, 1, 5, 1, 8990000.00, 8990000.00, '2026-09-28 07:14:18', 0.00, NULL),
(2, 1, 4, 2, 1390000.00, 2780000.00, '2026-09-28 07:14:18', 0.00, NULL),
(3, 2, 4, 1, 1390000.00, 1390000.00, '2026-09-29 02:09:21', 0.00, NULL),
(4, 3, 4, 1, 1390000.00, 1390000.00, '2026-09-29 03:26:53', 0.00, NULL),
(6, 5, 4, 1, 1390000.00, 1390000.00, '2026-09-30 13:46:33', 0.00, NULL),
(7, 6, 4, 1, 1390000.00, 1390000.00, '2026-09-30 14:01:16', 0.00, NULL),
(8, 7, 4, 13, 1390000.00, 18070000.00, '2026-10-02 09:27:58', 0.00, NULL),
(9, 7, 3, 2, 4990000.00, 9980000.00, '2026-10-02 09:27:58', 0.00, NULL),
(10, 7, 2, 2, 5990000.00, 11980000.00, '2026-10-02 09:27:58', 0.00, NULL),
(11, 7, 5, 2, 8990000.00, 17980000.00, '2026-10-02 09:27:58', 0.00, NULL),
(12, 7, 8, 2, 2390000.00, 4780000.00, '2026-10-02 09:27:58', 0.00, NULL),
(13, 7, 9, 2, 1590000.00, 3180000.00, '2026-10-02 09:27:58', 0.00, NULL),
(14, 7, 12, 2, 1890000.00, 3780000.00, '2026-10-02 09:27:58', 0.00, NULL),
(15, 8, 4, 1, 1390000.00, 1390000.00, '2026-10-05 09:45:32', 0.00, NULL),
(16, 8, 1, 1, 7490000.00, 7490000.00, '2026-10-05 09:45:32', 0.00, NULL),
(17, 9, 4, 2, 1390000.00, 2780000.00, '2026-10-09 01:37:56', 0.00, NULL),
(18, 10, 7, 1, 15000000.00, 15000000.00, '2026-10-12 06:57:24', 0.00, NULL),
(19, 11, 14, 1, 20000.00, 20000.00, '2026-10-12 07:07:08', 0.00, NULL),
(20, 12, 4, 1, 1390000.00, 1390000.00, '2026-10-12 07:07:38', 0.00, NULL),
(21, 13, 14, 1, 20000.00, 20000.00, '2026-10-12 07:28:31', 0.00, NULL),
(22, 14, 2, 1, 5990000.00, 5990000.00, '2026-10-12 07:33:35', 0.00, NULL),
(23, 15, 3, 1, 4990000.00, 4990000.00, '2026-10-12 07:34:49', 0.00, NULL),
(24, 16, 4, 3, 1390000.00, 4170000.00, '2026-10-12 07:45:13', 0.00, NULL),
(25, 17, 7, 1, 15000000.00, 15000000.00, '2026-10-12 08:06:51', 0.00, NULL),
(26, 17, 9, 1, 1590000.00, 1590000.00, '2026-10-12 08:06:51', 0.00, NULL),
(27, 17, 12, 1, 1890000.00, 1890000.00, '2026-10-12 08:06:51', 0.00, NULL),
(28, 17, 19, 1, 7490000.00, 7490000.00, '2026-10-12 08:06:51', 0.00, NULL),
(29, 17, 24, 2, 2490000.00, 4980000.00, '2026-10-12 08:06:51', 0.00, NULL),
(30, 17, 30, 1, 11990000.00, 11990000.00, '2026-10-12 08:06:51', 0.00, NULL),
(31, 17, 46, 1, 2790000.00, 2790000.00, '2026-10-12 08:06:51', 0.00, NULL),
(32, 18, 4, 1, 1390000.00, 1390000.00, '2026-10-13 00:48:03', 0.00, NULL),
(33, 19, 4, 1, 1390000.00, 1390000.00, '2026-10-13 00:49:40', 0.00, NULL),
(36, 22, 4, 1, 1390000.00, 1390000.00, '2026-10-13 02:09:32', 0.00, NULL),
(37, 23, 1, 1, 7490000.00, 7490000.00, '2026-10-14 06:35:41', 0.00, NULL),
(38, 24, 1, 1, 7490000.00, 7490000.00, '2026-10-14 06:38:18', 0.00, NULL),
(39, 25, 1, 1, 7490000.00, 7490000.00, '2026-10-14 07:19:39', 0.00, NULL),
(40, 26, 1, 1, 7490000.00, 7490000.00, '2026-10-14 07:51:09', 0.00, NULL),
(41, 26, 4, 4, 1390000.00, 5560000.00, '2026-10-14 07:51:09', 0.00, NULL),
(42, 26, 19, 1, 7490000.00, 7490000.00, '2026-10-14 07:51:09', 0.00, NULL),
(43, 26, 32, 1, 23990000.00, 23990000.00, '2026-10-14 07:51:09', 0.00, NULL),
(44, 26, 39, 1, 3190000.00, 3190000.00, '2026-10-14 07:51:09', 0.00, NULL),
(45, 26, 44, 1, 2190000.00, 2190000.00, '2026-10-14 07:51:09', 0.00, NULL),
(46, 26, 47, 2, 4490000.00, 8980000.00, '2026-10-14 07:51:09', 0.00, NULL),
(47, 27, 1, 1, 7490000.00, 7490000.00, '2026-10-14 13:10:20', 0.00, NULL),
(48, 27, 4, 2, 1390000.00, 2780000.00, '2026-10-14 13:10:20', 0.00, NULL),
(49, 27, 8, 1, 2390000.00, 2390000.00, '2026-10-14 13:10:20', 0.00, NULL),
(50, 27, 12, 1, 1890000.00, 1890000.00, '2026-10-14 13:10:20', 0.00, NULL),
(51, 27, 19, 1, 7490000.00, 7490000.00, '2026-10-14 13:10:20', 0.00, NULL),
(52, 27, 30, 1, 11990000.00, 11990000.00, '2026-10-14 13:10:20', 0.00, NULL),
(53, 27, 37, 1, 2890000.00, 2890000.00, '2026-10-14 13:10:20', 0.00, NULL),
(54, 28, 1, 1, 7490000.00, 7490000.00, '2026-10-14 13:54:32', 0.00, NULL),
(55, 29, 2, 1, 5990000.00, 5990000.00, '2026-10-14 14:11:53', 0.00, NULL),
(56, 29, 3, 1, 4990000.00, 4990000.00, '2026-10-14 14:11:53', 0.00, NULL),
(57, 29, 4, 2, 1390000.00, 2780000.00, '2026-10-14 14:11:53', 0.00, NULL),
(58, 29, 5, 1, 8990000.00, 8990000.00, '2026-10-14 14:11:53', 0.00, NULL),
(59, 29, 8, 1, 2390000.00, 2390000.00, '2026-10-14 14:11:53', 0.00, NULL),
(60, 29, 9, 1, 1590000.00, 1590000.00, '2026-10-14 14:11:53', 0.00, NULL),
(61, 29, 12, 1, 1890000.00, 1890000.00, '2026-10-14 14:11:53', 0.00, NULL),
(62, 30, 2, 1, 5990000.00, 5990000.00, '2026-10-15 08:00:13', 0.00, NULL),
(63, 30, 3, 1, 4990000.00, 4990000.00, '2026-10-15 08:00:13', 0.00, NULL),
(64, 30, 4, 4, 1390000.00, 5560000.00, '2026-10-15 08:00:13', 0.00, NULL),
(65, 30, 5, 1, 8990000.00, 8990000.00, '2026-10-15 08:00:13', 0.00, NULL),
(66, 30, 8, 4, 2390000.00, 9560000.00, '2026-10-15 08:00:13', 0.00, NULL),
(67, 30, 9, 1, 1590000.00, 1590000.00, '2026-10-15 08:00:13', 0.00, NULL),
(68, 30, 12, 1, 1890000.00, 1890000.00, '2026-10-15 08:00:13', 0.00, NULL),
(69, 31, 1, 2, 7490000.00, 14980000.00, '2026-10-16 07:49:04', 0.00, NULL),
(70, 32, 1, 2, 7490000.00, 14980000.00, '2026-10-20 07:12:22', 0.00, NULL),
(71, 33, 1, 1, 7490000.00, 7490000.00, '2026-10-20 08:33:12', 0.00, NULL),
(72, 34, 2, 6, 5990000.00, 35940000.00, '2026-10-20 08:51:48', 0.00, NULL),
(73, 35, 1, 1, 7490000.00, 7490000.00, '2026-10-22 05:36:56', 0.00, NULL),
(74, 36, 7, 2, 15000000.00, 30000000.00, '2026-10-22 05:39:12', 0.00, NULL),
(75, 37, 1, 1, 7490000.00, 7490000.00, '2026-10-22 05:44:16', 0.00, NULL),
(76, 37, 19, 1, 7490000.00, 7490000.00, '2026-10-22 05:44:16', 0.00, NULL),
(77, 37, 24, 4, 2490000.00, 9960000.00, '2026-10-22 05:44:16', 0.00, NULL),
(78, 37, 33, 1, 32990000.00, 32990000.00, '2026-10-22 05:44:16', 0.00, NULL),
(79, 37, 38, 1, 3390000.00, 3390000.00, '2026-10-22 05:44:16', 0.00, NULL),
(80, 37, 41, 1, 2490000.00, 2490000.00, '2026-10-22 05:44:16', 0.00, NULL),
(81, 37, 47, 4, 4490000.00, 17960000.00, '2026-10-22 05:44:16', 0.00, NULL),
(82, 38, 7, 1, 15000000.00, 15000000.00, '2026-10-22 05:45:18', 0.00, NULL),
(83, 38, 22, 1, 7990000.00, 7990000.00, '2026-10-22 05:45:18', 0.00, NULL),
(84, 38, 29, 4, 6990000.00, 27960000.00, '2026-10-22 05:45:18', 0.00, NULL),
(85, 38, 33, 1, 32990000.00, 32990000.00, '2026-10-22 05:45:18', 0.00, NULL),
(86, 38, 40, 1, 4290000.00, 4290000.00, '2026-10-22 05:45:18', 0.00, NULL),
(87, 38, 43, 1, 3890000.00, 3890000.00, '2026-10-22 05:45:18', 0.00, NULL),
(88, 38, 47, 4, 4490000.00, 17960000.00, '2026-10-22 05:45:18', 0.00, NULL),
(89, 39, 7, 1, 15000000.00, 15000000.00, '2026-10-22 05:48:15', 0.00, NULL),
(90, 39, 22, 1, 7990000.00, 7990000.00, '2026-10-22 05:48:15', 0.00, NULL),
(91, 39, 29, 4, 6990000.00, 27960000.00, '2026-10-22 05:48:15', 0.00, NULL),
(92, 39, 33, 1, 32990000.00, 32990000.00, '2026-10-22 05:48:15', 0.00, NULL),
(93, 39, 40, 1, 4290000.00, 4290000.00, '2026-10-22 05:48:15', 0.00, NULL),
(94, 39, 43, 1, 3890000.00, 3890000.00, '2026-10-22 05:48:15', 0.00, NULL),
(95, 39, 47, 4, 4490000.00, 17960000.00, '2026-10-22 05:48:15', 0.00, NULL),
(96, 40, 7, 1, 15000000.00, 15000000.00, '2026-10-22 05:48:34', 0.00, NULL),
(97, 40, 22, 1, 7990000.00, 7990000.00, '2026-10-22 05:48:34', 0.00, NULL),
(98, 40, 29, 4, 6990000.00, 27960000.00, '2026-10-22 05:48:34', 0.00, NULL),
(99, 40, 33, 1, 32990000.00, 32990000.00, '2026-10-22 05:48:34', 0.00, NULL),
(100, 40, 40, 1, 4290000.00, 4290000.00, '2026-10-22 05:48:34', 0.00, NULL),
(101, 40, 43, 1, 3890000.00, 3890000.00, '2026-10-22 05:48:34', 0.00, NULL),
(102, 40, 47, 4, 4490000.00, 17960000.00, '2026-10-22 05:48:34', 0.00, NULL),
(103, 41, 1, 1, 7490000.00, 7490000.00, '2026-10-22 15:06:54', 0.00, NULL),
(104, 41, 7, 1, 15000000.00, 15000000.00, '2026-10-22 15:06:54', 0.00, NULL),
(105, 42, 1, 1, 10000.00, 10000.00, '2026-10-30 16:02:35', 0.00, NULL),
(106, 43, 1, 1, 10000.00, 10000.00, '2026-10-30 16:11:07', 0.00, NULL),
(107, 44, 1, 1, 10000.00, 10000.00, '2026-10-30 16:14:07', 0.00, NULL),
(108, 45, 1, 1, 10000.00, 10000.00, '2026-10-30 16:20:25', 0.00, NULL),
(109, 46, 1, 1, 10000.00, 10000.00, '2026-10-30 17:38:55', 0.00, NULL),
(110, 47, 1, 1, 10000.00, 10000.00, '2026-10-30 17:53:42', 0.00, NULL),
(111, 48, 1, 1, 10000.00, 10000.00, '2026-10-30 18:18:12', 0.00, NULL),
(112, 49, 1, 1, 10000.00, 10000.00, '2026-11-02 09:12:17', 2000.00, 'VIP -20%');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `token_hash` char(64) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `password_reset_tokens`
--

-- Dữ liệu bảng `password_reset_tokens` đã được lược bỏ trong bản mẫu (token / mã xác thực tạm thời).

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `payment_method` varchar(30) NOT NULL,
  `payment_status` varchar(30) NOT NULL DEFAULT 'PENDING',
  `amount` decimal(15,2) NOT NULL,
  `transaction_code` varchar(100) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `order_id`, `payment_method`, `payment_status`, `amount`, `transaction_code`, `paid_at`, `created_at`, `updated_at`) VALUES
(1, 3, 'COD', 'PAID', 1390000.00, NULL, '2026-09-29 11:48:40', '2026-09-29 03:26:53', '2026-09-29 11:48:40'),
(2, 5, 'COD', 'PENDING', 1181500.00, NULL, NULL, '2026-09-30 13:46:33', '2026-09-30 13:46:33'),
(3, 6, 'COD', 'PAID', 1390000.00, NULL, '2026-10-13 09:05:43', '2026-09-30 14:01:16', '2026-10-13 09:05:43'),
(4, 7, 'COD', 'PAID', 69750000.00, NULL, '2026-10-13 09:05:33', '2026-10-02 09:27:58', '2026-10-13 09:05:33'),
(5, 8, 'COD', 'PAID', 8880000.00, NULL, '2026-10-06 06:39:48', '2026-10-05 09:45:32', '2026-10-06 06:39:48'),
(6, 9, 'COD', 'PAID', 2780000.00, NULL, '2026-10-09 01:38:53', '2026-10-09 01:37:56', '2026-10-09 01:38:53'),
(7, 10, 'BANK_TRANSFER', 'PENDING', 14700000.00, NULL, NULL, '2026-10-12 06:57:24', '2026-10-12 06:57:24'),
(8, 11, 'BANK_TRANSFER', 'PENDING', 20000.00, NULL, NULL, '2026-10-12 07:07:08', '2026-10-12 07:07:08'),
(9, 12, 'COD', 'PENDING', 1251000.00, NULL, NULL, '2026-10-12 07:07:38', '2026-10-12 07:07:38'),
(10, 13, 'BANK_TRANSFER', 'PENDING', 20000.00, NULL, NULL, '2026-10-12 07:28:31', '2026-10-12 07:28:31'),
(11, 14, 'COD', 'PENDING', 5690000.00, NULL, NULL, '2026-10-12 07:33:35', '2026-10-12 07:33:35'),
(12, 15, 'BANK_TRANSFER', 'PAID', 4690000.00, NULL, '2026-10-12 07:41:03', '2026-10-12 07:34:49', '2026-10-12 07:41:03'),
(13, 16, 'COD', 'PAID', 3544500.00, NULL, '2026-10-12 07:45:48', '2026-10-12 07:45:15', '2026-10-12 07:45:48'),
(14, 17, 'COD', 'PAID', 45730000.00, NULL, '2026-10-12 08:07:10', '2026-10-12 08:06:51', '2026-10-12 08:07:10'),
(15, 18, 'COD', 'PENDING', 1390000.00, NULL, NULL, '2026-10-13 00:48:03', '2026-10-13 00:48:03'),
(16, 19, 'COD', 'PENDING', 1390000.00, NULL, NULL, '2026-10-13 00:49:40', '2026-10-13 00:49:40'),
(17, 22, 'COD', 'PAID', 1251000.00, NULL, '2026-10-13 09:05:22', '2026-10-13 02:09:32', '2026-10-13 09:05:22'),
(18, 23, 'COD', 'PENDING', 7490000.00, NULL, NULL, '2026-10-14 06:35:41', '2026-10-14 06:35:41'),
(19, 24, 'BANK_TRANSFER', 'PAID', 7490000.00, NULL, '2026-10-14 06:38:30', '2026-10-14 06:38:18', '2026-10-14 06:38:30'),
(20, 25, 'BANK_TRANSFER', 'PAID', 7190000.00, NULL, '2026-10-14 07:19:55', '2026-10-14 07:19:39', '2026-10-14 07:19:55'),
(21, 26, 'COD', 'PAID', 56890000.00, NULL, '2026-10-14 07:51:31', '2026-10-14 07:51:09', '2026-10-14 07:51:31'),
(22, 27, 'COD', 'PAID', 34920000.00, NULL, '2026-10-14 13:11:33', '2026-10-14 13:10:20', '2026-10-14 13:11:33'),
(23, 28, 'BANK_TRANSFER', 'PAID', 7190000.00, NULL, '2026-10-14 13:54:46', '2026-10-14 13:54:32', '2026-10-14 13:54:46'),
(24, 29, 'COD', 'PAID', 28620000.00, NULL, '2026-10-14 14:12:07', '2026-10-14 14:11:53', '2026-10-14 14:12:07'),
(25, 30, 'COD', 'PAID', 36570000.00, NULL, '2026-10-15 08:00:29', '2026-10-15 08:00:13', '2026-10-15 08:00:29'),
(26, 31, 'COD', 'PAID', 14680000.00, NULL, '2026-10-16 07:50:10', '2026-10-16 07:49:04', '2026-10-16 07:50:10'),
(27, 32, 'BANK_TRANSFER', 'PAID', 14980000.00, NULL, '2026-10-20 07:17:49', '2026-10-20 07:12:22', '2026-10-20 07:17:49'),
(28, 33, 'COD', 'PAID', 6741000.00, NULL, '2026-10-20 08:33:37', '2026-10-20 08:33:12', '2026-10-20 08:33:37'),
(29, 34, 'COD', 'PAID', 35940000.00, NULL, '2026-10-20 08:55:42', '2026-10-20 08:51:48', '2026-10-20 08:55:42'),
(30, 35, 'COD', 'PAID', 7490000.00, NULL, '2026-10-22 05:37:46', '2026-10-22 05:36:56', '2026-10-22 05:37:46'),
(31, 36, 'COD', 'PAID', 30000000.00, NULL, '2026-10-22 05:39:37', '2026-10-22 05:39:12', '2026-10-22 05:39:37'),
(32, 37, 'COD', 'PAID', 81770000.00, NULL, '2026-10-22 05:49:00', '2026-10-22 05:44:16', '2026-10-22 05:49:00'),
(33, 38, 'COD', 'PAID', 110080000.00, NULL, '2026-10-22 05:48:55', '2026-10-22 05:45:18', '2026-10-22 05:48:55'),
(34, 39, 'COD', 'PAID', 110080000.00, NULL, '2026-10-22 05:48:49', '2026-10-22 05:48:15', '2026-10-22 05:48:49'),
(35, 40, 'COD', 'PAID', 110080000.00, NULL, '2026-10-22 05:48:43', '2026-10-22 05:48:34', '2026-10-22 05:48:43'),
(36, 41, 'COD', 'PAID', 15743000.00, NULL, '2026-10-22 15:08:14', '2026-10-22 15:06:54', '2026-10-22 15:08:14'),
(37, 42, 'BANK_TRANSFER', 'PAID', 7500.00, NULL, '2026-10-30 16:03:57', '2026-10-30 16:02:35', '2026-10-30 16:03:57'),
(38, 43, 'BANK_TRANSFER', 'PAID', 8000.00, NULL, '2026-10-30 16:15:16', '2026-10-30 16:11:07', '2026-10-30 16:15:16'),
(39, 44, 'BANK_TRANSFER', 'PAID', 8000.00, NULL, '2026-10-30 16:15:20', '2026-10-30 16:14:07', '2026-10-30 16:15:20'),
(40, 45, 'BANK_TRANSFER', 'PENDING', 8000.00, NULL, NULL, '2026-10-30 16:20:25', '2026-10-30 16:20:25'),
(41, 46, 'BANK_TRANSFER', 'PENDING', 8000.00, NULL, NULL, '2026-10-30 17:38:55', '2026-10-30 17:38:55'),
(42, 47, 'BANK_TRANSFER', 'PAID', 8000.00, NULL, '2026-11-02 09:15:56', '2026-10-30 17:53:42', '2026-11-02 09:15:56'),
(43, 48, 'BANK_TRANSFER', 'PAID', 8000.00, 'SEPAY-ID-10000001', '2026-10-30 18:18:38', '2026-10-30 18:18:12', '2026-10-30 18:18:38'),
(44, 49, 'BANK_TRANSFER', 'PAID', 8000.00, 'SEPAY-ID-10000002', '2026-11-02 09:14:02', '2026-11-02 09:12:17', '2026-11-02 09:14:02');

-- --------------------------------------------------------

--
-- Table structure for table `pc_builds`
--

CREATE TABLE `pc_builds` (
  `build_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `build_name` varchar(100) NOT NULL,
  `total_price` decimal(15,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pc_builds`
--

INSERT INTO `pc_builds` (`build_id`, `user_id`, `build_name`, `total_price`, `created_at`, `updated_at`) VALUES
(2, 1, 'PC Gaming RTX 4060', 31010000.00, '2026-10-02 01:01:40', '2026-10-06 01:53:48'),
(3, 1, 'PC văn phòng', 0.00, '2026-10-05 13:54:33', '2026-10-05 13:54:33'),
(4, 1, 'pc gaming', 27230000.00, '2026-10-05 13:54:56', '2026-10-06 01:21:52'),
(6, 1, 'pc gaming test', 10980000.00, '2026-10-06 01:23:41', '2026-10-06 06:08:36'),
(7, 1, 'pc gaming 2027', 33790000.00, '2026-10-09 01:16:22', '2026-10-09 01:17:23'),
(9, 2, '1', 45730000.00, '2026-10-12 08:00:46', '2026-10-12 08:01:17'),
(10, 5, 'Test', 58890000.00, '2026-10-14 07:49:42', '2026-10-14 07:50:47'),
(11, 6, 'Gaming pc 2026', 36920000.00, '2026-10-14 13:07:09', '2026-10-14 13:09:10'),
(13, 4, 'pc gaming', 38570000.00, '2026-10-15 07:48:21', '2026-10-15 07:49:34'),
(14, 7, '1', 14980000.00, '2026-10-15 08:22:15', '2026-10-15 08:23:02'),
(15, 4, 'abc', 0.00, '2026-10-16 08:16:53', '2026-10-16 08:16:53'),
(16, 12, 'gaming pc', 54030000.00, '2026-10-20 08:46:55', '2026-10-20 08:48:24'),
(18, 11, '1', 81770000.00, '2026-10-20 09:38:39', '2026-10-22 05:43:55'),
(19, 11, '2', 110080000.00, '2026-10-22 05:44:00', '2026-10-22 05:45:09'),
(20, 11, 'pc 30 tr', 31010000.00, '2026-10-23 13:25:10', '2026-10-23 13:25:50');

-- --------------------------------------------------------

--
-- Table structure for table `pc_build_items`
--

CREATE TABLE `pc_build_items` (
  `build_item_id` bigint(20) NOT NULL,
  `build_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pc_build_items`
--

INSERT INTO `pc_build_items` (`build_item_id`, `build_id`, `product_id`, `quantity`, `created_at`) VALUES
(2, 2, 3, 1, '2026-10-02 01:26:42'),
(3, 2, 2, 1, '2026-10-02 01:27:38'),
(4, 2, 4, 2, '2026-10-02 01:29:29'),
(10, 2, 5, 1, '2026-10-02 03:11:51'),
(11, 2, 8, 2, '2026-10-02 03:12:35'),
(14, 2, 9, 1, '2026-10-02 03:35:12'),
(15, 2, 12, 1, '2026-10-02 08:08:44'),
(17, 4, 2, 1, '2026-10-06 01:21:40'),
(18, 4, 3, 1, '2026-10-06 01:21:41'),
(19, 4, 4, 1, '2026-10-06 01:21:44'),
(20, 4, 5, 1, '2026-10-06 01:21:46'),
(21, 4, 8, 1, '2026-10-06 01:21:48'),
(22, 4, 9, 1, '2026-10-06 01:21:50'),
(23, 4, 12, 1, '2026-10-06 01:21:52'),
(24, 6, 3, 1, '2026-10-06 05:56:48'),
(26, 6, 2, 1, '2026-10-06 06:08:36'),
(28, 7, 2, 1, '2026-10-09 01:16:40'),
(29, 7, 3, 1, '2026-10-09 01:16:41'),
(30, 7, 4, 4, '2026-10-09 01:16:46'),
(31, 7, 5, 1, '2026-10-09 01:16:50'),
(32, 7, 8, 2, '2026-10-09 01:16:52'),
(34, 7, 9, 1, '2026-10-09 01:16:59'),
(37, 7, 12, 1, '2026-10-09 01:17:13'),
(48, 9, 7, 1, '2026-10-12 08:00:57'),
(49, 9, 19, 1, '2026-10-12 08:01:00'),
(50, 9, 24, 2, '2026-10-12 08:01:05'),
(51, 9, 30, 1, '2026-10-12 08:01:08'),
(52, 9, 46, 1, '2026-10-12 08:01:11'),
(53, 9, 9, 1, '2026-10-12 08:01:13'),
(54, 9, 12, 1, '2026-10-12 08:01:17'),
(55, 10, 1, 1, '2026-10-14 07:49:49'),
(56, 10, 19, 1, '2026-10-14 07:49:53'),
(57, 10, 4, 4, '2026-10-14 07:50:00'),
(61, 10, 32, 1, '2026-10-14 07:50:11'),
(62, 10, 47, 2, '2026-10-14 07:50:18'),
(65, 10, 39, 1, '2026-10-14 07:50:41'),
(66, 10, 44, 1, '2026-10-14 07:50:47'),
(67, 11, 1, 1, '2026-10-14 13:07:14'),
(68, 11, 19, 1, '2026-10-14 13:07:40'),
(69, 11, 4, 2, '2026-10-14 13:08:00'),
(70, 11, 30, 1, '2026-10-14 13:08:19'),
(71, 11, 8, 1, '2026-10-14 13:08:30'),
(72, 11, 37, 1, '2026-10-14 13:09:07'),
(73, 11, 12, 1, '2026-10-14 13:09:10'),
(81, 13, 2, 1, '2026-10-15 07:48:24'),
(82, 13, 3, 1, '2026-10-15 07:48:26'),
(83, 13, 4, 4, '2026-10-15 07:48:28'),
(85, 13, 8, 4, '2026-10-15 07:49:25'),
(86, 13, 5, 1, '2026-10-15 07:49:28'),
(87, 13, 9, 1, '2026-10-15 07:49:32'),
(88, 13, 12, 1, '2026-10-15 07:49:34'),
(89, 14, 1, 1, '2026-10-15 08:22:55'),
(90, 14, 19, 1, '2026-10-15 08:23:02'),
(91, 16, 17, 1, '2026-10-20 08:47:06'),
(92, 16, 19, 1, '2026-10-20 08:47:09'),
(93, 16, 4, 1, '2026-10-20 08:47:11'),
(95, 16, 32, 1, '2026-10-20 08:47:15'),
(97, 16, 8, 1, '2026-10-20 08:47:21'),
(102, 16, 37, 1, '2026-10-20 08:47:57'),
(103, 16, 12, 1, '2026-10-20 08:48:24'),
(118, 18, 19, 1, '2026-10-20 09:38:45'),
(121, 18, 24, 4, '2026-10-20 09:40:00'),
(122, 18, 47, 4, '2026-10-20 09:40:11'),
(123, 18, 33, 1, '2026-10-22 05:43:22'),
(124, 18, 38, 1, '2026-10-22 05:43:29'),
(125, 18, 41, 1, '2026-10-22 05:43:33'),
(126, 18, 1, 1, '2026-10-22 05:43:55'),
(127, 19, 22, 1, '2026-10-22 05:44:31'),
(128, 19, 7, 1, '2026-10-22 05:44:36'),
(129, 19, 29, 4, '2026-10-22 05:44:43'),
(130, 19, 33, 1, '2026-10-22 05:44:49'),
(131, 19, 47, 4, '2026-10-22 05:44:53'),
(132, 19, 40, 1, '2026-10-22 05:44:58'),
(134, 19, 43, 1, '2026-10-22 05:45:09'),
(135, 20, 2, 1, '2026-10-23 13:25:25'),
(136, 20, 3, 1, '2026-10-23 13:25:27'),
(137, 20, 4, 2, '2026-10-23 13:25:29'),
(138, 20, 5, 1, '2026-10-23 13:25:32'),
(139, 20, 8, 2, '2026-10-23 13:25:35'),
(140, 20, 9, 1, '2026-10-23 13:25:41'),
(141, 20, 12, 1, '2026-10-23 13:25:45');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` bigint(20) NOT NULL,
  `category_id` bigint(20) NOT NULL,
  `brand_id` bigint(20) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(15,2) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `image_url` varchar(255) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `category_id`, `brand_id`, `name`, `description`, `price`, `stock_quantity`, `image_url`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'Intel Core i5-14600K', 'CPU Intel Core i5 thế hệ 14 dành cho máy tính để bàn', 10000.00, 12, 'intel-core-i5-14600k.jpg', 'ACTIVE', '2026-09-25 13:26:43', '2026-11-02 09:12:17'),
(2, 1, 2, 'AMD Ryzen 5 7600X', 'CPU AMD Ryzen 5 7600X dành cho máy tính để bàn', 5990000.00, 49, 'images/products/amd-ryzen-5-7600x.jpg', 'ACTIVE', '2026-09-25 13:37:05', '2026-10-20 08:54:59'),
(3, 4, 4, 'ASUS TUF Gaming B650-PLUS', 'Mainboard ASUS TUF Gaming B650-PLUS hỗ trợ CPU AMD socket AM5', 4990000.00, 7, 'images/products/asus-tuf-b650-plus.jpg', 'ACTIVE', '2026-09-25 13:37:05', '2026-10-15 08:00:13'),
(4, 3, 7, 'Kingston Fury Beast 16GB DDR5', 'RAM Kingston Fury Beast DDR5 dung lượng 16GB', 1390000.00, 19, 'kingston-fury-beast-16gb-ddr5.jpg', 'ACTIVE', '2026-09-25 13:37:05', '2026-10-15 08:00:13'),
(5, 2, 5, 'MSI GeForce RTX 4060 Ventus 2X', 'Card đồ họa MSI GeForce RTX 4060 Ventus 2X', 8990000.00, 6, 'images/products/msi-rtx-4060-ventus-2x.jpg', 'ACTIVE', '2026-09-25 13:37:05', '2026-10-15 08:00:13'),
(7, 1, 1, 'Intel Core i9', 'Sản phẩm dùng để test quyền ADMIN', 15000000.00, 20, 'core-i9.jpg', 'ACTIVE', '2026-09-27 14:15:45', '2026-10-22 15:06:54'),
(8, 5, 9, 'Samsung 990 EVO 1TB NVMe SSD', 'SSD NVMe 1TB tốc độ cao dành cho PC Gaming', 2390000.00, 52, 'images/products/samsung-990-evo-1tb.jpg', 'ACTIVE', '2026-10-02 03:09:34', '2026-10-22 05:46:35'),
(9, 7, 8, 'Corsair CX650 650W', 'Nguồn Corsair công suất 650W dành cho PC Gaming', 1590000.00, 35, 'images/products/corsair-cx650.jpg', 'ACTIVE', '2026-10-02 03:09:34', '2026-10-22 05:46:42'),
(10, 8, 12, 'Cooler Master MasterBox Q300L', 'Case Cooler Master dành cho cấu hình PC Gaming', 1290000.00, 10, 'q300l.png', 'ACTIVE', '2026-10-02 03:09:34', '2026-10-23 07:54:54'),
(11, 7, 8, 'Corsair Test PSU 450W', 'PSU 450W dùng để test compatibility GPU', 990000.00, 10, 'corsair-test- 450w.png', 'ACTIVE', '2026-10-02 03:40:04', '2026-10-23 07:53:52'),
(12, 8, 12, 'Cooler Master ATX Gaming Case', 'Case ATX dùng cho cấu hình PC Gaming', 1890000.00, 29, 'images/products/cooler-master-atx-case.jpg', 'ACTIVE', '2026-10-02 08:02:13', '2026-10-22 05:46:48'),
(13, 1, 1, 'CPU admin', 'Sản phẩm test Admin', 1200000.00, 8, 'intel-core-i5-14600k.jpg', 'ACTIVE', '2026-10-06 13:00:28', '2026-10-09 08:55:50'),
(14, 3, 7, 'Test', '123', 20000.00, 11, 'kingston-fury-beast-16gb-ddr5', 'DELETED', '2026-10-12 07:04:38', '2026-10-22 05:47:22'),
(15, 1, 1, 'Intel Core i5-13600K', 'CPU 14 nhân, nền tảng LGA1700', 7290000.00, 12, 'intel-core-i5-13600k.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(16, 1, 1, 'Intel Core i7-13700K', 'CPU hiệu năng cao LGA1700', 9990000.00, 10, 'intel-core-i7-13700k.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(17, 1, 1, 'Intel Core i9-13900K', 'CPU cao cấp LGA1700', 13990000.00, 8, 'i9-13900k.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-23 07:55:58'),
(18, 1, 1, 'Intel Core i9-14900K', 'CPU cao cấp thế hệ mới LGA1700', 14990000.00, 7, 'intel-core-i9-14900k.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(19, 4, 4, 'ASUS TUF Gaming Z790-PLUS WiFi DDR5', 'Mainboard ATX LGA1700 DDR5', 7490000.00, 35, 'asus-tuf-z790-plus-wifi-ddr5.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:46:57'),
(20, 4, 4, 'ASUS PRIME B760-PLUS DDR5', 'Mainboard ATX LGA1700 DDR5', 4290000.00, 11, 'asus-prime-b760-plus-ddr5.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(21, 4, 5, 'MSI PRO B760M-A WIFI DDR5', 'Mainboard mATX LGA1700 DDR5', 3990000.00, 12, 'msi-pro-b760m-a-wifi-ddr5.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(22, 4, 5, 'MSI MAG Z790 TOMAHAWK WIFI DDR5', 'Mainboard ATX LGA1700 DDR5', 7990000.00, 5, 'msi-mag-z790-tomahawk-wifi-ddr5.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:48:34'),
(23, 4, 4, 'ASUS ROG STRIX B760-F GAMING WIFI', 'Mainboard ATX LGA1700 DDR5', 6190000.00, 7, 'asus-rog-strix-b760-f-gaming-wifi.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(24, 3, 7, 'Kingston Fury Beast 32GB DDR5 5600', 'RAM DDR5 32GB', 2490000.00, 14, 'kingston-fury-beast-32gb-ddr5-5600.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:44:16'),
(25, 3, 7, 'Kingston Fury Beast RGB 32GB DDR5 6000', 'RAM DDR5 RGB 32GB', 2890000.00, 18, 'kingston-fury-beast-rgb-32gb-ddr5-6000.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(26, 3, 8, 'Corsair Vengeance 32GB DDR5 5600', 'RAM DDR5 32GB', 2590000.00, 16, 'corsair-vengeance-32gb-ddr5-5600.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(27, 3, 8, 'Corsair Vengeance RGB 32GB DDR5 6000', 'RAM DDR5 RGB 32GB', 3190000.00, 15, 'corsair-vengeance-rgb-32gb-ddr5-6000.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(28, 3, 7, 'Kingston Fury Renegade 64GB DDR5 6000', 'RAM DDR5 64GB', 5290000.00, 9, 'kingston-fury-renegade-64gb-ddr5-6000.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(29, 3, 8, 'Corsair Dominator Titanium 64GB DDR5 6400', 'RAM DDR5 cao cấp 64GB', 6990000.00, 44, 'corsair-dominator-titanium-64gb-ddr5-6400.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:48:34'),
(30, 2, 5, 'MSI GeForce RTX 4060 Ti Ventus 2X 8GB', 'GPU tầm trung hiệu năng cao', 11990000.00, 8, '4060-ti.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-23 07:57:03'),
(31, 2, 4, 'ASUS Dual GeForce RTX 4070 SUPER 12GB', 'GPU RTX 4070 SUPER', 18990000.00, 8, 'asus-dual-rtx-4070-super-12gb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(32, 2, 5, 'MSI GeForce RTX 4070 Ti SUPER Ventus 3X', 'GPU RTX 4070 Ti SUPER', 23990000.00, 6, 'msi-rtx-4070-ti-super-ventus-3x.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-14 07:51:09'),
(33, 2, 4, 'ASUS TUF Gaming GeForce RTX 4080 SUPER', 'GPU cao cấp RTX 4080 SUPER', 32990000.00, 53, 'asus-tuf-rtx-4080-super.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:48:34'),
(34, 2, 5, 'MSI GeForce RTX 3060 Ventus 2X 12GB', 'GPU phổ thông RTX 3060', 7990000.00, 11, 'msi-rtx-3060-ventus-2x-12gb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(35, 2, 4, 'ASUS Dual GeForce RTX 4060 8GB', 'GPU RTX 4060 nhỏ gọn', 9490000.00, 12, 'asus-dual-rtx-4060-8gb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(36, 7, 8, 'Corsair RM650e 650W 80 Plus Gold', 'Nguồn 650W 80 Plus Gold', 2490000.00, 14, 'corsair-rm650e-650w.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(37, 7, 8, 'Corsair RM750e 750W 80 Plus Gold', 'Nguồn 750W 80 Plus Gold', 2890000.00, 12, 'corsair-rm750e-750w.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-14 13:10:20'),
(38, 7, 8, 'Corsair RM850e 850W 80 Plus Gold', 'Nguồn 850W 80 Plus Gold', 3390000.00, 9, 'corsair-rm850e-850w.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:44:16'),
(39, 7, 12, 'Cooler Master MWE Gold 850 V2', 'Nguồn 850W 80 Plus Gold', 3190000.00, 8, 'cooler-master-mwe-gold-850-v2.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-14 07:51:09'),
(40, 7, 5, 'MSI MAG A1000GL PCIE5 1000W', 'Nguồn 1000W PCIe 5', 4290000.00, 4, 'msi-mag-a1000gl-1000w.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:48:34'),
(41, 8, 12, 'Cooler Master TD500 Mesh V2', 'Case ATX hỗ trợ GPU dài', 2490000.00, 9, 'cooler-master-td500-mesh-v2.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:44:16'),
(42, 8, 8, 'Corsair 4000D Airflow', 'Case ATX airflow', 2390000.00, 11, 'corsair-4000d-airflow.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(43, 8, 8, 'Corsair 5000D Airflow', 'Case ATX kích thước lớn', 3890000.00, 5, 'corsair-5000d-airflow.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:48:34'),
(44, 8, 12, 'Cooler Master MasterBox 520 Mesh', 'Case ATX mesh', 2190000.00, 11, 'cooler-master-masterbox-520-mesh.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-14 07:51:09'),
(45, 8, 12, 'Cooler Master CMP 520 ARGB', 'Case ATX ARGB', 1590000.00, 14, 'cooler-master-cmp-520-argb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(46, 5, 9, 'Samsung 990 PRO 1TB NVMe', 'SSD NVMe PCIe 4.0 1TB', 2790000.00, 17, 'samsung-990-pro-1tb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 08:06:51'),
(47, 5, 9, 'Samsung 990 PRO 2TB NVMe', 'SSD NVMe PCIe 4.0 2TB', 4490000.00, 44, 'samsung-990-pro-2tb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-22 05:48:34'),
(48, 5, 7, 'Kingston KC3000 1TB NVMe', 'SSD NVMe PCIe 4.0 1TB', 2190000.00, 16, 'kingston-kc3000-1tb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(49, 5, 7, 'Kingston NV2 2TB NVMe', 'SSD NVMe 2TB', 2890000.00, 15, 'kingston-nv2-2tb.png', 'ACTIVE', '2026-10-12 07:58:58', '2026-10-12 07:58:58'),
(50, 1, 1, 'core-i9-test', 'test', 5000000.00, 50, 'i9-13900k.png', 'ACTIVE', '2026-11-02 06:33:33', '2026-11-02 06:33:53'),
(51, 6, 11, 'Seagate BarraCuda 2TB 7200rpm 3.5\"', 'Ổ cứng HDD 2TB 7200rpm, bộ nhớ đệm 256MB, chuẩn SATA III. Phù hợp lưu trữ dữ liệu và game dung lượng lớn.', 1550000.00, 40, 'seagate-barracuda-2tb.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(52, 6, 10, 'WD Blue 4TB 5400rpm 3.5\"', 'Ổ cứng WD Blue 4TB, hoạt động êm và mát, bền bỉ cho máy tính văn phòng và lưu trữ hằng ngày.', 2650000.00, 30, 'wd-blue-4tb.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(53, 6, 16, 'Toshiba P300 1TB 7200rpm 3.5\"', 'Ổ cứng Toshiba P300 1TB 7200rpm, bộ nhớ đệm 64MB, giá tốt cho nhu cầu lưu trữ cơ bản.', 1150000.00, 50, 'toshiba-p300-1tb.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(54, 9, 12, 'Cooler Master Hyper 212 Black Edition', 'Tản nhiệt khí tháp đơn, quạt 120mm, 4 ống đồng tiếp xúc trực tiếp. Hỗ trợ nhiều socket Intel và AMD.', 590000.00, 45, 'cooler-master-hyper-212-black.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(55, 9, 17, 'DeepCool AK620 Dual Tower', 'Tản nhiệt khí tháp đôi, 6 ống đồng, 2 quạt 120mm, tản nhiệt tốt cho CPU hiệu năng cao.', 1390000.00, 30, 'deepcool-ak620.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(56, 9, 18, 'Noctua NH-D15 chromax.black', 'Tản nhiệt khí cao cấp tháp đôi với 2 quạt NF-A15, hiệu năng làm mát hàng đầu và vận hành rất êm.', 2990000.00, 15, 'noctua-nh-d15-black.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(57, 9, 8, 'Corsair iCUE H150i Elite Capellix 360mm', 'Tản nhiệt nước AIO 360mm, 3 quạt ML120 RGB, đèn Capellix, điều khiển qua phần mềm iCUE.', 4290000.00, 12, 'corsair-h150i-elite-360.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(58, 10, 4, 'ASUS TUF Gaming F15 FX507 (i5-12500H, RTX 3050)', 'Laptop gaming 15.6\" FHD 144Hz, Intel Core i5-12500H, RAM 16GB, SSD 512GB, RTX 3050 4GB. Bền bỉ chuẩn quân đội.', 19990000.00, 10, 'asus-tuf-f15-fx507.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(59, 10, 19, 'Lenovo LOQ 15IRH8 (i5-13420H, RTX 4050)', 'Laptop gaming 15.6\" FHD 144Hz, Intel Core i5-13420H, RAM 16GB, SSD 512GB, RTX 4050 6GB.', 24490000.00, 8, 'lenovo-loq-15irh8.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(60, 10, 20, 'Acer Nitro V 15 ANV15-51 (i7-13620H, RTX 4060)', 'Laptop gaming 15.6\" FHD 165Hz, Intel Core i7-13620H, RAM 16GB, SSD 512GB, RTX 4060 8GB.', 28990000.00, 6, 'acer-nitro-v-15.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(61, 11, 4, 'ASUS TUF Gaming VG249Q1A 24\" IPS 165Hz', 'Màn hình gaming 23.8\" Full HD IPS, 165Hz, 1ms, Adaptive-Sync, công nghệ ELMB giảm nhòe chuyển động.', 3190000.00, 25, 'asus-tuf-vg249q1a.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(62, 11, 21, 'Dell G2724D 27\" QHD IPS 165Hz', 'Màn hình gaming 27\" QHD IPS, 165Hz, 1ms, tương thích G-Sync và FreeSync Premium.', 5790000.00, 20, 'dell-g2724d.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(63, 11, 9, 'Samsung Odyssey G5 27\" QHD VA 165Hz cong', 'Màn hình cong 1000R 27\" QHD VA, 165Hz, 1ms, HDR10, trải nghiệm chơi game đắm chìm.', 6290000.00, 15, 'samsung-odyssey-g5-27.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(64, 11, 22, 'LG UltraGear 27GP850-B 27\" QHD Nano IPS 180Hz', 'Màn hình gaming 27\" QHD Nano IPS, 180Hz (OC), 1ms, HDR400, dải màu DCI-P3 98%.', 7490000.00, 12, 'lg-ultragear-27gp850.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(65, 12, 23, 'AKKO 3068B Plus Multi-modes (Hotswap)', 'Bàn phím cơ 65% kết nối 3 chế độ (Bluetooth/2.4G/USB-C), hotswap, LED RGB, switch AKKO CS.', 1790000.00, 35, 'akko-3068b-plus.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(66, 12, 24, 'Keychron K2 V2 Wireless RGB (Gateron Brown)', 'Bàn phím cơ không dây 75%, Bluetooth 5.1, tương thích Windows/macOS, pin 4000mAh, LED RGB.', 2290000.00, 25, 'keychron-k2-v2.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(67, 12, 14, 'Razer BlackWidow V4 X Mechanical', 'Bàn phím cơ full-size, switch Razer Green, 6 phím macro, LED Chroma RGB, kê tay êm.', 3490000.00, 18, 'razer-blackwidow-v4-x.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(68, 12, 13, 'Logitech G Pro X TKL Lightspeed', 'Bàn phím cơ TKL không dây Lightspeed, switch GX tuỳ chọn, thiết kế gọn cho esports.', 4290000.00, 12, 'logitech-g-pro-x-tkl.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(69, 13, 25, 'SteelSeries Rival 3', 'Chuột gaming có dây, cảm biến TrueMove Core 8500 CPI, 6 nút, LED RGB 8 vùng.', 590000.00, 60, 'steelseries-rival-3.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(70, 13, 13, 'Logitech G502 HERO', 'Chuột gaming có dây cảm biến HERO 25K, 11 nút lập trình, hệ thống tạ tuỳ chỉnh.', 1090000.00, 45, 'logitech-g502-hero.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(71, 13, 14, 'Razer DeathAdder V3 Pro Wireless', 'Chuột không dây siêu nhẹ 63g, cảm biến Focus Pro 30K, pin lên tới 90 giờ.', 3490000.00, 14, 'razer-deathadder-v3-pro.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(72, 13, 13, 'Logitech G Pro X Superlight 2', 'Chuột esports không dây dưới 60g, cảm biến HERO 2 32K, switch lai quang cơ.', 3790000.00, 16, 'logitech-g-pro-x-superlight-2.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(73, 14, 14, 'Razer BlackShark V2 X', 'Tai nghe gaming 7.1 surround, driver TriForce 50mm, mic HyperClear Cardioid, đệm tai bọt nhớ.', 1590000.00, 30, 'razer-blackshark-v2-x.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(74, 14, 13, 'Logitech G435 Lightspeed Wireless', 'Tai nghe không dây Lightspeed và Bluetooth, siêu nhẹ 165g, mic kép lọc ồn, pin 18 giờ.', 1490000.00, 35, 'logitech-g435.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(75, 14, 26, 'HyperX Cloud II 7.1 Surround', 'Tai nghe gaming huyền thoại, âm thanh 7.1 ảo, khung nhôm, mic tháo rời khử ồn.', 2090000.00, 28, 'hyperx-cloud-ii.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53'),
(76, 14, 25, 'SteelSeries Arctis Nova 1', 'Tai nghe gaming nhẹ, driver 40mm Nova, mic ClearCast Gen 2, tương thích PC/PS/Switch.', 2290000.00, 20, 'steelseries-arctis-nova-1.png', 'ACTIVE', '2026-11-02 06:44:53', '2026-11-02 06:44:53');

-- --------------------------------------------------------

--
-- Table structure for table `product_promotions`
--

CREATE TABLE `product_promotions` (
  `promotion_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `promotion_type` varchar(30) NOT NULL,
  `discount_percent` decimal(5,2) NOT NULL,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `campaign_year` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_promotions`
--

INSERT INTO `product_promotions` (`promotion_id`, `product_id`, `promotion_type`, `discount_percent`, `start_at`, `end_at`, `status`, `campaign_year`, `created_at`, `updated_at`) VALUES
(1, 1, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(2, 2, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(3, 3, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(4, 4, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(5, 5, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(6, 7, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(7, 8, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(8, 9, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(9, 10, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(10, 11, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(11, 12, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(12, 13, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(13, 15, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(14, 16, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(15, 17, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(16, 18, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(17, 19, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(18, 20, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(19, 21, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(20, 22, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(21, 23, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(22, 24, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(23, 25, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(24, 26, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(25, 27, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(26, 28, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(27, 29, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(28, 30, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(29, 31, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(30, 32, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(31, 33, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(32, 34, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(33, 35, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(34, 36, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(35, 37, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(36, 38, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(37, 39, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(38, 40, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(39, 41, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(40, 42, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(41, 43, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(42, 44, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(43, 45, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(44, 46, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(45, 47, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(46, 48, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(47, 49, 'BLACK_FRIDAY', 25.00, '2026-10-30 00:00:00', '2026-10-31 00:00:00', 'INACTIVE', 2026, '2026-10-30 14:20:08', '2026-10-30 16:09:04'),
(48, 1, 'SALE', 15.00, '2026-10-30 12:00:00', '2026-10-31 12:00:00', 'ACTIVE', NULL, '2026-10-30 16:07:57', '2026-11-01 13:28:57'),
(49, 4, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(50, 47, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(51, 1, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(52, 29, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(53, 2, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(54, 7, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(55, 24, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(56, 8, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(57, 33, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(58, 12, 'BESTSELLER', 10.00, '2026-11-01 20:50:57', '2026-11-07 16:14:44', 'ACTIVE', 0, '2026-11-01 13:50:58', '2026-11-05 09:14:45'),
(59, 19, 'BESTSELLER', 10.00, '2026-11-02 13:03:41', '2026-11-04 16:07:15', 'INACTIVE', 0, '2026-11-02 06:03:41', '2026-11-05 09:14:45'),
(60, 50, 'NEW_PRODUCT', 5.00, '2026-11-02 13:33:33', '2026-12-02 13:33:33', 'ACTIVE', NULL, '2026-11-02 06:33:33', '2026-11-02 06:33:33');

-- --------------------------------------------------------

--
-- Table structure for table `promotions`
--

CREATE TABLE `promotions` (
  `promotion_id` bigint(20) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_percent` decimal(5,2) NOT NULL,
  `max_discount` decimal(15,2) DEFAULT NULL,
  `min_order_value` decimal(15,2) NOT NULL DEFAULT 0.00,
  `start_at` datetime NOT NULL,
  `end_at` datetime NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotions`
--

INSERT INTO `promotions` (`promotion_id`, `code`, `name`, `description`, `discount_percent`, `max_discount`, `min_order_value`, `start_at`, `end_at`, `status`, `created_at`, `updated_at`) VALUES
(1, 'WELCOME15', 'Giảm 15%', 'Khuyến mãi cập nhật', 15.00, NULL, 1000000.00, '2026-09-30 00:00:00', '2026-12-31 23:59:00', 'ACTIVE', '2026-09-30 12:45:00', '2026-10-22 14:02:31'),
(2, 'SALE10', 'giảm 10% đơn hàng', 'khuyến mãi thử nghiệm', 10.00, 300000.00, 500000.00, '2026-10-09 10:34:00', '2026-12-19 23:59:00', 'ACTIVE', '2026-10-09 03:35:16', '2026-10-22 14:02:18'),
(3, 'SALE20', 'test', 'test', 20.00, 2000000.00, 10000000.00, '2026-10-14 09:16:00', '2026-11-21 09:16:00', 'ACTIVE', '2026-10-13 02:16:41', '2026-10-20 06:36:00'),
(4, 'MAX300', 'test', 'test', 20.00, 300000.00, 5000000.00, '2026-10-13 10:01:00', '2026-12-13 10:01:00', 'ACTIVE', '2026-10-13 03:01:16', '2026-10-13 03:02:12'),
(5, 'TEST10', 'test', 'test', 20.00, NULL, 7490000.00, '2026-10-20 15:31:00', '2026-10-27 15:32:00', 'ACTIVE', '2026-10-20 08:32:05', '2026-10-20 08:46:55');

-- --------------------------------------------------------

--
-- Table structure for table `promotion_redemptions`
--

CREATE TABLE `promotion_redemptions` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `promotion_id` bigint(20) NOT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'USED',
  `used_at` datetime(6) DEFAULT NULL,
  `released_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `promotion_redemptions`
--

INSERT INTO `promotion_redemptions` (`id`, `user_id`, `promotion_id`, `order_id`, `status`, `used_at`, `released_at`) VALUES
(1, 1, 2, 22, 'USED', '2026-10-13 09:09:32.000000', NULL),
(2, 2, 1, 16, 'USED', '2026-10-12 14:45:12.000000', NULL),
(3, 2, 2, 12, 'USED', '2026-10-12 14:07:38.000000', NULL),
(4, 4, 2, 25, 'USED', '2026-10-14 14:19:39.000000', NULL),
(5, 4, 3, 30, 'USED', '2026-10-15 15:00:13.000000', NULL),
(6, 5, 3, 26, 'USED', '2026-10-14 14:51:09.000000', NULL),
(7, 6, 3, 27, 'USED', '2026-10-14 20:10:20.000000', NULL),
(8, 10, 5, 33, 'USED', '2026-10-20 15:33:12.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `review_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`review_id`, `user_id`, `product_id`, `rating`, `comment`, `status`, `created_at`, `updated_at`) VALUES
(3, 1, 4, 4, 'RAM chạy ổn định, sản phẩm tốt ,  phục vụ nhiệt tình', 'ACTIVE', '2026-09-29 14:43:55', '2026-10-14 09:32:40'),
(5, 4, 1, 5, '123', 'ACTIVE', '2026-10-20 07:07:43', '2026-10-20 07:08:35');

-- --------------------------------------------------------

--
-- Table structure for table `support_conversations`
--

CREATE TABLE `support_conversations` (
  `conversation_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_message_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_away_notice_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_conversations`
--

INSERT INTO `support_conversations` (`conversation_id`, `user_id`, `created_at`, `last_message_at`, `last_away_notice_date`) VALUES
(1, 11, '2026-10-23 20:23:23', '2026-11-02 16:07:58', '2026-10-23');

-- --------------------------------------------------------

--
-- Table structure for table `support_messages`
--

CREATE TABLE `support_messages` (
  `message_id` bigint(20) NOT NULL,
  `conversation_id` bigint(20) NOT NULL,
  `sender` varchar(10) NOT NULL,
  `content` varchar(2000) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `support_messages`
--

INSERT INTO `support_messages` (`message_id`, `conversation_id`, `sender`, `content`, `is_read`, `created_at`) VALUES
(1, 1, 'SYSTEM', 'ComputerStore xin chào! Bạn cần tư vấn sản phẩm, đơn hàng hay bảo hành ạ? Nhân viên sẽ phản hồi trong giờ hỗ trợ: Thứ 2–6 từ 07:00–18:00; Thứ 7 và Chủ nhật từ 08:00–16:00.', 0, '2026-10-23 20:23:23'),
(2, 1, 'USER', 'mình cần tư vấn build pc', 1, '2026-10-23 20:23:37'),
(3, 1, 'SYSTEM', 'Hiện ngoài giờ hỗ trợ. ComputerStore đã nhận tin nhắn và sẽ trả lời trong ca làm việc tiếp theo. Giờ hỗ trợ: T2–T6 07:00–18:00, T7–CN 08:00–16:00.', 0, '2026-10-23 20:23:37'),
(4, 1, 'ADMIN', 'mình cần build pc cho tác vụ gì và tầm giá như thế nào ạ', 0, '2026-10-23 20:24:23'),
(5, 1, 'USER', 'tác vụ học tập và chơi game tầm giá 30tr', 1, '2026-10-23 20:24:50'),
(6, 1, 'ADMIN', '1123', 0, '2026-11-02 16:07:51'),
(7, 1, 'USER', 'adb', 1, '2026-11-02 16:07:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL,
  `customer_code` varchar(20) DEFAULT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'USER',
  `status` varchar(20) NOT NULL DEFAULT 'ACTIVE',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `password_version` int(11) NOT NULL DEFAULT 0,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0,
  `registration_released` tinyint(1) NOT NULL DEFAULT 0,
  `released_username` varchar(50) DEFAULT NULL,
  `released_email` varchar(100) DEFAULT NULL,
  `first_time_eligible` tinyint(1) NOT NULL DEFAULT 1,
  `customer_tier` varchar(20) NOT NULL DEFAULT 'NORMAL',
  `vip_since` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `customer_code`, `username`, `email`, `password`, `full_name`, `phone`, `address`, `role`, `status`, `created_at`, `password_version`, `email_verified`, `registration_released`, `released_username`, `released_email`, `first_time_eligible`, `customer_tier`, `vip_since`) VALUES
(1, 'KH000001', 'user01', 'user01@example.com', '$2a$10$Iwba9NHhdOuJ.zVk1h6Sg.tCgLra5jQVoFblBmwfGLNNZ3MUCSws.', 'Nguyễn Văn An', '0901000001', '12 Nguyễn Huệ, Quận 1, TP.HCM', 'USER', 'ACTIVE', '2026-09-27 13:28:36', 0, 1, 0, NULL, NULL, 0, 'NORMAL', NULL),
(2, 'KH000002', 'admin01', 'admin01@example.com', '$2a$10$A3XXne7IDKqiJxd1nnghd.5QLso8E0dCBB6QfkNOCnhRWeGwBlNgu', 'Admin', '0901000002', '1 Lê Lợi, Quận 1, TP.HCM', 'ADMIN', 'ACTIVE', '2026-09-27 14:09:38', 0, 1, 0, NULL, NULL, 0, 'NORMAL', NULL),
(3, 'KH000003', 'user03', 'user03@example.com', '$2a$10$ObWhj4lwsgu7Qh.r.MI8k.IL503VhgHWGmlB5ys9NCJjw.fMdeqoO', 'Trần Thị Bình', '0901000003', '25 Lý Tự Trọng, Quận 1, TP.HCM', 'USER', 'ACTIVE', '2026-10-06 06:13:56', 0, 1, 0, NULL, NULL, 1, 'NORMAL', NULL),
(4, 'KH000004', 'deleted_u4', 'deleted_u4@invalid.local', '$2a$10$pi7/AXe968YdwIlgphvYn./cTOrpMjqyqNhyo.7OTE7gKppCoGkUy', 'Lê Văn Cường', '0901000004', '88 Hai Bà Trưng, Quận 3, TP.HCM', 'USER', 'DELETED', '2026-10-13 01:38:06', 8, 1, 1, 'user11', 'user11@example.com', 0, 'NORMAL', NULL),
(5, 'KH000005', 'user05', 'user05@example.com', '$2a$10$d0GmWvqsy5cERFwhIV.9f.Ig5HheZJJL/DhlsHtZtmOoAzb8OlB1q', 'Phạm Minh Đức', '0901000005', '45 Cách Mạng Tháng 8, Quận 10, TP.HCM', 'USER', 'DELETED', '2026-10-14 07:44:37', 2, 1, 0, NULL, NULL, 0, 'NORMAL', NULL),
(6, 'KH000006', 'user06', 'user06@example.com', '$2a$10$HBkaOwIqhxfrRSaQjLD7L.l/yznrmSaBV2KjxNBHLrhhdEx9GyShm', 'Hoàng Thị Lan', '0901000006', '7 Phạm Văn Đồng, TP. Thủ Đức, TP.HCM', 'USER', 'ACTIVE', '2026-10-14 13:05:27', 0, 1, 0, NULL, NULL, 0, 'NORMAL', NULL),
(7, 'KH000007', 'user07', 'user07@example.com', '$2a$10$D3MDG3XmftLErRNQ3LEux.tD02LMbqs1EDQuypQ2IsKCn84sFu1ca', 'Võ Quốc Huy', '0901000007', '63 Nguyễn Trãi, Quận 5, TP.HCM', 'USER', 'ACTIVE', '2026-10-15 08:21:26', 0, 1, 0, NULL, NULL, 1, 'NORMAL', NULL),
(8, 'KH000008', 'user08', 'user08@example.com', '$2a$10$Ng9VFZLxeGz8duUKundHb.k8d6YAAsZOIfklY97PPRtbVlSNeoqQm', 'Đặng Thị Mai', '0901000008', '19 Lê Văn Việt, TP. Thủ Đức, TP.HCM', 'USER', 'ACTIVE', '2026-10-19 15:04:08', 0, 1, 0, NULL, NULL, 1, 'NORMAL', NULL),
(10, 'KH000010', 'deleted_u10', 'deleted_u10@invalid.local', '$2a$10$W4BD3OLpwCgnZhNQ3J9zI.jzIs9qDv9NsmWpibS.ZQXJc6S.Me7sK', 'Bùi Văn Nam', '0901000010', '102 Võ Văn Tần, Quận 3, TP.HCM', 'USER', 'DELETED', '2026-10-20 08:15:05', 2, 1, 1, 'user11', 'user11@example.com', 0, 'NORMAL', NULL),
(11, 'KH000011', 'user11', 'user11@example.com', '$2a$10$XDfRvlLrXR/GIKyiTR4Hy.U8TfArfBps4hW8cyr5D9.YlkBsE/2Xi', 'Ngô Thị Hoa', '0901000011', '36 Trường Chinh, Quận Tân Bình, TP.HCM', 'USER', 'ACTIVE', '2026-10-20 08:36:36', 1, 1, 0, NULL, NULL, 0, 'VIP', '2026-10-22 21:01:36.000000'),
(12, 'KH000012', 'user12', 'user12@example.com', '$2a$10$LLsXZXlPYniryP.6xeaVk.Ka8KkTzqZz3vDvNOarFbk.ovElEzNDO', 'Đỗ Minh Tuấn', '0901000012', '5 Nguyễn Thị Minh Khai, Quận 3, TP.HCM', 'USER', 'ACTIVE', '2026-10-20 08:40:46', 1, 1, 0, NULL, NULL, 1, 'NORMAL', NULL),
(13, 'KH000013', 'user13', 'user13@example.com', '$2a$10$kzd1fGJMrUodZ6xedVrps.owEHjn6NzAS.8JlGObrg7dAs4Urw/Ci', 'Lý Thanh Sơn', '0901000013', '70 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', 'USER', 'ACTIVE', '2026-10-20 08:44:31', 0, 1, 0, NULL, NULL, 1, 'NORMAL', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `wishlist_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`wishlist_id`, `user_id`, `product_id`, `created_at`) VALUES
(3, 1, 4, '2026-10-12 09:56:37'),
(5, 2, 1, '2026-10-20 07:15:09');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`brand_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD UNIQUE KEY `unique_cart_product` (`cart_id`,`product_id`),
  ADD KEY `fk_cart_item_product` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `component_specs`
--
ALTER TABLE `component_specs`
  ADD PRIMARY KEY (`spec_id`),
  ADD UNIQUE KEY `unique_product_spec` (`product_id`,`spec_name`);

--
-- Indexes for table `customer_email_history`
--
ALTER TABLE `customer_email_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_customer_email_history` (`email_hash`,`user_id`),
  ADD KEY `idx_customer_email_history_user` (`user_id`);

--
-- Indexes for table `email_change_requests`
--
ALTER TABLE `email_change_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email_change_user_date` (`user_id`,`created_at`);

--
-- Indexes for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_email_verify_user_created` (`user_id`,`created_at`);

--
-- Indexes for table `inventory_movements`
--
ALTER TABLE `inventory_movements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inventory_product_time` (`product_id`,`created_at`),
  ADD KEY `idx_inventory_order` (`order_id`);

--
-- Indexes for table `invoice_print_requests`
--
ALTER TABLE `invoice_print_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD UNIQUE KEY `uk_invoice_print_request_order` (`order_id`),
  ADD KEY `idx_invoice_print_request_status_date` (`status`,`requested_at`),
  ADD KEY `fk_invoice_print_request_user` (`user_id`);

--
-- Indexes for table `member_benefit_usage`
--
ALTER TABLE `member_benefit_usage`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_member_benefit_user_type` (`user_id`,`benefit_type`),
  ADD UNIQUE KEY `uq_member_benefit_order` (`order_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `fk_order_user` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `fk_order_item_order` (`order_id`),
  ADD KEY `fk_order_item_product` (`product_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `idx_password_reset_user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `order_id` (`order_id`);

--
-- Indexes for table `pc_builds`
--
ALTER TABLE `pc_builds`
  ADD PRIMARY KEY (`build_id`),
  ADD KEY `fk_pc_build_user` (`user_id`);

--
-- Indexes for table `pc_build_items`
--
ALTER TABLE `pc_build_items`
  ADD PRIMARY KEY (`build_item_id`),
  ADD UNIQUE KEY `uk_pc_build_product` (`build_id`,`product_id`),
  ADD KEY `fk_pc_build_item_product` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `fk_product_category` (`category_id`),
  ADD KEY `fk_product_brand` (`brand_id`);

--
-- Indexes for table `product_promotions`
--
ALTER TABLE `product_promotions`
  ADD PRIMARY KEY (`promotion_id`),
  ADD KEY `idx_product_promotions_product_time` (`product_id`,`status`,`start_at`,`end_at`),
  ADD KEY `idx_product_promotions_campaign` (`promotion_type`,`campaign_year`);

--
-- Indexes for table `promotions`
--
ALTER TABLE `promotions`
  ADD PRIMARY KEY (`promotion_id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indexes for table `promotion_redemptions`
--
ALTER TABLE `promotion_redemptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_redemption_user_promo` (`user_id`,`promotion_id`),
  ADD UNIQUE KEY `uq_redemption_order` (`order_id`),
  ADD KEY `fk_redemption_promo` (`promotion_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD UNIQUE KEY `unique_user_product_review` (`user_id`,`product_id`),
  ADD KEY `fk_review_product` (`product_id`);

--
-- Indexes for table `support_conversations`
--
ALTER TABLE `support_conversations`
  ADD PRIMARY KEY (`conversation_id`),
  ADD UNIQUE KEY `uk_support_user` (`user_id`),
  ADD KEY `idx_support_last_message` (`last_message_at`);

--
-- Indexes for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `idx_support_conversation_message` (`conversation_id`,`message_id`),
  ADD KEY `idx_support_unread` (`conversation_id`,`sender`,`is_read`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `uk_users_customer_code` (`customer_code`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD UNIQUE KEY `unique_user_wishlist_product` (`user_id`,`product_id`),
  ADD KEY `fk_wishlist_product` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `brand_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `category_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `component_specs`
--
ALTER TABLE `component_specs`
  MODIFY `spec_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT for table `customer_email_history`
--
ALTER TABLE `customer_email_history`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `email_change_requests`
--
ALTER TABLE `email_change_requests`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inventory_movements`
--
ALTER TABLE `inventory_movements`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `invoice_print_requests`
--
ALTER TABLE `invoice_print_requests`
  MODIFY `request_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `member_benefit_usage`
--
ALTER TABLE `member_benefit_usage`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `pc_builds`
--
ALTER TABLE `pc_builds`
  MODIFY `build_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `pc_build_items`
--
ALTER TABLE `pc_build_items`
  MODIFY `build_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `product_promotions`
--
ALTER TABLE `product_promotions`
  MODIFY `promotion_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `promotions`
--
ALTER TABLE `promotions`
  MODIFY `promotion_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `promotion_redemptions`
--
ALTER TABLE `promotion_redemptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `review_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `support_conversations`
--
ALTER TABLE `support_conversations`
  MODIFY `conversation_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `support_messages`
--
ALTER TABLE `support_messages`
  MODIFY `message_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `wishlist`
--
ALTER TABLE `wishlist`
  MODIFY `wishlist_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `fk_cart_item_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_cart_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `component_specs`
--
ALTER TABLE `component_specs`
  ADD CONSTRAINT `fk_spec_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `customer_email_history`
--
ALTER TABLE `customer_email_history`
  ADD CONSTRAINT `fk_customer_email_history_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `email_change_requests`
--
ALTER TABLE `email_change_requests`
  ADD CONSTRAINT `fk_email_change_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `email_verification_tokens`
--
ALTER TABLE `email_verification_tokens`
  ADD CONSTRAINT `fk_email_verify_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `inventory_movements`
--
ALTER TABLE `inventory_movements`
  ADD CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `invoice_print_requests`
--
ALTER TABLE `invoice_print_requests`
  ADD CONSTRAINT `fk_invoice_print_request_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_invoice_print_request_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `member_benefit_usage`
--
ALTER TABLE `member_benefit_usage`
  ADD CONSTRAINT `fk_member_benefit_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_member_benefit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD CONSTRAINT `fk_password_reset_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`);

--
-- Constraints for table `pc_builds`
--
ALTER TABLE `pc_builds`
  ADD CONSTRAINT `fk_pc_build_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `pc_build_items`
--
ALTER TABLE `pc_build_items`
  ADD CONSTRAINT `fk_pc_build_item_build` FOREIGN KEY (`build_id`) REFERENCES `pc_builds` (`build_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pc_build_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_product_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`brand_id`),
  ADD CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`);

--
-- Constraints for table `product_promotions`
--
ALTER TABLE `product_promotions`
  ADD CONSTRAINT `fk_product_promotions_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

--
-- Constraints for table `promotion_redemptions`
--
ALTER TABLE `promotion_redemptions`
  ADD CONSTRAINT `fk_redemption_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`),
  ADD CONSTRAINT `fk_redemption_promo` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`promotion_id`),
  ADD CONSTRAINT `fk_redemption_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_review_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `support_conversations`
--
ALTER TABLE `support_conversations`
  ADD CONSTRAINT `fk_support_conversation_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `support_messages`
--
ALTER TABLE `support_messages`
  ADD CONSTRAINT `fk_support_message_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `support_conversations` (`conversation_id`) ON DELETE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `fk_wishlist_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
