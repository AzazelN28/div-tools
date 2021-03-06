/**
 * @module wld
 */

/**
 * Vértice editable de un archivo .wld
 * @typedef {Object} Vertex
 * @property {number} active ¿Activo?
 * @property {number} x Coordenada x del vértice
 * @property {number} y Coordenada y del vértice
 * @property {number} links Número de paredes vinculadas a este vértice
 */

/**
 * Pared editable de un archivo .wld
 * @typedef {Object} Wall
 * @property {number} active ¿Activo?
 * @property {number} type Tipo de pared (Realmente indica el ángulo de la pared)
 * @property {number} vertexStart Vértice inicial
 * @property {number} vertexEnd Vértice final
 * @property {number} regionFront Región delantera
 * @property {number} regionBack Región trasera
 * @property {number} textureMiddle Textura de la parte media de la pared
 * @property {number} textureTop Textura de la parte superior de la pared
 * @property {number} textureBottom Textura de la parte inferior de la pared
 * @property {number} fade Luminosidad (Valor entre 0 y 15)
 */

/**
 * Región editable de un archivo .wld
 * @typedef {Object} Region
 * @property {number} active ¿Activo?
 * @property {number} type Tipo de región (Guarda un ángulo provisional ¿?)
 * @property {number} heightFloor Altura del suelo 0 - 4096
 * @property {number} heightCeiling Altura del techo 0 - 4096 (el techo no puede ser más bajo que el suelo)
 * @property {number} textureFloor Textura del suelo
 * @property {number} textureCeiling Textura del techo
 * @property {number} fade Luminosidad (Valor entre 0 y 15)
 */

/**
 * Bandera editable de un archivo .wld
 * @typedef {Object} Flag
 * @property {number} active ¿Activo?
 * @property {number} x Coordenada x
 * @property {number} y Coordenada y
 * @property {number} number Número de bandera
 */

/**
 * Geometría editable del archivo .wld
 * @typedef {Object} Geometry
 * @property {Array<Vertex>} vertices Vértices del mapa
 * @property {Array<Wall>} walls Paredes del mapa
 * @property {Array<Region>} regions Regiones del mapa
 * @property {Array<Flag>} flags Banderas del mapa
 * @property {number} background Fondo
 */

/**
 * Vértice VPE
 * @typedef {Object} VPEVertex
 * @property {number} type Siempre es 0
 * @property {number} x Coordenada x
 * @property {number} y Coordenada y
 * @property {number} path Siempre es -1
 * @property {number} link Siempre es -1
 */

/**
 * Pared de VPE
 * @typedef {Object} VPEWall
 * @property {number} type Tipo de pared
 * @property {number} vertexStart Vértice inicial
 * @property {number} vertexEnd Vértice final
 * @property {number} regionFront Región frontal
 * @property {number} regionBack Región trasera
 * @property {number} textureTop Textura superior
 * @property {number} textureMiddle Textura media
 * @property {number} textureBottom Textura inferior
 * @property {number} effect Efecto (Siempre es NO_NAME)
 * @property {number} fade Luminosidad
 * @property {number} textureX Coordenada de la textura x (Siempre es 0)
 * @property {number} textureY Coordenada de la textura y (Siempre es 0)
 * @property {number} mass Masa (Siempre es 0)
 * @property {number} tag Tag (Siempre es 0)
 */

/**
 * Región de VPE
 * @typedef {Object} VPERegion
 * @property {number} type Tipo
 * @property {number} heightFloor Altura del suelo
 * @property {number} heightCeiling Altura del techo
 * @property {number} regionBelow Región inferior (Siempre es -1)
 * @property {number} regionAbove Región superior (Siempre es -1)
 * @property {number} textureFloor Textura del suelo
 * @property {number} textureCeiling Textura del techo
 * @property {number} effect Efecto (Siempre es NO_NAME)
 * @property {number} fade Luminosidad
 * @property {number} tag Tag
 * @property {number} padding Padding (Esto es necesario para alinear correctamente la estructura)
 */

/**
 * Bandera de VPE
 * @typedef {Object} VPEFlag
 * @property {number} x Coordenada x
 * @property {number} y Coordenada y
 * @property {number} number Número
 */

