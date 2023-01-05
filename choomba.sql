-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 05 jan. 2023 à 14:07
-- Version du serveur : 10.4.25-MariaDB
-- Version de PHP : 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `choomba`
--

-- --------------------------------------------------------

--
-- Structure de la table `compte`
--

CREATE TABLE `compte` (
  `idCompte` int(11) NOT NULL,
  `Mail` varchar(100) NOT NULL,
  `Pseudo` varchar(40) NOT NULL,
  `MDP` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `compte`
--

INSERT INTO `compte` (`idCompte`, `Mail`, `Pseudo`, `MDP`) VALUES
(1, 'mail@mail.fr', 'pseudoTest', '1234');

-- --------------------------------------------------------

--
-- Structure de la table `mj`
--

CREATE TABLE `mj` (
  `idMJ` int(11) NOT NULL,
  `Histoire` text NOT NULL,
  `idCompte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `participe`
--

CREATE TABLE `participe` (
  `idParticipe` int(11) NOT NULL,
  `idPartie` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `partie`
--

CREATE TABLE `partie` (
  `idPartie` int(11) NOT NULL,
  `Code` int(11) NOT NULL,
  `idMJ` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `personnages`
--

CREATE TABLE `personnages` (
  `id` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `intelligence` int(11) NOT NULL,
  `volonte` int(11) NOT NULL,
  `prestance` int(11) NOT NULL,
  `empathie` int(11) NOT NULL,
  `reflexes` int(11) NOT NULL,
  `chance` int(11) NOT NULL,
  `corps` int(11) NOT NULL,
  `dexterite` int(11) NOT NULL,
  `mouvement` int(11) NOT NULL,
  `technique` int(11) NOT NULL,
  `humanite` int(11) NOT NULL,
  `PS` int(11) NOT NULL,
  `idCompte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `personnages`
--

INSERT INTO `personnages` (`id`, `nom`, `prenom`, `intelligence`, `volonte`, `prestance`, `empathie`, `reflexes`, `chance`, `corps`, `dexterite`, `mouvement`, `technique`, `humanite`, `PS`, `idCompte`) VALUES
(110849, 'vandenberghe', 'ilian', 5, 5, 5, 5, 5, 8, 8, 8, 8, 5, 50, 45, 1);

-- --------------------------------------------------------

--
-- Structure de la table `pnj`
--

CREATE TABLE `pnj` (
  `idPNJ` int(11) NOT NULL,
  `Fiche` text NOT NULL,
  `idMJ` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `compte`
--
ALTER TABLE `compte`
  ADD PRIMARY KEY (`idCompte`);

--
-- Index pour la table `mj`
--
ALTER TABLE `mj`
  ADD PRIMARY KEY (`idMJ`),
  ADD KEY `idCompte` (`idCompte`);

--
-- Index pour la table `participe`
--
ALTER TABLE `participe`
  ADD PRIMARY KEY (`idParticipe`),
  ADD KEY `idPartie` (`idPartie`);

--
-- Index pour la table `partie`
--
ALTER TABLE `partie`
  ADD PRIMARY KEY (`idPartie`),
  ADD KEY `idMJ` (`idMJ`);

--
-- Index pour la table `personnages`
--
ALTER TABLE `personnages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCompte` (`idCompte`);

--
-- Index pour la table `pnj`
--
ALTER TABLE `pnj`
  ADD PRIMARY KEY (`idPNJ`),
  ADD KEY `idMJ` (`idMJ`);

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `mj`
--
ALTER TABLE `mj`
  ADD CONSTRAINT `mj_ibfk_1` FOREIGN KEY (`idCompte`) REFERENCES `compte` (`idCompte`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `participe`
--
ALTER TABLE `participe`
  ADD CONSTRAINT `participe_ibfk_1` FOREIGN KEY (`idPartie`) REFERENCES `partie` (`idPartie`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `partie`
--
ALTER TABLE `partie`
  ADD CONSTRAINT `partie_ibfk_1` FOREIGN KEY (`idMJ`) REFERENCES `mj` (`idMJ`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `personnages`
--
ALTER TABLE `personnages`
  ADD CONSTRAINT `personnages_ibfk_1` FOREIGN KEY (`idCompte`) REFERENCES `compte` (`idCompte`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `pnj`
--
ALTER TABLE `pnj`
  ADD CONSTRAINT `pnj_ibfk_1` FOREIGN KEY (`idMJ`) REFERENCES `mj` (`idMJ`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
