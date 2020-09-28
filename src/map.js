import { readColors, readRanges, writeColors, writeRanges } from './pal'

export function readPoint(reader) {
  const x = reader.readNumeric('s2le')
  const y = reader.readNumeric('s2le')
  return { x, y }
}

export function readPoints(reader) {
  const numPoints = reader.readNumeric('u2le')
  const points = []
  for (let index = 0; index < numPoints; index++) {
    points.push(readPoint(reader))
  }
  return points
}

export function readSignature(reader) {
  return reader.readContents('map\x1A\x0D\x0A\x00\x00')
}

export function readFile(reader) {
  const signature = readSignature(reader)
  const width = reader.readNumeric('u2le')
  const height = reader.readNumeric('u2le')
  const code = reader.readNumeric('u4le')
  const description = reader.readFixedLengthString(32)
  const palette = {
    colors: readColors(reader),
    ranges: readRanges(reader)
  }
  const numPoints = reader.readNumeric('u2le')
  const points = []
  for (let index = 0; index < numPoints; index++) {
    points.push(readPoint(reader))
  }
  const pixels = reader.read(width * height)
  return {
    signature,
    width,
    height,
    code,
    description,
    palette,
    points,
    pixels
  }
}

export function writeSignature(writer) {
  return writer.writeContents('map\x1A\x0D\x0A\x00\x00')
}

export function writePoints(writer, points) {
  writer.writeNumeric('u2le', points.length)
  for (const point of points) {
    writePoint(writer, point)
  }
  return writer
}

export function writePoint(writer, { x, y }) {
  return writer
    .readNumeric('s2le', x)
    .readNumeric('s2le', y)
}

export function writeFile (writer, map) {
  writeSignature(writer)
  writer.writeNumeric('u2le', map.width)
  writer.writeNumeric('u2le', map.height)
  writer.writeNumeric('u4le', map.code)
  writer.writeFixedLengthString(32, map.description)
  writeColors(writer, map.palette.colors)
  writeRanges(writer, map.palette.ranges)
  writer.writeNumeric('u2le', map.points.length)
  for (const point of map.points) {
    writePoint(writer, point)
  }
  return writer.write(map.pixels)
}

export default {
  readPoint,
  readPoints,
  readSignature,
  readFile,
  writeSignature,
  writePoints,
  writePoint,
  writeFile
}