/**
 * Fuerzas de VPE
 * @typedef {Object} VPEForce
 * @property {number} x Velocidad x
 * @property {number} y Velocidad y
 * @property {number} z Velocidad z
 * @property {number} t Torque
 */

/**
 * Esta es la estructura utilizada por el motor
 * de DIV para renderizar los escenarios.
 * @typedef {Object} VPE
 * @property {Array<VPEVertex>} vertices Vértices
 * @property {Array<VPEWall>} walls Paredes
 * @property {Array<VPERegion>} regions Regiones
 * @property {Array<VPEFlag>} flags Banderas
 * @property {string} title Titulo del mapa (Siempre es Mapa1)
 * @property {string} palette Paleta del mapa (Siempre es)
 * @property {number} textureScreen Textura de pantalla (siempre es 0)
 * @property {number} textureBack Textura de fondo
 * @property {string} effect Efecto (Siempre es NO_NAME)
 * @property {number} angle Ángulo trasero (Siempre 120)
 * @property {number} view Ángulo de visión (Siempre 0)
 * @property {VPEForce} force Fuerzas
 */

/**
 * Descripción de un archivo.
 * @typedef {FileDescription}
 * @property {string} path Ruta del archivo (en formato DOS y con un máximo de 256 caracteres)
 * @property {string} name Nombre del archivo (en formato DOS y con un máximo de 16 caracteres)
 */

/**
 * Archivo Wld
 * @typedef {Object} Wld
 * @property {Signature} signature Firma del archivo
 * @property {number} offset Offset de la estructura de VPE
 * @property {number} number Número de mapa
 * @property {FileDescription} wld Datos del archivo .wld
 * @property {FileDescription} fpg Datos del archivo .fpg
 * @property {Geometry} geom Geometría editable
 * @property {VPE} vpe Datos del VPE
 */

/**
 * Firma de la parte editable del archivo .wld
 * @constant {string}
 */
export const SIGNATURE = 'wld\x1A\x0D\x0A\x01\x00'

/**
 * Firma de la parte de VPE del archivo .wld
 * @constant {string}
 */
export const VPE_SIGNATURE = 'DAT\x00'

/**
 * Tamaño máximo del grid
 * @constant {number}
 */
export const GRID_SIZE = (2 ** 15) - 2560

/**
 * Creamos un vértice VPE a partir de un vértice editable.
 * @param {Vertex} input
 * @returns {VPEVertex}
 */
export function createVPEVertex(vertex) {
  return {
    type: 0,
    x: vertex.x,
    y: GRID_SIZE - vertex.y,
    path: -1,
    link: -1
  }
}

/**
 * Creamos una bandera VPE a partir de una bandera editable.
 * @param {Flag} flag
 * @returns {VPEFlag}
 */
export function createVPEFlag(flag) {
  return {
    x: flag.x,
    y: GRID_SIZE - flag.y,
    number: flag.number
  }
}

/**
 * Creamos una región VPE a partir de una región editable.
 * @param {Region} region
 * @returns {VPERegion}
 */
export function createVPERegion(region) {
  return {

  }
}

/**
 * Creamos una pared VPE a partir de una pared editable.
 * @param {wall} wall
 * @returns {VPEWall}
 */
export function createVPEWall(wall) {
  return {

  }
}

/**
 * Devuelve la firma de un archivo .wld
 * @param {Reader} reader
 * @returns {Signature}
 */
export function readSignature(reader) {
  return reader.readContents(SIGNATURE)
}

/**
 * Devuelve un vértice
 * @param {Reader} reader
 * @returns {Vertex}
 */
export function readVertex(reader) {
  const active = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const links = reader.readNumeric('u4le')
  return {
    active,
    x,
    y,
    links
  }
}

/**
 * Devuelve una pared editable de un archivo .wld
 * @param {Reader} reader
 * @returns {Wall}
 */
