-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-11-2025 a las 16:24:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vivo`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `captura_pantalla_beneficiado`
--

CREATE TABLE `captura_pantalla_beneficiado` (
  `id` int(11) NOT NULL,
  `tipo_proc` varchar(50) NOT NULL,
  `ano` int(11) NOT NULL,
  `mes` varchar(20) NOT NULL,
  `provincia` varchar(50) DEFAULT NULL,
  `zona` varchar(100) DEFAULT NULL,
  `compra_grs` varchar(100) DEFAULT NULL,
  `tipo_cliente` varchar(100) DEFAULT NULL,
  `nombre` varchar(150) DEFAULT NULL,
  `grs` int(11) DEFAULT 0,
  `rp` int(11) DEFAULT 0,
  `grs_vivo` int(11) DEFAULT 0,
  `santa_elena` int(11) DEFAULT 0,
  `granjas_chicas` int(11) DEFAULT 0,
  `rosario` int(11) DEFAULT 0,
  `sanfern_lima` int(11) DEFAULT 0,
  `avicola_renzo` int(11) DEFAULT 0,
  `avelino` int(11) DEFAULT 0,
  `peladores` int(11) DEFAULT 0,
  `avicruz` int(11) DEFAULT 0,
  `rafael` int(11) DEFAULT 0,
  `matilde` int(11) DEFAULT 0,
  `avirox` int(11) DEFAULT 0,
  `julia` int(11) DEFAULT 0,
  `simon` int(11) DEFAULT 0,
  `yesica` int(11) DEFAULT 0,
  `gabriel` int(11) DEFAULT 0,
  `arturo` int(11) DEFAULT 0,
  `nicolas` int(11) DEFAULT 0,
  `luis_f` int(11) DEFAULT 0,
  `mirella` int(11) DEFAULT 0,
  `otros` int(11) DEFAULT 0,
  `potencial_minimo` int(11) DEFAULT 0,
  `potencial_maximo` int(11) DEFAULT 0,
  `condicion_ptmin` varchar(255) DEFAULT NULL,
  `condicion_ptmax` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `captura_pantalla_beneficiado`
--

INSERT INTO `captura_pantalla_beneficiado` (`id`, `tipo_proc`, `ano`, `mes`, `provincia`, `zona`, `compra_grs`, `tipo_cliente`, `nombre`, `grs`, `rp`, `grs_vivo`, `santa_elena`, `granjas_chicas`, `rosario`, `sanfern_lima`, `avicola_renzo`, `avelino`, `peladores`, `avicruz`, `rafael`, `matilde`, `avirox`, `julia`, `simon`, `yesica`, `gabriel`, `arturo`, `nicolas`, `luis_f`, `mirella`, `otros`, `potencial_minimo`, `potencial_maximo`, `condicion_ptmin`, `condicion_ptmax`, `observaciones`) VALUES
(1, 'Arequipa Beneficiado', 2024, 'MAYO', 'AREQUIPA', 'HORIZONTAL', 'NO', 'BOGEDA', 'Soto quispe', 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, '', 'NO RECORTES DE PRODUCTO', ''),
(3, 'Arequipa Beneficiado', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'PROVEEDOR', 'ROBERTO', 100, 3, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 2, 0, 10, 10, 0, 10, 0, 0, 10, 0, 0, 100, 100, '', '', ''),
(11, 'Arequipa Beneficiado', 2024, '', '', '', 'SI', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', ''),
(12, 'Arequipa Beneficiado', 2024, 'Octubre', 'Arequipa', 'Arequipa', 'SI', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', ''),
(14, 'Provincia Beneficiado', 2024, '', '', '', 'NO', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', ''),
(15, 'Provincia Beneficiado', 2024, '', '', '', 'SI', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `captura_pantalla_vivo`
--

CREATE TABLE `captura_pantalla_vivo` (
  `id` int(11) NOT NULL,
  `tipo_proc` varchar(20) NOT NULL,
  `ano` int(11) NOT NULL,
  `mes` varchar(20) NOT NULL,
  `provincia` varchar(50) NOT NULL,
  `zona` varchar(50) NOT NULL,
  `compra` varchar(10) DEFAULT NULL,
  `tipo_cliente` varchar(50) DEFAULT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `grs` int(11) DEFAULT 0,
  `rp` int(11) DEFAULT 0,
  `renzo` int(11) DEFAULT 0,
  `fafo` int(11) DEFAULT 0,
  `santa_angela` int(11) DEFAULT 0,
  `jorge_pan` int(11) DEFAULT 0,
  `mirian_g` int(11) DEFAULT 0,
  `vasquez` int(11) DEFAULT 0,
  `san_joaquin` int(11) DEFAULT 0,
  `fortunato` int(11) DEFAULT 0,
  `rosario` int(11) DEFAULT 0,
  `perca` int(11) DEFAULT 0,
  `gamboa` int(11) DEFAULT 0,
  `asoc_sondor` int(11) DEFAULT 0,
  `pollo_lima` int(11) DEFAULT 0,
  `otras_granjas_chicas` int(11) DEFAULT 0,
  `potencial_minimo` int(11) DEFAULT 0,
  `potencial_maximo` int(11) DEFAULT 0,
  `condicion_ptmin` varchar(255) DEFAULT NULL,
  `condicion_ptmax` varchar(255) DEFAULT NULL,
  `observaciones` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `captura_pantalla_vivo`
--

INSERT INTO `captura_pantalla_vivo` (`id`, `tipo_proc`, `ano`, `mes`, `provincia`, `zona`, `compra`, `tipo_cliente`, `nombre`, `grs`, `rp`, `renzo`, `fafo`, `santa_angela`, `jorge_pan`, `mirian_g`, `vasquez`, `san_joaquin`, `fortunato`, `rosario`, `perca`, `gamboa`, `asoc_sondor`, `pollo_lima`, `otras_granjas_chicas`, `potencial_minimo`, `potencial_maximo`, `condicion_ptmin`, `condicion_ptmax`, `observaciones`) VALUES
(2, 'Provincia Vivo', 2026, 'Septiembre', 'Arequipa', 'Camana', 'NO', 'Distribuidor', 'Hilario Rojas Carolina ', 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 40, '', '', ''),
(7, 'Arequipa Vivo', 2024, 'Septiembre', 'Arequipa', 'Arequipa', 'SI', 'DISTRIBUIDOR', 'Jose Jhonatan', 0, 0, 2, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, '', '', 'a'),
(8, 'Arequipa Vivo', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'NO', 'DISTRIBUIDOR', 'Jose Jhonatan', 0, 0, 3, 0, 0, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, 0, 3, 0, 0, '', '', ''),
(9, 'Provincia Vivo', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'DISTRIBUIDOR', 'Jose Jhonatan', 0, 3, 0, NULL, NULL, 0, 3, 0, 0, 0, NULL, 3, 0, 0, NULL, 0, 0, 0, '', '', ''),
(10, 'Provincia Vivo', 2025, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'DISTRIBUIDOR', 'Jose Jhonatan', 3, 0, 3, NULL, NULL, 0, 0, 0, 0, 0, NULL, 0, 0, 0, NULL, 0, 0, 0, '', '', ''),
(11, 'Arequipa Vivo', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'DISTRIBUIDOR', 'Sergio Andre', 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, '', '', ''),
(12, 'Arequipa Vivo', 2024, '', '', '', 'SI', '', '', 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, '', '', ''),
(14, 'Arequipa Vivo', 2024, '', '', '', 'SI', '', '', 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, '', '', ''),
(17, 'Provincia Vivo', 2024, '', '', '', 'SI', '', '', 0, 0, 0, NULL, NULL, 0, 0, 0, 0, 0, NULL, 0, 0, 0, NULL, 0, 0, 0, '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_condicion`
--

