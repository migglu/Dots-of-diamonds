-- phpMyAdmin SQL Dump
-- version 3.4.5deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 27, 2012 at 06:08 PM
-- Server version: 5.1.58
-- PHP Version: 5.3.6-13ubuntu3.6

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dots_of_diamonds`
--

-- --------------------------------------------------------

--
-- Table structure for table `dd_users`
--

CREATE TABLE IF NOT EXISTS `dd_users` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8_unicode_ci NOT NULL,
  `mail` text COLLATE utf8_unicode_ci NOT NULL,
  `pass` text COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- Dumping data for table `dd_users`
--

INSERT INTO `dd_users` (`id`, `name`, `mail`, `pass`) VALUES
(1, 'Shimano', 'asd@asd.asd', '8287458823facb8ff918dbfabcd22ccb'),
(2, 'Shimano', 'asd@asd.asd', '8287458823facb8ff918dbfabcd22ccb'),
(3, 'Shimano', 'asd@asd.asd', '8287458823facb8ff918dbfabcd22ccb'),
(4, 'Shimano', 'asd@asd.asd', '8287458823facb8ff918dbfabcd22ccb');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