export function readWall(reader) {
  const active = reader.readNumeric('u4le')
  const type = reader.readNumeric('s4le')
  const vertexStart = reader.readNumeric('s4le')
  const vertexEnd = reader.readNumeric('s4le')
  const regionFront = reader.readNumeric('s4le')
  const regionBack = reader.readNumeric('s4le')
  const textureMiddle = reader.readNumeric('s4le')
  const textureTop = reader.readNumeric('s4le')
  const textureBottom = reader.readNumeric('s4le')
  const fade = reader.readNumeric('u4le')
  return {
    active,
    type,
    vertexStart,
    vertexEnd,
    regionFront,
    regionBack,
    textureMiddle,
    textureTop,
    textureBottom,
    fade
  }
}

/**
 * Devuelve una región editable de un archivo .wld
 * @param {Reader} reader
 * @returns {Region}
 */
export function readRegion(reader) {
  const active = reader.readNumeric('u4le')
  const type = reader.readNumeric('s4le')
  const heightFloor = reader.readNumeric('s4le')
  const heightCeiling = reader.readNumeric('s4le')
  const textureFloor = reader.readNumeric('s4le')
  const textureCeiling = reader.readNumeric('s4le')
  const fade = reader.readNumeric('u4le')
  return {
    active,
    type,
    heightFloor,
    heightCeiling,
    textureFloor,
    textureCeiling,
    fade
  }
}

/**
 * Devuelve una bandera editable del archivo .wld
 * @param {Reader} reader
 * @returns {Flag}
 */
export function readFlag(reader) {
  const active = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const number = reader.readNumeric('s4le')
  return {
    active,
    x,
    y,
    number
  }
}

/**
 * Devuelve la geometría editable de un archivo .wld
 * @param {Reader} reader
 * @returns {Geometry}
 */
export function readGeom(reader) {
  const vertices = []
  const walls = []
  const regions = []
  const flags = []
  const numVertices = reader.readNumeric('s4le')
  for (let index = 0; index < numVertices; index++) {
    const vertex = readVertex(reader)
    vertices.push(vertex)
  }
  const numWalls = reader.readNumeric('s4le')
  for (let index = 0; index < numWalls; index++) {
    const wall = readWall(reader)
    walls.push(wall)
  }
  const numRegions = reader.readNumeric('s4le')
  for (let index = 0; index < numRegions; index++) {
    const region = readRegion(reader)
    regions.push(region)
  }
  const numFlags = reader.readNumeric('s4le')
  for (let index = 0; index < numFlags; index++) {
    const flag = readFlag(reader)
    flags.push(flag)
  }
  const background = reader.readNumeric('s4le')
  return {
    vertices,
    walls,
    regions,
    flags,
    background
  }
}

/**
 * Devuelve la firma de VPE del archivo .wld
 * @param {Reader} reader
 * @returns {VPESignature}
 */
export function readVPESignature(reader) {
  return reader.readContents(VPE_SIGNATURE)
}

/**
 * Devuelve un vértice de VPE del archivo .wld
 * @param {Reader} reader
 * @returns {VPEVertex}
 */
export function readVPEVertex(reader) {
  const type = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const path = reader.readNumeric('s2le')
  const link = reader.readNumeric('s2le')
  return {
    type,
    x,
    y,
    path,
    link
  }
}

/**
 * Devuelve una pared de VPE del archivo .wld
 * @param {Reader} reader
 * @returns {VPEWall}
 */
export function readVPEWall(reader) {
  const type = reader.readNumeric('u4le')
  const vertexStart = reader.readNumeric('s2le')
  const vertexEnd = reader.readNumeric('s2le')
  const regionFront = reader.readNumeric('s2le')
  const regionBack = reader.readNumeric('s2le')
  const textureTop = reader.readNumeric('s4le')
  const textureMiddle = reader.readNumeric('s4le')
  const textureBottom = reader.readNumeric('s4le')
  const effect = reader.readFixedLengthString(10)
  const fade = reader.readNumeric('s2le')
  const textureX = reader.readNumeric('s2le')
  const textureY = reader.readNumeric('s2le')
  const mass = reader.readNumeric('s2le')
  const tag = reader.readNumeric('s2le')
  return {
    type,
    vertexStart,
    vertexEnd,
    regionFront,
    regionBack,
    textureTop,
    textureMiddle,
    textureBottom,
    effect,
    fade,
    textureX,
    textureY,
    mass,
    tag
  }
}

