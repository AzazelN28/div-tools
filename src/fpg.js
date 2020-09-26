import { readColors, readRanges } from './pal'
import { readPoint } from './map'

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

export function writeFile (writer, fpg) {}

export default {
  readSignature,
  readMap,
  readFile,
  writeFile
}
