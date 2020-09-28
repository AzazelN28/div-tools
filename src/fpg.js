import { readColors, readRanges, writeColors, writeRanges } from './pal'
import { readPoint, writePoint } from './map'

export function readSignature (reader) {
  return reader.readContents('fpg\x1A\x0D\x0A\x00\x00')
}

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

export function writeSignature (writer) {
  return writer.writeContents('fpg\x1A\x0D\x0A\x00\x00')
}

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
  writeFile
}
