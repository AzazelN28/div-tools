/**
 * @module pal
 */

/**
 * @typedef {Object} Pal
 * @property {Signature} signature
 * @property {Array<Color>} colors
 * @property {Array<Range>} ranges
 */

/**
 * Firma del archivo .pal
 * @constant {string}
 */
export const SIGNATURE = 'pal\x1A\x0D\x0A\x00\x00'

/**
 * Número de colores por paleta
 * @constant {number}
 */
export const COLORS_PER_PALETTE = 256

/**
 * Número de gamas por paleta
 * @constant {number}
 */
export const RANGES_PER_PALETTE = 16

/**
 * Número de colores por gama
 * @constant {number}
 */
export const COLORS_PER_RANGE = 32

/**
 * Crea un nuevo color
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {Color}
 */
export function createColor(r = 0, g = 0, b = 0) {
  return { r, g, b }
}

/**
 * Crea una lista de 256 colores
 * @returns {Array<Color>}
 */
export function createColors() {
  const colors = []
  for (let i = 0; i < COLORS_PER_PALETTE; i++) {
    colors[i] = createColor()
  }
  return colors
}

/**
 * Crea una gama de colores
 * @returns {Range}
 */
export function createRange() {
  const colors = []
  for (let i = 0; i < COLORS_PER_RANGE; i++) {
    colors[i] = 0
  }
  return {
    numColors: 0,
    type: 0,
    fixed: 0,
    black: 0,
    colors
  }
}

/**
 * Crea una lista de gamas de colores
 * @returns {Array<Range>}
 */
export function createRanges() {
  const ranges = []
  for (let i = 0; i < RANGES_PER_PALETTE; i++) {
    ranges[i] = createRange()
  }
  return ranges
}

/**
 * Lee un color
 * @param {Reader} reader
 * @returns {Color}
 */
export function readColor(reader) {
  const r = reader.readNumeric('u1')
  const g = reader.readNumeric('u1')
  const b = reader.readNumeric('u1')
  return { r, g, b }
}

/**
 * Leemos una lista de 256 colores
 * @param {Reader} reader
 * @returns {Array<Color>}
 */
export function readColors(reader) {
  const palette = []
  for (let i = 0; i < COLORS_PER_PALETTE; i++) {
    palette.push(readColor(reader))
  }
  return palette
}

/**
 * Leemos una gama de colores
 * @param {Reader} reader
 * @returns {Range}
 */
export function readRange(reader) {
  const range = createRange()
  range.numColors = reader.readNumeric('u1')
  range.type = reader.readNumeric('u1')
  range.fixed = reader.readNumeric('u1')
  range.black = reader.readNumeric('u1')
  for (let j = 0; j < COLORS_PER_RANGE; j++) {
    range.colors[j] = reader.readNumeric('u1')
  }
  return range
}

/**
 * Leemos una lista de gamas de colores
 * @param {Reader} reader
 * @returns {Array<Range>}
 */
export function readRanges(reader) {
  const ranges = []
  for (let i = 0; i < RANGES_PER_PALETTE; i++) {
    ranges.push(readRange(reader))
  }
  return ranges
}

/**
 * Leemos la "firma" de un archivo .pal
 * @param {Reader} reader
 * @returns {Signature}
 */
export function readSignature(reader) {
  return reader.readContents(SIGNATURE)
}

/**
 * Leemos una paleta.
 * @param {Reader} reader
 * @returns {Pal}
 */
export function readFile(reader) {
  const signature = readSignature(reader)
  const colors = readColors(reader)
  const ranges = readRanges(reader)
  return {
    signature,
    colors,
    ranges
  }
}

/**
 * Escribimos la firma de un archivo .pal
 * @param {Writer} writer
 * @returns {Writer}
 */
export function writeSignature(writer) {
  return writer.writeContents(SIGNATURE)
}

/**
 * Escribimos un color de la paleta.
 * @param {Writer} writer
 * @param {Color} color
 * @returns {Writer}
 */
export function writeColor(writer, { r, g, b }) {
  return writer
    .writeNumeric('u1', r)
    .writeNumeric('u1', g)
    .writeNumeric('u1', b)
}

/**
 * Escribimos los colores de una paleta.
 * @param {Writer} writer
 * @param {Array<Color>} colors
 * @returns {Writer}
 */
export function writeColors(writer, colors) {
  if (colors.length !== COLORS_PER_RANGE) {
    throw new Error('Invalid palette length, it must be 256')
  }
  for (const color of colors) {
    writeColor(writer, color)
  }
  return writer
}

/**
 * Escribimos una gama
 * @param {Writer} writer
 * @param {Range} range
 * @returns {Writer}
 */
export function writeRange(writer, { numColors, type, fixed, black, colors }) {
  writer
    .writeNumeric('u1', numColors)
    .writeNumeric('u1', type)
    .writeNumeric('u1', fixed)
    .writeNumeric('u1', black)
  if (colors.length !== COLORS_PER_RANGE) {
    throw new Error('Invalid range colors length, it must be 32')
  }
  for (const color of colors) {
    writer.writeNumeric('u1', color)
  }
  return writer
}

/**
 * Escribimos las gamas de la paleta.
 * @param {Writer} writer
 * @param {Array<Range>} ranges
 * @returns {Writer}
 */
export function writeRanges(writer, ranges) {
  for (const range of ranges) {
    writeRanges(writer, range)
  }
  return writer
}

/**
 * Escribimos una paleta.
 * @param {Writer} writer
 * @param {Pal} pal
 * @returns {Writer}
 */
export function writeFile(writer, pal) {
  writeSignature(writer)
  writeColors(writer, pal.colors)
  writeRanges(writer, pal.ranges)
  return writer
}

export default {
  createColor,
  createColors,
  createRange,
  createRanges,
  readColor,
  readColors,
  readRange,
  readRanges,
  readSignature,
  readFile,
  writeColor,
  writeColors,
  writeRange,
  writeRanges,
  writeSignature,
  writeFile
}
