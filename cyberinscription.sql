-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 05 jan. 2023 à 12:33
-- Version du serveur :  5.7.31
-- Version de PHP : 7.3.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `cyberinscription`
--

-- --------------------------------------------------------

--
-- Structure de la table `compte`
--

DROP TABLE IF EXISTS `compte`;
CREATE TABLE IF NOT EXISTS `compte` (
  `idCompte` int(11) NOT NULL,
  `Mail` varchar(100) NOT NULL,
  `Pseudo` varchar(100) NOT NULL,
  `MDP` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`idCompte`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `mj`
--

DROP TABLE IF EXISTS `mj`;
CREATE TABLE IF NOT EXISTS `mj` (
  `idMJ` int(11) NOT NULL,
  `Histoire` tinytext NOT NULL,
  `idCompte` int(11) NOT NULL,
  PRIMARY KEY (`idMJ`),
  KEY `idCompte` (`idCompte`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `participe`
--

DROP TABLE IF EXISTS `participe`;
CREATE TABLE IF NOT EXISTS `participe` (
  `idParticipe` int(11) NOT NULL,
  `idPartie` int(11) NOT NULL,
  PRIMARY KEY (`idParticipe`),
  KEY `idPartie` (`idPartie`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `partie`
--

DROP TABLE IF EXISTS `partie`;
CREATE TABLE IF NOT EXISTS `partie` (
  `idPartie` int(11) NOT NULL,
  `Code` int(11) NOT NULL,
  `idMJ` int(11) NOT NULL,
  PRIMARY KEY (`idPartie`),
  KEY `idMJ` (`idMJ`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `personnage`
--

DROP TABLE IF EXISTS `personnage`;
CREATE TABLE IF NOT EXISTS `personnage` (
  `idPersonnage` int(11) NOT NULL,
  `Fiche` tinytext NOT NULL,
  `idCompte` int(11) NOT NULL,
  PRIMARY KEY (`idPersonnage`),
  KEY `idCompte` (`idCompte`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `pnj`
--

DROP TABLE IF EXISTS `pnj`;
CREATE TABLE IF NOT EXISTS `pnj` (
  `idPNJ` int(11) NOT NULL,
  `Fiche` tinytext NOT NULL,
  `idMJ` int(11) NOT NULL,
  PRIMARY KEY (`idPNJ`),
  KEY `idMJ` (`idMJ`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

DROP TABLE IF EXISTS `utilisateurs`;
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `ip` varchar(20) NOT NULL,
  `token` text NOT NULL,
  `date_inscription` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
