import { readColors, readRanges, writeColors, writeRanges } from './pal'
import { readPoint, writePoint } from './map'

/**
 * @module fpg
 */

/**
 * Mapa contenido dentro de un archivo .fpg
 * @typedef {Object} Map
 * @property {number} code
 * @property {number} length
 * @property {string} description
 * @property {string} filename
 * @property {number} width
 * @property {number} height
 * @property {Array<Point>} points
 * @property {ArrayBuffer} pixels
 */

/**
 *
 * @typedef {Object} Fpg
 * @property {Signature} signature,
 * @property {Palette} palette
 * @property {Array<Map>} maps
 */

/**
 * "Firma" del archivo .fpg
 * @constant {string}
 */
export const SIGNATURE = 'fpg\x1A\x0D\x0A\x00\x00'

/**
 * Devuelve la "firma" de un archivo .fpg
 * @param {Reader} reader
 * @returns {Signature}
 */
export function readSignature (reader) {
  return reader.readContents(SIGNATURE)
}

/**
 * Lee un mapa dentro de un .fpg
 * @param {Reader} reader
 * @returns {Map}
 */
export function readMap (reader) {
  const code = reader.readNumeric('u4le')
  const length = reader.readNumeric('u4le')
  const description = reader.readFixedLengthString(32)
  const filename = reader.readFixedLengthString(12)
  const width = reader.readNumeric('u4le')
  const height = reader.readNumeric('u4le')
  const numPoints = reader.readNumeric('u4le')
  const points = []
  for (let index = 0; index < numPoints; index++) {
    points.push(readPoint(reader))
  }
  const pixels = reader.read(width * height)
  return {
    code,
    length,
    description,
    filename,
    width,
    height,
    points,
    pixels
  }
}

/**
 * Lee un .fpg
 * @param {Reader} reader
 * @returns {Fpg}
 */
export function readFile (reader) {
  const signature = readSignature(reader)
  const palette = {
    colors: readColors(reader),
    ranges: readRanges(reader)
  }
  const maps = []
  while (reader.bytesAvailable) {
    const map = readMap(reader)
    maps.push(map)
  }
  return {
    signature,
    palette,
    maps
  }
}

/**
 * Escribe la "firma" de un .fpg
 * @param {Writer} writer
 * @returns {Writer}
 */
export function writeSignature (writer) {
  return writer.writeContents(SIGNATURE)
}

/**
 * Escribe un mapa dentro del .fpg
 * @param {Writer} writer
 * @param {FpgMap} map
 * @returns {Writer}
 */
export function writeMap (writer, { code, length, description, filename, width, height, points, pixels }) {
  writer
    .writeNumeric('u4le', code)
    .writeNumeric('u4le', length)
    .writeFixedLengthString(32, description)
    .writeFixedLengthString(12, filename)
    .writeNumeric('u4le', width)
    .writeNumeric('u4le', height)
    .writeNumeric('u4le', points.length)
  for (const point of points) {
    writePoint(writer, point)
  }
  writer.write(writer, pixels)
  return writer
}

/**
 * Escribe un archivo .fpg
 * @param {Writer} writer
 * @param {Fpg} fpg
 * @returns {Writer}
 */
export function writeFile (writer, fpg) {
  writeSignature(writer)
  writeColors(writer, fpg.palette.colors)
  writeRanges(writer, fpg.palette.ranges)
  for (const map of fpg.maps) {
    writeMap(writer, map)
  }
  return writer
}

export default {
  readSignature,
  readMap,
  readFile,
  writeSignature,
  writeMap,
  writeFile
}