CREATE TABLE `com_condicion` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(450) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_condicion`
--

INSERT INTO `com_condicion` (`codigo`, `nombre`) VALUES
(1, 'EMPRESA'),
(2, 'MAYORISTAS'),
(3, 'MAYORISTAS/PELADOR');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_corte`
--

CREATE TABLE `com_corte` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(150) DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_corte`
--

INSERT INTO `com_corte` (`codigo`, `nombre`) VALUES
(1, 'PECHUGA ESPECIAL'),
(2, 'PIERNA ESPECIAL'),
(3, 'MUSLITO'),
(4, 'ESPINAZO'),
(5, 'ALITAS'),
(6, 'HIGADO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_alterno`
--

CREATE TABLE `com_db_alterno` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `provincia` int(11) DEFAULT NULL,
  `mercado` double DEFAULT NULL,
  `tipo` double DEFAULT NULL,
  `precioMin` double DEFAULT NULL,
  `precioMax` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_alterno`
--

INSERT INTO `com_db_alterno` (`id`, `fecha`, `provincia`, `mercado`, `tipo`, `precioMin`, `precioMax`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('6dc42b24-84bb-4fe5-b08f-d281629e16d2', '2025-10-23', 1, 1, 2, 1.5, 4.5, 'TAVO', '2025-10-23 16:28:56', 'TAVO', '2025-10-23 11:30:38'),
('81d321bc-b260-403c-8035-0647912e6517', '2025-10-23', 1, 1, 4, 8.9, 4.3, 'TAVO', '2025-10-23 16:29:04', 'TAVO', '2025-10-23 11:30:38'),
('da6ebda8-940f-4479-953d-fa655c1fb863', '2025-10-23', 1, 1, 8, 7, 4, 'TAVO', '2025-10-23 16:29:13', 'TAVO', '2025-10-23 11:30:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_beneficio_provincia`
--

CREATE TABLE `com_db_beneficio_provincia` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `provincia` int(11) DEFAULT NULL,
  `proveedor` int(11) DEFAULT NULL,
  `precioMayEntero` double DEFAULT NULL,
  `precioMayMejorado` double DEFAULT NULL,
  `precioMayCarcasa` double DEFAULT NULL,
  `precioPubMejorado` double DEFAULT NULL,
  `precioPubCarcasa` double DEFAULT NULL,
  `pesoPromMenor` double DEFAULT NULL,
  `pesoPromMayor` double DEFAULT NULL,
  `colorMin` double DEFAULT NULL,
  `colorMax` double DEFAULT NULL,
  `cantidad` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_beneficio_provincia`
--

INSERT INTO `com_db_beneficio_provincia` (`id`, `fecha`, `provincia`, `proveedor`, `precioMayEntero`, `precioMayMejorado`, `precioMayCarcasa`, `precioPubMejorado`, `precioPubCarcasa`, `pesoPromMenor`, `pesoPromMayor`, `colorMin`, `colorMax`, `cantidad`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('18470996-c321-4c0d-b98e-fc039c3d23e6', '2025-10-21', 9, 48, 8.9, 8.8, 8.7, 8.95, 9.1, 9.3, 9.7, 5, 6, 6000, 'TAVO', '2025-10-21 13:55:21', 'TAVO', '2025-10-21 09:01:11'),
('4912fb87-8821-4362-a473-23b7c92a2375', '2025-10-02', 2, 5, 8.9, 8.8, 8.7, 8.95, 9.1, 9.3, 9.7, 5, 6, 6000, 'TAVO', '2025-10-21 13:55:21', 'TAVO', '2025-10-21 09:01:11'),
('057ab980-b6ab-4fdd-8695-2b4a2a9b1df2', '2025-10-02', 1, 10, 8.9, 8.8, 8.7, 8.95, 9.1, 9.3, 9.7, 5, 6, 6000, 'TAVO', '2025-10-21 13:55:21', 'TAVO', '2025-10-21 09:01:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_criador_emprendedor`
--

CREATE TABLE `com_db_criador_emprendedor` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `provincia` int(11) DEFAULT NULL,
  `proveedor` int(11) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `cantidad` double DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_criador_emprendedor`
--

INSERT INTO `com_db_criador_emprendedor` (`id`, `fecha`, `provincia`, `proveedor`, `tipo`, `cantidad`, `precio`, `observaciones`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('e4efedae-00a3-49ab-8031-918481bcfdfa', '2025-10-28', 1, 47, 1, 450, 0, '-', 'TAVO', '2025-10-28 16:48:15', 'TAVO', '2025-10-28 11:51:57'),
('1a5a2607-e338-4676-b4d2-02abb9cd3855', '2025-10-28', 10, 63, 2, 8, 1.2, 'sin obs', 'TAVO', '2025-10-28 16:48:35', 'TAVO', '2025-10-28 11:51:57');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_entero_autoser`
--

CREATE TABLE `com_db_entero_autoser` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `proveedor` int(11) DEFAULT NULL,
  `precioMayMin` double DEFAULT NULL,
  `precioMayMax` double DEFAULT NULL,
  `precioPubMin` double DEFAULT NULL,
  `precioPubMax` double DEFAULT NULL,
  `color` double DEFAULT NULL,
  `cantidad` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_entero_autoser`
--

INSERT INTO `com_db_entero_autoser` (`id`, `fecha`, `proveedor`, `precioMayMin`, `precioMayMax`, `precioPubMin`, `precioPubMax`, `color`, `cantidad`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('901c36da-508d-4566-8ea6-9736a291e1db', '2025-10-23', 48, 1.5, 4.8, 7.6, 4.6, 2.6, 7.8, 'TAVO', '2025-10-23 16:30:48', 'TAVO', '2025-10-23 11:33:40'),
('c9761bbf-d987-43f8-9776-9acb3861d7db', '2025-10-23', 90, 5.8, 6.3, 7.5, 8, 4.6, 2.5, 'TAVO', '2025-10-23 16:31:03', 'TAVO', '2025-10-23 11:33:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_gallina`
--

CREATE TABLE `com_db_gallina` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `precioMayMin` double DEFAULT NULL,
  `precioMayMax` double DEFAULT NULL,
  `precioPubMin` double DEFAULT NULL,
  `precioPubMax` double DEFAULT NULL,
  `cantidad` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_gallina`
--

INSERT INTO `com_db_gallina` (`id`, `fecha`, `tipo`, `precioMayMin`, `precioMayMax`, `precioPubMin`, `precioPubMax`, `cantidad`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('d205649a-f96b-4e5c-8e0f-8ba78cc8538b', '2025-10-23', 1, 1.4, 1.5, 2.3, 4.6, 500, 'TAVO', '2025-10-23 16:26:04', 'TAVO', '2025-10-23 11:28:43'),
('b9eaee6d-10a4-49bd-83d7-34fc4c8d99e2', '2025-10-23', 1, 4.5, 2.1, 8, 9, 400, 'TAVO', '2025-10-23 16:27:47', 'TAVO', '2025-10-23 11:28:43'),
('32d23c41-1695-4bf6-81b6-480ba340ebe6', '2025-10-23', 1, 3, 4, 4, 4, 4, 'TAVO', '2025-10-23 16:58:27', 'TAVO', '2025-10-23 12:21:02'),
('d810a48e-f432-423a-8257-0387bc7abf30', '2025-10-23', 1, 8, 8, 5, 4, 3, 'TAVO', '2025-10-23 16:58:44', 'TAVO', '2025-10-23 12:21:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_huevo`
--