/**
 * Devuelve una región de VPE del archivo .wld
 * @param {Reader} reader
 * @returns {VPERegion}
 */
export function readVPERegion(reader) {
  const type = reader.readNumeric('u4le')
  const heightFloor = reader.readNumeric('s2le')
  const heightCeiling = reader.readNumeric('s2le')
  const regionBelow = reader.readNumeric('s2le')
  const regionAbove = reader.readNumeric('s2le')
  const textureFloor = reader.readNumeric('s4le')
  const textureCeiling = reader.readNumeric('s4le')
  const effect = reader.readFixedLengthString(10)
  const fade = reader.readNumeric('s2le')
  const tag = reader.readNumeric('s2le')
  const padding = reader.readNumeric('s2le')
  return {
    type,
    heightFloor,
    heightCeiling,
    regionBelow,
    regionAbove,
    textureFloor,
    textureCeiling,
    effect,
    fade,
    tag,
    padding
  }
}

/**
 * Devuelve una bandera de VPE del archivo .wld
 * @param {Reader} reader
 * @returns {VPEFlag}
 */
export function readVPEFlag(reader) {
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const number = reader.readNumeric('s4le')
  return { x, y, number }
}

/**
 * Devuelve las fuerzas que se aplican en el escenario VPE.
 * @param {Reader} reader
 * @returns {VPEForce}
 */
export function readVPEForce(reader) {
  const x = reader.readNumeric('s2le')
  const y = reader.readNumeric('s2le')
  const z = reader.readNumeric('s2le')
  const t = reader.readNumeric('s2le')
  return { x, y, z, t }
}

/**
 * Devuelve la estructura VPE
 * @param {Reader} reader
 * @returns {VPE}
 */
export function readVPE(reader) {
  const signature = readVPESignature(reader)

  const numVertices = reader.readNumeric('s2le')
  const numRegions = reader.readNumeric('s2le')
  const numWalls = reader.readNumeric('s2le')
  const numFlags = reader.readNumeric('s2le')
  const vertices = []
  const regions = []
  const walls = []
  const flags = []
  for (let index = 0; index < numVertices; index++) {
    vertices.push(readVPEVertex(reader))
  }
  for (let index = 0; index < numRegions; index++) {
    regions.push(readVPERegion(reader))
  }
  for (let index = 0; index < numWalls; index++) {
    walls.push(readVPEWall(reader))
  }
  for (let index = 0; index < numFlags; index++) {
    flags.push(readVPEFlag(reader))
  }
  const title = reader.readFixedLengthString(24)
  const palette = reader.readFixedLengthString(9)
  const textureScreen = reader.readNumeric('s4le')
  const textureBack = reader.readNumeric('s4le')
  const effect = reader.readFixedLengthString(9)
  const angle = reader.readNumeric('s2le')
  const view = reader.readNumeric('s2le')
  const force = readVPEForce(reader)
  return {
    signature,
    vertices,
    regions,
    walls,
    flags,
    title,
    palette,
    textureScreen,
    textureBack,
    effect,
    angle,
    view,
    force
  }
}

/**
 * Lee el archivo .wld
 * @param {Reader} reader
 * @returns {Wld}
 */
export function readFile(reader) {
  const signature = readSignature(reader)
  const offset = reader.readNumeric('u4le')
  const wld = {
    path: reader.readFixedLengthString(256),
    name: reader.readFixedLengthString(16)
  }
  const number = reader.readNumeric('s4le')
  const fpg = {
    path: reader.readFixedLengthString(256),
    name: reader.readFixedLengthString(16)
  }

  // leemos la parte del editor WLD.
  const geom = readGeom(reader)

  // leemos la parte de VPE
  reader.offset = offset + 12
  const vpe = readVPE(reader)
  return {
    signature,
    offset,
    number,
    wld,
    fpg,
    geom,
    vpe
  }
}

/**
 * Escribe la firma del archivo .wld
 * @param {Writer} writer
 * @returns {Writer}
 */
export function writeSignature(writer) {
  return writer.writeContents(SIGNATURE)
}

/**
 * Escribe la firma de VPE
 * @param {Writer} writer
 * @returns {Writer}
 */
