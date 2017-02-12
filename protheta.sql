-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Feb 06, 2017 at 05:00 AM
-- Server version: 10.1.9-MariaDB
-- PHP Version: 5.6.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `protheta`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_category`
--

CREATE TABLE `tbl_category` (
  `cat_id` int(11) NOT NULL,
  `cat_name` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tbl_category`
--

INSERT INTO `tbl_category` (`cat_id`, `cat_name`) VALUES
(1, 'food'),
(2, 'shopping'),
(3, 'video'),
(4, 'game'),
(5, 'news'),
(6, 'airline'),
(7, 'weather'),
(8, 'bank');

-- --------------------------------------------------------

--
-- Table structure for table `tbl_url`
--

CREATE TABLE `tbl_url` (
  `url_id` int(11) NOT NULL,
  `url` varchar(255) COLLATE utf8_bin NOT NULL,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `cat_id_1` int(11) DEFAULT NULL,
  `cat_id_2` int(11) DEFAULT NULL,
  `cat_id_3` int(11) DEFAULT NULL,
  `block` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tbl_url`
--

INSERT INTO `tbl_url` (`url_id`, `url`, `name`, `cat_id_1`, `cat_id_2`, `cat_id_3`, `block`) VALUES
(1, 'https://www.youtube.com/', 'YouTube', 3, 4, 5, 0),
(2, 'https://www.twitch.tv/', 'Twitch.tv', 4, 3, NULL, 0),
(3, 'http://www.cnn.com/', 'CNN', 5, NULL, NULL, 0),
(4, 'http://abcnews.go.com/', 'ABC News', 5, NULL, NULL, 0),
(5, 'https://qz.com/', 'QUARTZ', 5, NULL, NULL, 0),
(6, 'https://m.delta.com/?p=homeScreen', 'Delta', 6, NULL, NULL, 0),
(7, 'https://m.alaskaair.com/', 'Alaska Airline', 6, NULL, NULL, 0),
(8, 'https://mobile.united.com/', 'United Airline', 6, NULL, NULL, 0),
(9, 'https://mobile.southwest.com/#/', 'Southwest Airline', 6, NULL, NULL, 0),
(10, 'http://mobile.jetblue.com/mt/www.jetblue.com', 'Jetblue Airline', 6, NULL, NULL, 0),
(11, 'https://m.yelp.com/', 'Yelp', 1, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_word`
--

CREATE TABLE `tbl_word` (
  `word_id` int(11) NOT NULL,
  `word` varchar(255) COLLATE utf8_bin NOT NULL,
  `cat_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `tbl_word`
--

INSERT INTO `tbl_word` (`word_id`, `word`, `cat_id`) VALUES
(1, 'food', 1),
(2, 'travel', 6);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_category`
--
ALTER TABLE `tbl_category`
  ADD PRIMARY KEY (`cat_id`);

--
-- Indexes for table `tbl_url`
--
ALTER TABLE `tbl_url`
  ADD PRIMARY KEY (`url_id`);

--
-- Indexes for table `tbl_word`
--
ALTER TABLE `tbl_word`
  ADD PRIMARY KEY (`word_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_category`
--
ALTER TABLE `tbl_category`
  MODIFY `cat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `tbl_url`
--
ALTER TABLE `tbl_url`
  MODIFY `url_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