CREATE TABLE `com_db_huevo` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `provincia` int(11) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `mercado` int(11) DEFAULT NULL,
  `proveedor` int(11) DEFAULT NULL,
  `precioMayMin` double DEFAULT NULL,
  `precioMayMax` double DEFAULT NULL,
  `precioPubMin` double DEFAULT NULL,
  `precioPubMax` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_huevo`
--

INSERT INTO `com_db_huevo` (`id`, `fecha`, `provincia`, `tipo`, `mercado`, `proveedor`, `precioMayMin`, `precioMayMax`, `precioPubMin`, `precioPubMax`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('119d670f-c6bf-49b0-872a-43088fd2d3f2', '2025-11-05', 10, 1, 1, 10, 1, 2, 1, 2, 'DERR', '2025-11-05 17:35:47', 'DERR', '2025-11-05 17:40:51'),
('2a380dc2-5476-4d1f-a582-53f380d461b2', '2025-11-05', 2, 2, 4, 2, 1, 3, 1, 3, 'DERR', '2025-11-05 17:36:20', 'DERR', '2025-11-05 17:40:51'),
('', '2025-11-05', 2, 2, 5, 4, 1, 3, 1, 3, 'DERR', '2025-11-05 17:36:20', 'DERR', '2025-11-05 17:40:51'),
('bfca256c-153b-41e6-8f51-592bccd0c562', '2025-11-05', 2, 2, 1, 4, 1, 3, 1, 3, 'DERR', '2025-11-05 17:36:20', 'DERR', '2025-11-05 17:40:51'),
('17186c7f-0e42-4e80-9982-81faf4492cc6', '2025-10-05', 2, 2, 5, 4, 1, 3, 1, 3, 'DERR', '2025-11-05 17:36:20', 'DERR', '2025-11-05 17:40:51'),
('27c9b984-c47b-4e61-81ed-fbd7a5e9f75e', '2025-10-15', 2, 2, 1, 4, 1, 3, 1, 3, 'DERR', '2025-11-05 17:36:20', 'DERR', '2025-11-05 17:40:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_precio_trozado`
--

CREATE TABLE `com_db_precio_trozado` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `corte` int(11) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_precio_trozado`
--

INSERT INTO `com_db_precio_trozado` (`id`, `fecha`, `empresa`, `corte`, `precio`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('bea9c9bd-d919-4d5a-af43-4cef3f399c53', '2025-10-21', 3, 1, 7.6, 'TAVO', '2025-10-22 13:31:55', 'TAVO', '2025-10-22 08:54:05'),
('91632d30-6cdc-4810-b74d-0c088fbdb923', '2025-10-21', 3, 3, 1.2, 'TAVO', '2025-10-22 13:31:55', 'TAVO', '2025-10-22 08:54:05'),
('243ba08a-c9a9-43b9-89d8-9d690dbbc0ef', '2025-10-21', 3, 4, 4.5, 'TAVO', '2025-10-22 13:31:55', 'TAVO', '2025-10-22 08:54:05'),
('d56083e3-2cf5-42fe-bb02-d7d87329a41d', '2025-10-21', 3, 5, 2.5, 'TAVO', '2025-10-22 13:31:55', 'TAVO', '2025-10-22 08:54:05'),
('346ad71a-b4d3-431c-ae1e-ab100eecc2bd', '2025-10-21', 3, 6, 8.9, 'TAVO', '2025-10-22 13:31:55', 'TAVO', '2025-10-22 08:54:05'),
('7fcf384b-4d07-4c7c-887f-3de01eb76753', '2025-10-22', 5, 1, 5.3, 'TAVO', '2025-10-22 13:38:49', 'TAVO', '2025-10-22 08:54:05'),
('27e8a217-c986-4e0b-8b2d-9a4d0b0a1de0', '2025-10-22', 5, 2, 7, 'TAVO', '2025-10-22 13:38:49', 'TAVO', '2025-10-22 08:54:05'),
('2216cf00-7a02-4ddd-a5fa-7f3455fd5a01', '2025-10-22', 5, 3, 4.6, 'TAVO', '2025-10-22 13:38:49', 'TAVO', '2025-10-22 08:54:05'),
('72bd0f12-c483-4f66-a659-7b0b1ffb1826', '2025-10-22', 5, 4, 8.9, 'TAVO', '2025-10-22 13:38:49', 'TAVO', '2025-10-22 08:54:05'),
('ace6e8e5-7963-4d06-a80b-7498e85dc8bd', '2025-10-22', 5, 5, 4.5, 'TAVO', '2025-10-22 13:38:49', 'TAVO', '2025-10-22 08:54:05'),
('98520ad2-2a80-43dd-9094-f0de09f2ecee', '2025-10-22', 5, 6, 7.6, 'TAVO', '2025-10-22 13:38:49', 'TAVO', '2025-10-22 08:54:05'),
('5fdcb8fa-54bf-4520-9bf8-c40b2995a8f0', '2025-10-22', 6, 1, 5.3, 'TAVO', '2025-10-22 13:43:04', 'TAVO', '2025-10-22 08:54:05'),
('57137b73-98b3-4a88-be43-13b851b3354b', '2025-10-22', 6, 2, 1.2, 'TAVO', '2025-10-22 13:43:04', 'TAVO', '2025-10-22 08:54:05'),
('c93d5890-a3a0-423a-bf28-37f95f2f706b', '2025-10-22', 6, 3, 4.3, 'TAVO', '2025-10-22 13:43:04', 'TAVO', '2025-10-22 08:54:05'),
('5a496414-1693-4e06-be6b-fa26f43123b4', '2025-10-22', 6, 4, 7.5, 'TAVO', '2025-10-22 13:43:04', 'TAVO', '2025-10-22 08:54:05'),
('f3030c0f-dee2-4f16-86bc-db0ecd3b2969', '2025-10-22', 6, 5, 4.8, 'TAVO', '2025-10-22 13:43:04', 'TAVO', '2025-10-22 08:54:05'),
('e515778e-00cb-4ee7-84eb-7b9ec54693bd', '2025-10-22', 6, 6, 5.6, 'TAVO', '2025-10-22 13:43:04', 'TAVO', '2025-10-22 08:54:05'),
('5fe38fa3-f1d3-49e0-b6b4-75fd35973eec', '2025-10-23', 3, 1, 4.3, 'TAVO', '2025-10-23 17:14:00', 'TAVO', '2025-10-23 12:21:02'),
('ad9b4607-b2a8-4f90-bbeb-475a1d9c80cc', '2025-10-23', 3, 2, 8, 'TAVO', '2025-10-23 17:14:00', 'TAVO', '2025-10-23 12:21:02'),
('8b7270c0-291b-4d91-a2a7-69bd84561840', '2025-10-23', 3, 3, 4.3, 'TAVO', '2025-10-23 17:14:00', 'TAVO', '2025-10-23 12:21:02'),
('9cb911f3-593d-44e1-a753-809bd8411512', '2025-10-23', 3, 4, 4.6, 'TAVO', '2025-10-23 17:14:00', 'TAVO', '2025-10-23 12:21:02'),
('4777b550-12e3-412f-85c0-9ebf1b6bd8a9', '2025-10-23', 3, 5, 1.5, 'TAVO', '2025-10-23 17:14:00', 'TAVO', '2025-10-23 12:21:02'),
('d8a91cdf-32f5-417c-9e87-29abb20216a5', '2025-10-23', 3, 6, 8.9, 'TAVO', '2025-10-23 17:14:00', 'TAVO', '2025-10-23 12:21:02'),
('0e06b7e0-d5b1-45e7-be20-aeaeed86cf04', '2025-10-23', 8, 1, 2, 'TAVO', '2025-10-23 17:14:14', 'TAVO', '2025-10-23 12:21:02'),
('25910e72-a2c7-4e0e-9636-15d91e95c5c2', '2025-10-23', 8, 2, 1, 'TAVO', '2025-10-23 17:14:14', 'TAVO', '2025-10-23 12:21:02'),
('20de8537-1229-4fc6-bf2f-52ce2b651ec9', '2025-10-23', 8, 3, 5, 'TAVO', '2025-10-23 17:14:14', 'TAVO', '2025-10-23 12:21:02'),
('314a6658-ea87-49c5-86b8-4728113c22ce', '2025-10-23', 8, 4, 4.6, 'TAVO', '2025-10-23 17:14:14', 'TAVO', '2025-10-23 12:21:02'),
('f54763b5-7dd7-4b98-8cbd-de3bf7293dca', '2025-10-23', 8, 5, 5.8, 'TAVO', '2025-10-23 17:14:14', 'TAVO', '2025-10-23 12:21:02'),
('baadb472-9c31-4e6f-9717-36447b181b28', '2025-10-23', 8, 6, 7.6, 'TAVO', '2025-10-23 17:14:14', 'TAVO', '2025-10-23 12:21:02'),
('a6983676-db2a-4f45-9807-936a464589b3', '2025-10-23', 3, 4, 7.6, 'TAVO', '2025-10-23 17:14:14', 'TAVO', '2025-10-23 12:21:02');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_precio_vivo`
--