export function writeVPESignature(writer) {
  return writer.writeContents(VPE_SIGNATURE)
}

/**
 * Escribe un vértice de VPE
 * @param {Writer} writer
 * @param {VPEVertex} vertex
 * @returns {Writer}
 */
export function writeVPEVertex(writer, { type, x, y, path, link }) {
  return writer
    .writeNumeric('u4le', type)
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('s2le', path)
    .writeNumeric('s2le', link)
}

/**
 * Escribe una pared de VPE
 * @param {Writer} writer
 * @param {VPEWall} wall
 * @returns {Writer}
 */
export function writeVPEWall(writer, {
  type,
  vertexStart,
  vertexEnd,
  regionFront,
  regionBack,
  textureTop,
  textureMiddle,
  textureBottom,
  effect,
  fade,
  textureX,
  textureY,
  mass,
  tag
}) {
  return writer
    .writeNumeric('u4le', type)
    .writeNumeric('s2le', vertexStart)
    .writeNumeric('s2le', vertexEnd)
    .writeNumeric('s2le', regionFront)
    .writeNumeric('s2le', regionBack)
    .writeNumeric('s4le', textureTop)
    .writeNumeric('s4le', textureMiddle)
    .writeNumeric('s4le', textureBottom)
    .writeFixedLengthString(10, effect)
    .writeNumeric('s2le', fade)
    .writeNumeric('s2le', textureX)
    .writeNumeric('s2le', textureY)
    .writeNumeric('s2le', mass)
    .writeNumeric('s2le', tag)
}

/**
 * Escribe una región de VPE
 * @param {Writer} writer
 * @param {VPERegion} region
 * @returns {Writer}
 */
export function writeVPERegion(writer, {
  type,
  heightFloor,
  heightCeiling,
  regionBelow,
  regionAbove,
  textureFloor,
  textureCeiling,
  effect,
  fade,
  tag
}) {
  return writer
    .writeNumeric('u4le', type)
    .writeNumeric('s2le', heightFloor)
    .writeNumeric('s2le', heightCeiling)
    .writeNumeric('s2le', regionBelow)
    .writeNumeric('s2le', regionAbove)
    .writeNumeric('s4le', textureFloor)
    .writeNumeric('s4le', textureCeiling)
    .writeFixedLengthString(10, effect)
    .writeNumeric('s2le', fade)
    .writeNumeric('s2le', tag)
    .writeNumeric('s2le', 0)
}

/**
 * Escribe una bandera de VPE
 * @param {Writer} writer
 * @param {VPEFlag} flag
 * @returns {Writer}
 */
export function writeVPEFlag(writer, { x, y, number }) {
  return writer
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('s4le', number)
}

/**
 * Escribe las fuerzas de VPE
 * @param {Writer} writer
 * @param {VPEForce} force
 * @returns {Writer}
 */
export function writeVPEForce(writer, { x, y, z, t }) {
  return writer
    .writeNumeric('s2le', x)
    .writeNumeric('s2le', y)
    .writeNumeric('s2le', z)
    .writeNumeric('s2le', t)
}

/**
 * Escribe el VPE
 * @param {Writer} writer
 * @param {VPE} vpe
 * @returns {Writer}
 */
export function writeVPE(writer, { vertices, regions, walls, flags, title, palette, textureScreen, textureBack, effect, angle, view, force }) {
  writeVPESignature(writer)
    .writeNumeric('s2le', vertices.length)
    .writeNumeric('s2le', regions.length)
    .writeNumeric('s2le', walls.length)
    .writeNumeric('s2le', flags.length)
  for (const vertex of vertices) {
    writeVPEVertex(writer, vertex)
  }
  for (const region of regions) {
    writeVPERegion(writer, region)
  }
  for (const wall of walls) {
    writeVPEWall(writer, wall)
  }
  for (const flag of flags) {
    writeVPEFlag(writer, flag)
  }
  writer
    .writeFixedLengthString(24, title)
    .writeFixedLengthString(9, palette)
    .writeNumeric('s4le', textureScreen)
    .writeNumeric('s4le', textureBack)
    .writeFixedLengthString(10, effect)
    .writeNumeric('s2le', angle)
    .writeNumeric('s2le', view)
  return writeVPEForce(writer, force)
}

