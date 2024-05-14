-- phpMyAdmin SQL Dump
-- version 5.0.4deb2+deb11u1
-- https://www.phpmyadmin.net/
--
-- Gostitelj: localhost:3306
-- Čas nastanka: 24. mar 2024 ob 14.19
-- Različica strežnika: 10.5.23-MariaDB-0+deb11u1
-- Različica PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Zbirka podatkov: `FRI`
--

-- --------------------------------------------------------

--
-- Struktura tabele `Misije`
--

CREATE TABLE `Misije` (
  `ID_misije` int(11) NOT NULL,
  `ID_planeta` int(11) NOT NULL,
  `Datum` date NOT NULL,
  `Razporozljiva` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `Misije`
--

INSERT INTO `Misije` (`ID_misije`, `ID_planeta`, `Datum`, `Razporozljiva`) VALUES
(1, 1, '2024-04-23', 391),
(2, 2, '2024-04-28', 235);

-- --------------------------------------------------------

--
-- Struktura tabele `Planet`
--

CREATE TABLE `Planet` (
  `ID_planeta` int(11) NOT NULL,
  `Ime_planeta` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `Planet`
--

INSERT INTO `Planet` (`ID_planeta`, `Ime_planeta`) VALUES
(1, 'Luna'),
(2, 'Mars');

-- --------------------------------------------------------

--
-- Struktura tabele `Rezervacija`
--

CREATE TABLE `Rezervacija` (
  `ID_rezervacije` int(11) NOT NULL,
  `ID_upoimena` int(11) NOT NULL,
  `ID_misije` int(11) NOT NULL,
  `stevilomest` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `Rezervacija`
--

INSERT INTO `Rezervacija` (`ID_rezervacije`, `ID_upoimena`, `ID_misije`, `stevilomest`) VALUES
(6, 1, 2, 15),
(7, 2, 1, 9);

--
-- Sprožilci `Rezervacija`
--
DELIMITER $$
CREATE TRIGGER `odstej_mesta_trigger` AFTER INSERT ON `Rezervacija` FOR EACH ROW BEGIN
    UPDATE Misije
    SET Razporozljiva = Razporozljiva - NEW.stevilomest
    WHERE ID_misije = NEW.ID_misije;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `pristej_mesta_trigger` AFTER DELETE ON `Rezervacija` FOR EACH ROW BEGIN
    UPDATE Misije
    SET Razporozljiva = Razporozljiva + OLD.stevilomest
    WHERE ID_misije = OLD.ID_misije;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Struktura tabele `Uporabniki`
--

CREATE TABLE `Uporabniki` (
  `ID_uporabnika` int(11) NOT NULL,
  `Ime` varchar(20) NOT NULL,
  `Priimek` varchar(50) NOT NULL,
  `Datum rojstva` date NOT NULL,
  `Naslov` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `Uporabniki`
--

INSERT INTO `Uporabniki` (`ID_uporabnika`, `Ime`, `Priimek`, `Datum rojstva`, `Naslov`) VALUES
(1, 'Miha', 'Skrabolje', '2024-03-24', 'Večna pot 113 Ljubljana'),
(2, 'Janez', 'Novak', '2024-03-25', 'Prešernova ulica 1 Ljubljana');

-- --------------------------------------------------------

--
-- Struktura tabele `UporabniskaImena`
--

CREATE TABLE `UporabniskaImena` (
  `ID_upoimena` int(11) NOT NULL,
  `upoime` varchar(50) NOT NULL,
  `upogeslo` varchar(50) NOT NULL,
  `ID_uporabnika` int(11) DEFAULT NULL,
  `admin` char(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Odloži podatke za tabelo `UporabniskaImena`
--

INSERT INTO `UporabniskaImena` (`ID_upoimena`, `upoime`, `upogeslo`, `ID_uporabnika`, `admin`) VALUES
(1, 'mihas', 'mihas', 1, 'T'),
(2, 'janezn', 'janezn', 2, 'F');

--
-- Indeksi zavrženih tabel
--

--
-- Indeksi tabele `Misije`
--
ALTER TABLE `Misije`
  ADD PRIMARY KEY (`ID_misije`),
  ADD UNIQUE KEY `ID_misije` (`ID_misije`),
  ADD KEY `ID_planeta` (`ID_planeta`);

--
-- Indeksi tabele `Planet`
--
ALTER TABLE `Planet`
  ADD PRIMARY KEY (`ID_planeta`),
  ADD UNIQUE KEY `ID_planeta` (`ID_planeta`);

--
-- Indeksi tabele `Rezervacija`
--
ALTER TABLE `Rezervacija`
  ADD PRIMARY KEY (`ID_rezervacije`),
  ADD UNIQUE KEY `ID_rezervacije` (`ID_rezervacije`),
  ADD KEY `ID_upoimena` (`ID_upoimena`),
  ADD KEY `ID_misije` (`ID_misije`);

--
-- Indeksi tabele `Uporabniki`
--
ALTER TABLE `Uporabniki`
  ADD PRIMARY KEY (`ID_uporabnika`),
  ADD UNIQUE KEY `ID_uporabnika` (`ID_uporabnika`);

--
-- Indeksi tabele `UporabniskaImena`
--
ALTER TABLE `UporabniskaImena`
  ADD PRIMARY KEY (`ID_upoimena`),
  ADD UNIQUE KEY `ID_upoimena` (`ID_upoimena`),
  ADD KEY `ID_uporabnika` (`ID_uporabnika`);

--
-- AUTO_INCREMENT zavrženih tabel
--

--
-- AUTO_INCREMENT tabele `Misije`
--
ALTER TABLE `Misije`
  MODIFY `ID_misije` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT tabele `Planet`
--
ALTER TABLE `Planet`
  MODIFY `ID_planeta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT tabele `Rezervacija`
--
ALTER TABLE `Rezervacija`
  MODIFY `ID_rezervacije` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT tabele `Uporabniki`
--
ALTER TABLE `Uporabniki`
  MODIFY `ID_uporabnika` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT tabele `UporabniskaImena`
--
ALTER TABLE `UporabniskaImena`
  MODIFY `ID_upoimena` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Omejitve tabel za povzetek stanja
--

--
-- Omejitve za tabelo `Misije`
--
ALTER TABLE `Misije`
  ADD CONSTRAINT `Misije_ibfk_1` FOREIGN KEY (`ID_planeta`) REFERENCES `Planet` (`ID_planeta`);

--
-- Omejitve za tabelo `Rezervacija`
--
ALTER TABLE `Rezervacija`
  ADD CONSTRAINT `Rezervacija_ibfk_1` FOREIGN KEY (`ID_upoimena`) REFERENCES `UporabniskaImena` (`ID_upoimena`),
  ADD CONSTRAINT `Rezervacija_ibfk_2` FOREIGN KEY (`ID_misije`) REFERENCES `Misije` (`ID_misije`);

--
-- Omejitve za tabelo `UporabniskaImena`
--
ALTER TABLE `UporabniskaImena`
  ADD CONSTRAINT `UporabniskaImena_ibfk_1` FOREIGN KEY (`ID_uporabnika`) REFERENCES `Uporabniki` (`ID_uporabnika`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