CREATE TABLE `com_db_precio_vivo` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `precioMinCentroAcopio` double DEFAULT NULL,
  `precioMaxCentroAcopio` double DEFAULT NULL,
  `precioMinMayoristaReparto` double DEFAULT NULL,
  `precioMaxMayoristaReparto` double DEFAULT NULL,
  `precioPubMin` double DEFAULT NULL,
  `precioPubMax` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_precio_vivo`
--

INSERT INTO `com_db_precio_vivo` (`id`, `fecha`, `empresa`, `precioMinCentroAcopio`, `precioMaxCentroAcopio`, `precioMinMayoristaReparto`, `precioMaxMayoristaReparto`, `precioPubMin`, `precioPubMax`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('f0027afd-f9d6-4af3-805d-4d5c89c9f38a', '2025-10-21', 3, 6.7, 6.8, 7.6, 7.9, 8.1, 8.5, 'TAVO', '2025-10-21 17:39:15', 'TAVO', '2025-10-21 12:39:37'),
('f0869368-308a-4476-a4ef-ba75c201a3f3', '2025-10-21', 3, 6.7, 6.8, 7.6, 7.9, 8.1, 8.5, 'TAVO', '2025-10-21 17:39:15', 'TAVO', '2025-10-21 12:39:37'),
('b26257bc-20e4-4c23-a58a-a0aa2f0048f4', '2025-10-21', 2, 6.7, 6.8, 7.6, 7.9, 8.1, 8.5, 'TAVO', '2025-10-21 17:39:15', 'TAVO', '2025-10-21 12:39:37'),
('5e00f5ad-dfba-4c8c-ba54-bfb07397a36f', '2025-09-21', 5, 6.7, 6.8, 7.6, 7.9, 8.1, 8.5, 'TAVO', '2025-10-21 17:39:15', 'TAVO', '2025-10-21 12:39:37'),
('7a31b6e4-15af-4148-88cc-534e73405f33', '2025-10-21', 5, 6.7, 6.8, 7.6, 7.9, 8.1, 8.5, 'TAVO', '2025-10-21 17:39:15', 'TAVO', '2025-10-21 12:39:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_tienda`
--

CREATE TABLE `com_db_tienda` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `codpro` varchar(8) DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_tienda`
--

INSERT INTO `com_db_tienda` (`id`, `fecha`, `empresa`, `tipo`, `codpro`, `precio`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('42d9f545-6e36-4c20-8320-0aafb264a599', '2025-10-22', 2, 3, '513', 8.9, 'TAVO', '2025-10-22 16:39:16', 'TAVO', '2025-10-22 11:39:41'),
('533f7386-ef99-4022-9f0c-b6916cfb6d45', '2025-10-22', 5, 2, '120', 7.8, 'TAVO', '2025-10-22 16:39:06', 'TAVO', '2025-10-22 11:39:41'),
('65e521e8-d649-4cd9-a0de-1f1a3833fbd7', '2025-10-22', 7, 1, '113', 8.9, 'TAVO', '2025-10-22 16:39:16', 'TAVO', '2025-10-22 11:39:41'),
('3ecb6e80-6913-428b-bcad-8a003db85a8d', '2025-10-22', 7, 2, '120', 8.3, 'TAVO', '2025-10-22 16:39:16', 'TAVO', '2025-10-22 11:39:41'),
('6d048290-6e53-4626-b857-031290f370c0', '2025-10-22', 5, 3, '513', 8.9, 'TAVO', '2025-10-22 16:39:16', 'TAVO', '2025-10-22 11:39:41'),
('0fd1a15c-8bec-4562-80d4-3b5deac8efdc', '2025-10-22', 2, 3, '513', 8.9, 'TAVO', '2025-10-22 16:39:16', 'TAVO', '2025-10-22 11:39:41');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_trozado_autoser`
--

