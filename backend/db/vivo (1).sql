-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-11-2025 a las 21:50:54
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
(1, 'Arequipa Beneficiado', 2024, 'MAYO', 'AREQUIPA', 'HORIZONTAL', 'SI', 'BOGEDA', 'Soto quispe', 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 5, '', 'NO RECORTES DE PRODUCTO', ''),
(3, 'Arequipa Beneficiado', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'PROVEEDOR', 'ROBERTO', 100, 3, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 2, 0, 10, 10, 0, 10, 0, 0, 10, 0, 0, 100, 100, '', '', ''),
(9, 'Provincia Beneficiado', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'PROVEEDOR', 'Jose Jhonatan', 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', '', '');

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
(1, 'Arequipa Vivo', 2024, 'Octubre', 'Arequipa', 'Arequipa', 'NO', 'Distribuidor', 'JERSSON ACERO', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 400, 0, 400, '', 'PRECIO COMPETITIVO O SIMILAR AL CONSEGUIDO CON ESTOS PROVEEDORES, DEVOLUCION DE POLLO MUERTO', ''),
(2, 'Provincia Vivo', 2026, 'Septiembre', 'Arequipa', 'Camana', 'SI', 'Distribuidor', 'Hilario Rojas Carolina ', 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 40, 40, NULL, '', ''),
(7, 'Arequipa Vivo', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'DISTRIBUIDOR', 'Jose Jhonatan', 0, 0, 2, 0, 0, NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, 0, 0, 0, 0, '', '', ''),
(8, 'Arequipa Vivo', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'DISTRIBUIDOR', 'Jose Jhonatan', 0, 0, 3, 0, 0, NULL, NULL, NULL, NULL, NULL, 2, NULL, NULL, NULL, 0, 3, 0, 0, '', '', ''),
(9, 'Provincia Vivo', 2024, 'Agosto', 'Arequipa', 'Arequipa', 'NO', 'DISTRIBUIDOR', 'Jose Jhonatan', 0, 3, 0, NULL, NULL, 0, 3, 0, 0, 0, NULL, 3, 0, 0, NULL, 0, 0, 0, '', '', ''),
(10, 'Provincia Vivo', 2025, 'Agosto', 'Arequipa', 'Arequipa', 'SI', 'DISTRIBUIDOR', 'Jose Jhonatan', 3, 0, 3, NULL, NULL, 0, 0, 0, 0, 0, NULL, 0, 0, 0, NULL, 0, 0, 0, '', '', '');

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
(1, '2025-09-01', 1, 3, 1, 35, 7.5, 7.5, 8, 9, 2.3, 3.1, 1.9, 2.5, 4, 5, 2.7, 2.9, 2.3, 2.4, 30, NULL, NULL, NULL, NULL),
(2, '2025-09-01', 1, 6, 1, 34, 8.6, 8.7, 9.1, 9.3, 2.4, 3.2, 1.9, 2.2, 3, 4, 2.7, 3, 2, 2.1, 15, NULL, NULL, NULL, NULL),
(3, '2025-09-01', 1, 6, 1, 33, 8.2, 8.3, 9, 9.3, 2.4, 3.2, 1.9, 2.2, 3, 4, 2.7, 3, 2, 2.1, 200, NULL, NULL, NULL, NULL),
(4, '2025-09-01', 1, 7, 1, 41, 7.1, 7.2, 7.7, 8.6, 2.2, 2.7, 1.8, 2, 3, 0, 2.3, 2.6, 2, 2, 900, NULL, NULL, NULL, NULL),
(5, '2025-09-01', 1, 6, 1, 38, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NULL),
(6, '2025-09-01', 1, 3, 1, 36, 7.1, 7.3, 7.8, 8.8, 2.4, 3.2, 1.9, 2.7, 4, 6, 2.8, 3, 2.4, 2.6, 17800, NULL, NULL, NULL, NULL),
(7, '2025-10-29', 4, 6, 1, 81, 7.8, 8.2, 8.5, 9, 2.3, 2.8, 2, 2.4, 1, 2, 2.4, 2.7, 2.1, 2.3, 500, 'admin', '2025-10-29 14:30:00', 'sistema', '2025-10-29 15:00:00');

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
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `captura_pantalla_beneficiado`
--
ALTER TABLE `captura_pantalla_beneficiado`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `captura_pantalla_vivo`
--
ALTER TABLE `captura_pantalla_vivo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `com_condicion`
--
ALTER TABLE `com_condicion`
  MODIFY `codigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `com_db_vivo_aqp`
--
ALTER TABLE `com_db_vivo_aqp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `com_db_vivo_provincia`
--
ALTER TABLE `com_db_vivo_provincia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