/**
 * Escribe un vértice editable.
 * @param {Writer} writer
 * @param {Vertex} vertex
 * @returns {Writer}
 */
export function writeVertex(writer, { active, x, y, links }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('u4le', links)
}

/**
 * Escribe una pared editable.
 * @param {Writer} writer
 * @param {Wall} wall
 * @returns {Writer}
 */
export function writeWall(writer, { active, type, vertexStart, vertexEnd, regionFront, regionBack, textureMiddle, textureTop, textureBottom, fade }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', type)
    .writeNumeric('s4le', vertexStart)
    .writeNumeric('s4le', vertexEnd)
    .writeNumeric('s4le', regionFront)
    .writeNumeric('s4le', regionBack)
    .writeNumeric('s4le', textureMiddle)
    .writeNumeric('s4le', textureTop)
    .writeNumeric('s4le', textureBottom)
    .writeNumeric('u4le', fade)
}

/**
 * Escribe una región editable.
 * @param {Writer} writer
 * @param {Region} region
 * @returns {Writer}
 */
export function writeRegion(writer, { active, type, heightFloor, heightCeiling, textureFloor, textureCeiling, fade }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', type)
    .writeNumeric('s4le', heightFloor)
    .writeNumeric('s4le', heightCeiling)
    .writeNumeric('s4le', textureFloor)
    .writeNumeric('s4le', textureCeiling)
    .writeNumeric('u4le', fade)
}

/**
 * Escribe una bandera editable
 * @param {Writer} writer
 * @param {Flag} flag
 * @returns {Writer}
 */
export function writeFlag(writer, { active, x, y, number }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('s4le', number)
}

/**
 * Escribe la geometría editable de un archivo .wld
 * @param {Writer} writer
 * @param {Geometry} geometry
 * @returns {Writer}
 */
export function writeGeom(writer, { vertices, walls, regions, flags, background }) {
  writer.writeNumeric('s4le', vertices.length)
  for (const vertex of vertices) {
    writeVertex(writer, vertex)
  }
  writer.writeNumeric('s4le', walls.length)
  for (const wall of walls) {
    writeWall(writer, wall)
  }
  writer.writeNumeric('s4le', regions.length)
  for (const region of regions) {
    writeRegion(writer, region)
  }
  writer.writeNumeric('s4le', flags.length)
  for (const flag of flags) {
    writeFlag(writer, flag)
  }
  return writer.writeNumeric('s4le', background)
}

/**
 * Escribe la primera parte de un archivo .wld
 * @param {Writer} writer
 * @param {Wld} wld
 * @returns {Writer}
 */
export function writeWld(writer, wld) {
  writeSignature(writer)
    .writeNumeric('u4le', wld.offset)
    .writeFixedLengthString(256, wld.wld.path)
    .writeFixedLengthString(16, wld.wld.name)
    .writeNumeric('s4le', wld.number)
    .writeFixedLengthString(256, wld.fpg.path)
    .writeFixedLengthString(16, wld.fpg.name)

  // leemos la parte del editor WLD.
  writeGeom(writer, wld.geom)
}

/**
 * Escribimos un archivo .wld
 * @param {Writer} writer
 * @param {Wld} wld
 * @returns {Writer}
 */
export function writeFile(writer, wld) {
  writeWld(writer, wld)
  writer.offset = wld.offset + 12
  writeVPE(writer, wld.vpe)
}

export default {
  SIGNATURE,
  VPE_SIGNATURE,
  GRID_SIZE,
  readSignature,
  readGeom,
  readVertex,
  readWall,
  readRegion,
  readFlag,
  readVPE,
  readVPESignature,
  readVPEVertex,
  readVPEWall,
  readVPERegion,
  readVPEFlag,
  readVPEForce,
  readFile,
  writeSignature,
  writeGeom,
  writeVertex,
  writeWall,
  writeRegion,
  writeFlag,
  writeVPE,
  writeVPEVertex,
  writeVPEWall,
  writeVPERegion,
  writeVPEFlag,
  writeVPEForce,
  writeVPESignature,
  writeWld,
  writeFile
}