CREATE TABLE `com_db_trozado_autoser` (
  `id` varchar(36) NOT NULL,
  `fecha` date DEFAULT NULL,
  `corte` int(11) DEFAULT NULL,
  `precioSuper` double DEFAULT NULL,
  `precioPlazaVea` double DEFAULT NULL,
  `precioTottus` double DEFAULT NULL,
  `precioMetro` double DEFAULT NULL,
  `precioTiendaPalomar` double DEFAULT NULL,
  `precioTiendaRicoPollo` double DEFAULT NULL,
  `precioAvelino` double DEFAULT NULL,
  `usuarioRegistro` varchar(50) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(50) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `com_db_trozado_autoser`
--

INSERT INTO `com_db_trozado_autoser` (`id`, `fecha`, `corte`, `precioSuper`, `precioPlazaVea`, `precioTottus`, `precioMetro`, `precioTiendaPalomar`, `precioTiendaRicoPollo`, `precioAvelino`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
('ca7a4955-de05-499a-b580-19154b881131', '2025-10-23', 6, 1.2, 5.6, 4.3, 4.8, 1.3, 2.5, 8.3, 'TAVO', '2025-10-23 16:35:48', 'TAVO', '2025-10-23 11:37:01'),
('4f632509-9907-4dc5-b66f-cc11756d441c', '2025-10-23', 2, 7.8, 3.6, 4.3, 1.2, 5.6, 0, 0, 'TAVO', '2025-10-23 16:36:18', 'TAVO', '2025-10-23 11:37:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_vivo_aqp`
--

CREATE TABLE `com_db_vivo_aqp` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `mercado` int(11) DEFAULT NULL,
  `empresa` int(11) DEFAULT NULL,
  `condicion` int(11) DEFAULT NULL,
  `proveedor` int(11) DEFAULT NULL,
  `precioMayMin` double DEFAULT NULL,
  `precioMayMax` double DEFAULT NULL,
  `precioPubMin` double DEFAULT NULL,
  `precioPubMax` double DEFAULT NULL,
  `pesoMachoMin` double DEFAULT NULL,
  `pesoMachoMax` double DEFAULT NULL,
  `pesoHembMin` double DEFAULT NULL,
  `pesoHembMax` double DEFAULT NULL,
  `colorMin` double DEFAULT NULL,
  `colorMax` double DEFAULT NULL,
  `pesoMachoPromMin` double DEFAULT NULL,
  `pesoMachoPromMax` double DEFAULT NULL,
  `pesoHembraPromMin` double DEFAULT NULL,
  `pesoHembraPromMax` double DEFAULT NULL,
  `cantidad` double DEFAULT NULL,
  `usuarioRegistro` varchar(150) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(150) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_db_vivo_aqp`
--

INSERT INTO `com_db_vivo_aqp` (`id`, `fecha`, `mercado`, `empresa`, `condicion`, `proveedor`, `precioMayMin`, `precioMayMax`, `precioPubMin`, `precioPubMax`, `pesoMachoMin`, `pesoMachoMax`, `pesoHembMin`, `pesoHembMax`, `colorMin`, `colorMax`, `pesoMachoPromMin`, `pesoMachoPromMax`, `pesoHembraPromMin`, `pesoHembraPromMax`, `cantidad`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
(1, '2025-09-01', 3, 3, 2, 35, 7.5, 7.5, 8, 9, 2.3, 3.1, 1.9, 2.5, 4, 5, 2.7, 2.9, 2.3, 2.4, 30, 'admin', '2025-11-04 03:26:10', 'sistema', '2025-11-04 03:26:10'),
(2, '2025-09-01', 2, 6, 1, 34, 8.6, 8.7, 9.1, 9.3, 2.4, 3.2, 1.9, 2.2, 3, 4, 2.7, 3, 2, 2.1, 15, 'admin', '2025-11-04 16:10:01', 'sistema', '2025-11-04 16:10:01'),
(3, '2025-09-01', 1, 6, 1, 33, 8.2, 8.3, 9, 9.3, 2.4, 3.2, 1.9, 2.2, 3, 4, 2.7, 3, 2, 2.1, 200, NULL, NULL, NULL, NULL),
(4, '2025-09-01', 1, 7, 1, 41, 7.1, 7.2, 7.7, 8.6, 2.2, 2.7, 1.8, 2, 3, 0, 2.3, 2.6, 2, 2, 900, NULL, NULL, NULL, NULL),
(5, '2025-09-01', 1, 6, 1, 38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL),
(6, '2025-09-01', 3, 3, 1, 36, 7.1, 7.3, 7.8, 8.8, 2.4, 3.2, 1.9, 2.7, 4, 6, 2.8, 3, 2.4, 2.6, 17800, 'admin', '2025-11-05 15:40:07', 'sistema', '2025-11-05 15:40:07'),
(7, '2025-10-29', 3, 6, 1, 81, 7.8, 8.2, 8.5, 9, 2.3, 2.8, 2, 2.4, 1, 2, 2.4, 2.7, 2.1, 2.3, 500, 'admin', '2025-11-04 13:34:33', 'sistema', '2025-11-04 13:34:33'),
(8, '2025-11-04', 3, 4, 1, 79, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 'admin', '2025-11-06 15:53:19', 'sistema', '2025-11-06 15:53:19'),
(9, '2025-11-04', 4, 4, 2, 79, 50, 10, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 'admin', '2025-11-04 16:25:18', 'sistema', '2025-11-04 16:25:18'),
(10, '2025-11-04', 3, 7, 3, 78, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 10, 0, 0, 10, 'admin', '2025-11-05 15:39:55', 'sistema', '2025-11-05 15:39:55'),
(11, '2025-11-04', 1, 1, 2, 42, 11, 13, 2, 1, 2, 2, 2, 1, 2, 3, 1, 4, 4, 21, 12, 'admin', '2025-11-05 16:05:54', 'sistema', '2025-11-05 16:05:54'),
(12, '2025-11-05', 1, 7, 3, 76, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 10, 10, 'admin', '2025-11-05 23:10:09', 'sistema', '2025-11-05 23:10:09'),
(13, '2025-11-04', 3, 6, 1, 78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'admin', '2025-11-05 23:11:16', 'sistema', '2025-11-05 23:11:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_db_vivo_provincia`
--

CREATE TABLE `com_db_vivo_provincia` (
  `id` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `provincia` int(11) DEFAULT NULL,
  `proveedor` int(11) DEFAULT NULL,
  `tipo` int(11) DEFAULT NULL,
  `precioMayCarMin` double DEFAULT NULL,
  `precioMayCarMax` double DEFAULT NULL,
  `precioMayBraMin` double DEFAULT NULL,
  `precioMayBraMax` double DEFAULT NULL,
  `precioPubMin` double DEFAULT NULL,
  `precioPubMax` double DEFAULT NULL,
  `pesoMachoPromMin` double DEFAULT NULL,
  `pesoMachoPromMax` double DEFAULT NULL,
  `pesoHembraPromMin` double DEFAULT NULL,
  `pesoHembraPromMax` double DEFAULT NULL,
  `pesoBrasaPromMin` double DEFAULT NULL,
  `pesoBrasaPromMax` double DEFAULT NULL,
  `colorMin` double DEFAULT NULL,
  `colorMax` double DEFAULT NULL,
  `cantidad` double DEFAULT NULL,
  `usuarioRegistro` varchar(150) DEFAULT NULL,
  `fechaHoraRegistro` datetime DEFAULT NULL,
  `usuarioTransferencia` varchar(150) DEFAULT NULL,
  `fechaHoraTransferencia` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_db_vivo_provincia`
--

INSERT INTO `com_db_vivo_provincia` (`id`, `fecha`, `provincia`, `proveedor`, `tipo`, `precioMayCarMin`, `precioMayCarMax`, `precioMayBraMin`, `precioMayBraMax`, `precioPubMin`, `precioPubMax`, `pesoMachoPromMin`, `pesoMachoPromMax`, `pesoHembraPromMin`, `pesoHembraPromMax`, `pesoBrasaPromMin`, `pesoBrasaPromMax`, `colorMin`, `colorMax`, `cantidad`, `usuarioRegistro`, `fechaHoraRegistro`, `usuarioTransferencia`, `fechaHoraTransferencia`) VALUES
(1, '2025-09-01', 7, 53, 1, 6, 0, 6.3, 0, 0, 0, 0, 0, 2.3, 2.65, 2.1, 0, 0, 0, 13007, NULL, NULL, NULL, NULL),
(2, '2025-11-03', 1, 2, 1, 8.5, 9, 7.8, 8.2, 9.3, 9.8, 2.3, 2.6, 2.1, 2.4, 1.8, 2, 1, 2, 350, 'admin', '2025-10-29 14:30:00', 'sistema', '2025-10-29 15:00:00'),
(3, '2025-09-01', 7, 32, 1, 7.1, 0, 0, 0, 0, 0, 2.5, 2.7, 2.2, 2.3, 2.2, 0, 0, 0, 7300, NULL, NULL, NULL, NULL),
(4, '2025-09-01', 7, 32, 2, 8.8, 0, 0, 0, 9.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL),
(5, '2025-09-01', 7, 58, 1, 6.5, 0, 0, 0, 0, 0, 2.7, 2.9, 2.1, 2.3, 0, 0, 0, 0, 3100, NULL, NULL, NULL, NULL),
(6, '2025-09-01', 7, 58, 2, 8.1, 0, 0, 0, 9.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL),
(8, '2025-09-01', 7, 72, 2, 8.1, 0, 0, 0, 9.3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL),
(9, '2025-09-01', 7, 49, 1, 6.5, 0, 0, 0, 0, 0, 2.5, 2.7, 2.1, 2.3, 0, 0, 0, 0, 2200, NULL, NULL, NULL, NULL),
(10, '2025-10-15', 8, 90, 4, 50, 10, 0, 0, 10, 10, 20, 20, 10, 10, 0, 0, 10, 10, 10, 'admin', '2025-11-04 17:44:41', 'sistema', '2025-11-04 17:44:41'),
(11, '2025-10-14', 1, 49, 2, 10, 0, 0, 0, 10, 0, 0, 10, 10, 0, 0, 0, 0, 10, 10, 'admin', '2025-11-04 17:45:12', 'sistema', '2025-11-04 17:45:12'),
(12, '2025-11-05', 10, 92, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'admin', '2025-11-05 13:14:46', 'sistema', '2025-11-05 13:14:46'),
(13, '2025-11-05', 9, 93, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'admin', '2025-11-05 13:15:50', 'sistema', '2025-11-05 13:15:50'),
(14, '2025-11-05', 9, 92, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 'admin', '2025-11-05 23:11:33', 'sistema', '2025-11-05 23:11:33');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_empresa`
--

CREATE TABLE `com_empresa` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(450) DEFAULT NULL,
  `ruc` varchar(33) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_empresa`
--

INSERT INTO `com_empresa` (`codigo`, `nombre`, `ruc`) VALUES
(1, 'GRANJAS INFORMALES', '20202020203'),
(2, 'GRANJAS DE LIMA', '20202020202'),
(3, 'GRANJA RINCONADA DEL SUR', '20419158462'),
(4, 'FAFIO', '20519666601'),
(5, 'GRANJAS CHICAS', '20202020201'),
(6, 'RICO POLLO', '20506421781'),
(7, 'ROSARIO DEL SUR', '20202020204'),
(8, 'RP/GRS', '20202020205');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_mercado`
--

CREATE TABLE `com_mercado` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(450) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_mercado`
--

INSERT INTO `com_mercado` (`codigo`, `nombre`) VALUES
(1, 'AVELINO'),
(2, 'FERIA ALTIPLANO'),
(3, 'RIO SECO'),
(4, 'SAN CAMILO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_proveedor`
--

CREATE TABLE `com_proveedor` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(450) DEFAULT NULL,
  `ruc` varchar(33) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_proveedor`
--

INSERT INTO `com_proveedor` (`codigo`, `nombre`, `ruc`) VALUES
(1, 'ARTURO COILA', ''),
(2, 'Arturo coila (RP/GRS)', ''),
(3, 'BELTRAN(GR)', ''),
(4, 'BETO TAPIA', ''),
(5, 'CHRISTIAN SALVADOR', ''),
(6, 'CHRISTIAN SALVADOR (reparto)', ''),
(7, 'David Umeres', ''),
(8, 'EVELYN', ''),
(9, 'EVELYN ROQUE', ''),
(10, 'Hellen Chambi', ''),
(11, 'Imelda Coila (RP)', ''),
(12, 'ISABEL DE LA CRUZ', ''),
(13, 'Janet Torres (RP/GRS)', ''),
(14, 'Jerson Acero', ''),
(15, 'JESSICA', ''),
(16, 'Jessica (RP/GRS)', ''),
(17, 'Lazaro', ''),
(18, 'Lourdes Umiña', ''),
(19, 'Lourdes Umiña (San Gabriel)', ''),
(20, 'MARIO (RP)', ''),
(21, 'Marlene Ccasquina', ''),
(22, 'MARY COILA', ''),
(23, 'MARY COILA (RP)', ''),
(24, 'MARY COYLA (reparto)', ''),
(25, 'MARYLIN YANQUI(GRS)', ''),
(26, 'Otros', ''),
(27, 'Otros Rico Pollo', ''),
(28, 'OTROS Y JULIA VELIZ', ''),
(29, 'RAUL', ''),
(30, 'RAUL MEZA', ''),
(31, 'Renzo Cruz', ''),
(32, 'RICO POLLO', '20506421781'),
(33, 'RICO POLLO (Reparto)', '20506421781'),
(34, 'RICO POLLO (Tienda)', '20506421781'),
(35, 'RINCONADA', '20419158462'),
(36, 'RINCONADA AQP', '20419158462'),
(37, 'RINCONADA LIMA', '20419158462'),
(38, 'ROCIO COYLA (Mecanizado)', ''),
(39, 'ROCIO COYLA (reparto)', ''),
(40, 'ROSARIO', ''),
(41, 'ROSARIO (Tiendas - puestos)', ''),
(42, 'Roxana Loayza', ''),
(43, 'SONIA LAZO(RP)', ''),
(44, 'Sra. Elísea (RP/GRS)', ''),
(45, 'UMERES(gr)', ''),
(46, 'ALFREDO', ''),
(47, 'ASOC. SONDOR', ''),
(48, 'AVICOLA SUREÑA', ''),
(49, 'CARIOCA', ''),
(50, 'FORTUNATO CANAN', ''),
(51, 'GAMBOA Y MANTILLA', ''),
(52, 'GRANJA CHICA', ''),
(53, 'GRANJA RINCONADA DEL SUR', ''),
(54, 'GRANJAS CHICAS', ''),
(55, 'GROBAS (BENEFICIADO AQP)', ''),
(56, 'HUMALA/ALVARO MEDINA', ''),
(57, 'ITE', ''),
(58, 'JCHE ( FAFIO )', ''),
(59, 'JORGE PAN', ''),
(60, 'LA CASITA', ''),
(61, 'la genovesa', ''),
(62, 'MECHA PERCA', ''),
(63, 'MIRIAN GUTIERREZ', ''),
(64, 'MOTTA (POLLO DEL PEDREGAL)', ''),
(65, 'NAVARRO', ''),
(66, 'OTRAS GRANJAS CHICAS (PEDRO-PASCUAL-RUFO)', ''),
(67, 'POLLO DE TACNA', ''),
(68, 'POLLO DEL NORTE (CHRISTIAN)', ''),
(69, 'POLLO DEL PEDREGAL (GAMBOA)', ''),
(70, 'RENZO', ''),
(71, 'RIEGA', ''),
(72, 'SANTA ANGELA', ''),
(73, 'SUMAQ POLLO', ''),
(74, 'WILLY GIRON/PATTY (G CHICAS)', ''),
(75, 'AVICOLA QUISPE', ''),
(76, 'Aide Perez(Rico Pollo)', ''),
(77, 'Castro(Rico Pollo)', ''),
(78, 'Clientes GRS', ''),
(79, 'GLOMISA (Pollo de Granja Rinconada)', ''),
(80, 'Juvenal Farfán ', ''),
(81, 'MAKRO (Rico Pollo)', ''),
(82, 'Marìa Dinclan', ''),
(83, 'PINEDA  (Rico Pollo, GRS)', ''),
(84, 'PLAZA VEA  (Rico Pollo )', ''),
(85, 'PLAZA VEA - Rico y san Fernando (Juliaca y Puno)', ''),
(86, 'RENZOS', ''),
(87, 'SAN FERNADO DE LIMA', ''),
(88, 'San Fernando de Lima  (congelado)', ''),
(89, 'SANTA ELENA', ''),
(90, 'GRS', ''),
(91, 'CALERA', ''),
(92, 'AVIMAR', ''),
(93, 'PRIMAVERA', ''),
(94, 'QUIJOTE', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_provincia`
--

CREATE TABLE `com_provincia` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(450) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_provincia`
--

INSERT INTO `com_provincia` (`codigo`, `nombre`) VALUES
(1, 'CAMANA'),
(2, 'ILO'),
(3, 'LA JOYA'),
(4, 'MOLLENDO'),
(5, 'MOQUEGUA'),
(6, 'PEDREGAL'),
(7, 'TACNA'),
(8, 'CUZCO'),
(9, 'PUNO / JULIACA'),
(10, 'AREQUIPA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `com_tipo`
--

CREATE TABLE `com_tipo` (
  `codigo` int(11) NOT NULL,
  `nombre` varchar(450) DEFAULT NULL,
  `linea` char(9) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `com_tipo`
--

INSERT INTO `com_tipo` (`codigo`, `nombre`, `linea`) VALUES
(1, 'Vivo', ''),
(2, 'Beneficiado', ''),
(3, 'P. Mercado', ''),
(4, 'P. Mejorado', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conempre`
--

CREATE TABLE `conempre` (
  `EPRE` char(2) DEFAULT NULL,
  `ENOM` varchar(40) DEFAULT NULL,
  `EDIR` varchar(100) DEFAULT NULL,
  `ELUG` varchar(50) DEFAULT NULL,
  `ETEL` varchar(10) DEFAULT NULL,
  `ERUC` varchar(11) DEFAULT NULL,
  `EREG` varchar(7) DEFAULT NULL,
  `EKEY` varchar(6) DEFAULT NULL,
  `EANO` varchar(4) DEFAULT NULL,
  `EDIG` double DEFAULT NULL,
  `EFAC` double DEFAULT NULL,
  `ECTE` double DEFAULT NULL,
  `EITM` double DEFAULT NULL,
  `EFIJ` double DEFAULT NULL,
  `EAMA` double DEFAULT NULL,
  `EFEC` varchar(8) DEFAULT NULL,
  `ED67` smallint(6) DEFAULT NULL,
  `ESWA` smallint(6) DEFAULT NULL,
  `ESWL` smallint(6) DEFAULT NULL,
  `ASIDIARIO` smallint(6) DEFAULT NULL,
  `CTRL` varchar(6) DEFAULT NULL,
  `FAX` varchar(15) DEFAULT NULL,
  `EMAIL` varchar(31) DEFAULT NULL,
  `MAQUINA` char(1) DEFAULT NULL,
  `ERUTABD` varchar(40) DEFAULT NULL,
  `MURB_DIR` varchar(35) DEFAULT NULL,
  `MPROVI` varchar(25) DEFAULT NULL,
  `MDPTO` varchar(25) DEFAULT NULL,
  `MNOM_LEG` varchar(50) DEFAULT NULL,
  `MTIP_DOCL` varchar(7) DEFAULT NULL,
  `MNRO_DOCL` varchar(10) DEFAULT NULL,
  `MAREA` varchar(15) DEFAULT NULL,
  `COD_AFIL` varchar(6) DEFAULT NULL,
  `ACTI1` varchar(50) DEFAULT NULL,
  `ACTI2` varchar(50) DEFAULT NULL,
  `NOMDPTO` varchar(80) DEFAULT NULL,
  `CARGO` varchar(40) DEFAULT NULL,
  `ELABORADO_POR` varchar(50) DEFAULT NULL,
  `AREA_ELAB` varchar(50) DEFAULT NULL,
  `DNI_ELAB` varchar(12) DEFAULT NULL,
  `FE` char(1) DEFAULT 'A',
  `rutaccl` varchar(150) DEFAULT '',
  `pagfe` varchar(150) DEFAULT '',
  `mensaje1` varchar(150) DEFAULT '',
  `mensaje3` varchar(150) DEFAULT '',
  `mensaje4` varchar(150) DEFAULT '',
  `efecha_fin` date DEFAULT NULL,
  `claveext` varchar(25) DEFAULT NULL,
  `dir_fiscal` varchar(250) DEFAULT 'CAL. BREA Y PARIÑAS NRO. 102 INT. 1102 URB. TAMBO DE MONTERRICO',
  `ubi_fiscal` varchar(250) DEFAULT 'SANTIAGO DE SURCO - LIMA - LIMA',
  `nf_ruta` varchar(250) DEFAULT '',
  `nf_token` varchar(250) DEFAULT '',
  `dominio` varchar(255) DEFAULT '',
  `usu_cpe` varchar(255) DEFAULT '',
  `tok_cpe` varchar(255) DEFAULT '',
  `url_fac` varchar(255) DEFAULT '',
  `numctadetra` varchar(50) DEFAULT '',
  `autorizacion_mtc` varchar(50) DEFAULT '',
  `eubigeo` varchar(6) DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `conempre`
--

INSERT INTO `conempre` (`EPRE`, `ENOM`, `EDIR`, `ELUG`, `ETEL`, `ERUC`, `EREG`, `EKEY`, `EANO`, `EDIG`, `EFAC`, `ECTE`, `EITM`, `EFIJ`, `EAMA`, `EFEC`, `ED67`, `ESWA`, `ESWL`, `ASIDIARIO`, `CTRL`, `FAX`, `EMAIL`, `MAQUINA`, `ERUTABD`, `MURB_DIR`, `MPROVI`, `MDPTO`, `MNOM_LEG`, `MTIP_DOCL`, `MNRO_DOCL`, `MAREA`, `COD_AFIL`, `ACTI1`, `ACTI2`, `NOMDPTO`, `CARGO`, `ELABORADO_POR`, `AREA_ELAB`, `DNI_ELAB`, `FE`, `rutaccl`, `pagfe`, `mensaje1`, `mensaje3`, `mensaje4`, `efecha_fin`, `claveext`, `dir_fiscal`, `ubi_fiscal`, `nf_ruta`, `nf_token`, `dominio`, `usu_cpe`, `tok_cpe`, `url_fac`, `numctadetra`, `autorizacion_mtc`, `eubigeo`) VALUES
('RS', 'GRANJA RINCONADA DEL SUR S.A.', 'CAL.BREA Y PARIÑAS NRO. 102 INT. 1102 URB. TAMBO DE MONTERRICO', 'SANTIAGO DE SURCO', '2540222', '20419158462', NULL, 'ESTHER', '2025', 8, 10, 11, 8, 8, 8, '93/01/01', 0, 1, 0, 1, '623633', NULL, NULL, '1', 'F:\\DataBase\\CIA2.MDB', 'SAN JUAN BAUTISTA DE VILLA', 'LIMA', 'LIMA', 'SUAREZ ORBEZO APOLONIO DAMIAN', '01', '07701632', 'GERENCIA', '19', 'a la crianza de animales domesti-', 'cos', 'rectivas internas del Departamento de Personal y la Gerencia General', 'GERENTE GENERAL', 'FREZ TAPIA LORENZO HUGO', 'PERSONAL', '09154472', 'A', 'C:\\suite\\ArchivoBAD\\COPIARX64.bat', 'http://ecomprobantes.pe/GRANJAR', 'Telf. Lima: 254-0222 254-0199 Fax:254-7108 Telf. AQP: 221-212  221-414', 'La Mercadería viaja por cuenta y riesgo del Cliente', 'Cancele este Documento en su oportunidad, caso contrario tendrá un recargo igual a las tasas activas y moras vigentes del mercado al momento de pago', '2020-03-12', 'Coronavirus2020', 'CAL. BREA Y PARIÑAS NRO. 102 INT. 1102 URB. TAMBO DE MONTERRICO', 'SANTIAGO DE SURCO - LIMA - LIMA', 'https://api.nubefact.com/api/v1/d753d574-9d13-4623-aa9a-75bf3eb7d044', '25d8c36dc7da4c39ab5a054927f05dc27b9741eeabc54f4dbc555e83bf454c51', 'rinconadadelsur.guifacperu.com', 'cpe@rinconadadelsur.guifacperu.com', 'EIvpyuVJUHkrO95bWjavOaExN0itbqjcsTBeOpzGZFoVVWsgqL', 'https://rinconadadelsur.guifacperu.com/buscar', '', '', '150140');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `codigo` varchar(6) NOT NULL DEFAULT '',
  `nombre` varchar(120) DEFAULT NULL,
  `direcc` varchar(120) DEFAULT NULL,
  `telefo` varchar(15) DEFAULT NULL,
  `libtri` varchar(12) DEFAULT NULL,
  `ruc` varchar(20) DEFAULT NULL,
  `acceso` varchar(2) DEFAULT NULL,
  `password` varchar(150) DEFAULT NULL,
  `subacceso` varchar(2) DEFAULT NULL,
  `tnumfac_fa` double DEFAULT NULL,
  `tnumfac_bv` double DEFAULT NULL,
  `epre` varchar(2) NOT NULL,
  `permiso` varchar(1) DEFAULT NULL,
  `subpermiso` varchar(6) DEFAULT NULL,
  `elimina` varchar(1) DEFAULT '0',
  `anula` varchar(1) DEFAULT '0',
  `modifica` varchar(1) DEFAULT '0',
  `crea` varchar(1) DEFAULT '0',
  `estado` varchar(1) DEFAULT 'A',
  `reduser` varchar(30) NOT NULL,
  `tdate` datetime DEFAULT NULL,
  `nivel_inter` char(1) DEFAULT '3' COMMENT 'niveles 1,2,3',
  `impFE` double DEFAULT 0,
  `subpassword` varchar(15) DEFAULT NULL,
  `contabilidad` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`codigo`, `nombre`, `direcc`, `telefo`, `libtri`, `ruc`, `acceso`, `password`, `subacceso`, `tnumfac_fa`, `tnumfac_bv`, `epre`, `permiso`, `subpermiso`, `elimina`, `anula`, `modifica`, `crea`, `estado`, `reduser`, `tdate`, `nivel_inter`, `impFE`, `subpassword`, `contabilidad`) VALUES
('SYSTEM', 'ADMINISTRADOR DE SISTEMAS', '-', '-', '12345678', 'COMERCIALIZACION', NULL, '5”Áùª', NULL, NULL, NULL, 'RS', NULL, NULL, '0', '0', '0', '0', 'A', 'SYSTEM', '2025-11-05 00:00:00', '3', 0, NULL, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `captura_pantalla_beneficiado`
--
ALTER TABLE `captura_pantalla_beneficiado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `captura_pantalla_vivo`
--
ALTER TABLE `captura_pantalla_vivo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tipo_proc` (`tipo_proc`),
  ADD KEY `idx_mes` (`mes`),
  ADD KEY `idx_provincia` (`provincia`),
  ADD KEY `idx_nombre` (`nombre`);

--
-- Indices de la tabla `com_condicion`
--
ALTER TABLE `com_condicion`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `com_corte`
--
ALTER TABLE `com_corte`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `com_db_alterno`
--
ALTER TABLE `com_db_alterno`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_beneficio_provincia`
--
ALTER TABLE `com_db_beneficio_provincia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_criador_emprendedor`
--
ALTER TABLE `com_db_criador_emprendedor`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_entero_autoser`
--
ALTER TABLE `com_db_entero_autoser`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_gallina`
--
ALTER TABLE `com_db_gallina`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_huevo`
--
ALTER TABLE `com_db_huevo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_precio_trozado`
--
ALTER TABLE `com_db_precio_trozado`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_precio_vivo`
--
ALTER TABLE `com_db_precio_vivo`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_tienda`
--
ALTER TABLE `com_db_tienda`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_trozado_autoser`
--
ALTER TABLE `com_db_trozado_autoser`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_vivo_aqp`
--
ALTER TABLE `com_db_vivo_aqp`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_db_vivo_provincia`
--
ALTER TABLE `com_db_vivo_provincia`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `com_empresa`
--
ALTER TABLE `com_empresa`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `com_mercado`
--
ALTER TABLE `com_mercado`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `com_proveedor`
--
ALTER TABLE `com_proveedor`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `com_provincia`
--
ALTER TABLE `com_provincia`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `com_tipo`
--
ALTER TABLE `com_tipo`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`codigo`,`epre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `captura_pantalla_beneficiado`
--
ALTER TABLE `captura_pantalla_beneficiado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `captura_pantalla_vivo`
--
ALTER TABLE `captura_pantalla_vivo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `com_condicion`
--
ALTER TABLE `com_condicion`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `com_corte`
--
ALTER TABLE `com_corte`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `com_db_vivo_aqp`
--
ALTER TABLE `com_db_vivo_aqp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `com_db_vivo_provincia`
--
ALTER TABLE `com_db_vivo_provincia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `com_empresa`
--
ALTER TABLE `com_empresa`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `com_mercado`
--
ALTER TABLE `com_mercado`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `com_proveedor`
--
ALTER TABLE `com_proveedor`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=95;

--
-- AUTO_INCREMENT de la tabla `com_provincia`
--
ALTER TABLE `com_provincia`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `com_tipo`
--
ALTER TABLE `com_tipo`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
