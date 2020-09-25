import { readColors, readRanges } from './pal'

export function readPoint(reader) {
  const x = reader.readNumeric('s2le')
  const y = reader.readNumeric('s2le')
  return { x, y }
}

export function readPoints(reader) {

}

export function readSignature(reader) {
  return reader.readContents("map\x1A\x0D\x0A\x00\x00");
}

export function readFile(reader) {
  const signature = readSignature(reader)
  const width = reader.readNumeric('u2le')
  const height = reader.readNumeric('u2le')
  const code = reader.readNumeric('u4le')
  const description = reader.readString(32)
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

export function writeFile(writer) {

}

export default {
  readPoint,
  readPoints,
  readSignature,
  readFile,
  writeFile
}
