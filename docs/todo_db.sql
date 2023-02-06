-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 06 fév. 2023 à 09:10
-- Version du serveur : 5.7.36
-- Version de PHP : 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `todo_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `customer`
--

DROP TABLE IF EXISTS `customer`;
CREATE TABLE IF NOT EXISTS `customer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `pincode` varchar(255) NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `customer`
--

INSERT INTO `customer` (`id`, `email`, `pincode`, `is_deleted`) VALUES
(1, 'bedulaurent@gmail.com', '1234', 0);

-- --------------------------------------------------------

--
-- Structure de la table `priority`
--

DROP TABLE IF EXISTS `priority`;
CREATE TABLE IF NOT EXISTS `priority` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `label` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `priority`
--

INSERT INTO `priority` (`id`, `label`, `color`) VALUES
(1, 'Haute', '#F62E36'),
(2, 'Normale', '#F39700'),
(3, 'Basse', '#019A66');

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `deadline_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `id_priority` int(11) NOT NULL DEFAULT '2',
  `id_todo` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_priority` (`id_priority`),
  KEY `id_todo` (`id_todo`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `task`
--

INSERT INTO `task` (`id`, `title`, `description`, `deadline_date`, `is_completed`, `is_deleted`, `id_priority`, `id_todo`) VALUES
(1, 'tempus sit', 'Pellentesque eget nunc. Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis.', '2023-02-11 06:33:42', 0, 0, 1, 2),
(2, 'nulla nunc', 'Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.', '2023-03-10 07:24:15', 0, 0, 2, 2),
(3, 'sed', 'Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.', '2023-09-09 07:55:52', 0, 0, 1, 1),
(4, 'nisi at', 'Vestibulum sed magna at nunc commodo placerat.', '2023-05-01 14:21:21', 1, 1, 2, 1),
(5, 'nisi nam', 'In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.', '2023-11-26 07:01:01', 0, 1, 2, 3),
(6, 'ipsum', 'Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.', '2023-08-17 07:57:00', 1, 0, 1, 3),
(7, 'magna vulputate', 'Nulla facilisi. Cras non velit nec nisi vulputate nonummy.', '2023-06-09 10:46:09', 1, 1, 3, 1),
(8, 'non', 'Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.', '2023-05-03 20:33:14', 1, 0, 2, 3),
(9, 'volutpat', 'Sed vel enim sit amet nunc viverra dapibus.', '2023-09-17 14:05:52', 1, 1, 3, 1),
(10, 'donec diam neque', 'In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.', '2023-05-18 06:28:35', 1, 0, 3, 1),
(11, 'quis odio consequat', 'Integer ac leo. Pellentesque ultrices mattis odio.', '2023-04-17 23:39:48', 0, 0, 2, 1),
(12, 'libero', 'Integer ac neque. Duis bibendum.', '2023-03-05 08:34:05', 1, 0, 3, 3),
(13, 'semper sapien', 'Nullam sit amet turpis elementum ligula vehicula consequat.', '2023-11-14 07:24:55', 0, 0, 3, 1),
(14, 'in lectus pellentesque', 'Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.', '2023-04-15 05:32:42', 1, 1, 3, 2),
(15, 'in', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', '2023-08-02 04:50:42', 0, 1, 2, 2),
(16, 'nunc', 'Duis consequat dui nec nisi volutpat eleifend.', '2023-12-06 21:39:27', 1, 0, 3, 3),
(17, 'vel', 'Phasellus sit amet erat. Nulla tempus.', '2023-04-16 12:04:41', 1, 0, 1, 3),
(18, 'scelerisque quam', 'Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci.', '2023-02-07 15:35:23', 1, 1, 2, 3),
(19, 'ante', 'Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus.', '2023-01-07 02:51:22', 0, 1, 3, 3),
(20, 'molestie', 'Ut at dolor quis odio consequat varius.', '2023-07-26 13:02:37', 0, 1, 2, 2),
(21, 'pede justo', 'Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum.', '2023-04-08 21:37:25', 0, 0, 1, 2),
(22, 'donec quis orci', 'Vestibulum sed magna at nunc commodo placerat.', '2023-09-12 02:59:35', 0, 0, 1, 2),
(23, 'turpis elementum', 'Sed accumsan felis. Ut at dolor quis odio consequat varius.', '2023-05-29 10:29:42', 0, 0, 1, 1),
(24, 'quam', 'Suspendisse potenti. Cras in purus eu magna vulputate luctus.', '2023-03-30 09:36:47', 0, 0, 1, 3),
(25, 'semper interdum mauris', 'Pellentesque viverra pede ac diam.', '2023-03-08 09:07:01', 1, 1, 1, 2),
(26, 'sed augue aliquam', 'Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.', '2023-09-28 11:09:58', 1, 1, 1, 1),
(27, 'habitasse platea', 'Fusce consequat. Nulla nisl.', '2023-04-07 10:37:22', 0, 0, 1, 1),
(28, 'sapien dignissim vestibulum', 'In est risus, auctor sed, tristique in, tempus sit amet, sem.', '2023-07-11 18:23:28', 0, 0, 2, 1),
(29, 'duis ac nibh', 'Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.', '2023-11-13 05:17:15', 1, 1, 3, 1),
(30, 'ultrices erat', 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est.', '2023-12-26 03:22:03', 1, 0, 1, 3);

-- --------------------------------------------------------

--
-- Structure de la table `todo`
--

DROP TABLE IF EXISTS `todo`;
CREATE TABLE IF NOT EXISTS `todo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_favorite` tinyint(1) NOT NULL DEFAULT '0',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0',
  `id_customer` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_customer` (`id_customer`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `todo`
--

INSERT INTO `todo` (`id`, `title`, `description`, `is_favorite`, `is_deleted`, `id_customer`) VALUES
(1, 'Courses', 'Liste de courses de la semaine ...', 0, 0, 1),
(2, 'Travail', NULL, 0, 0, 1),
(3, 'Divers', 'A faire quand j\'ai le temps ...', 0, 0, 1);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`id_priority`) REFERENCES `priority` (`id`),
  ADD CONSTRAINT `task_ibfk_2` FOREIGN KEY (`id_todo`) REFERENCES `todo` (`id`);

--
-- Contraintes pour la table `todo`
--
ALTER TABLE `todo`
  ADD CONSTRAINT `todo_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customer` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
