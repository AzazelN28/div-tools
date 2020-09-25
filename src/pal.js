export function readColor(reader) {
  const r = reader.readNumeric("u1");
  const g = reader.readNumeric("u1");
  const b = reader.readNumeric("u1");
  return { r, g, b }
}

export function readColors(reader) {
  const palette = []
  for (let i = 0; i < 256; i++) {
    palette.push(readColor(reader))
  }
  return palette
}

export function createRange() {
  return {
    numColors: 0,
    type: 0,
    fixed: 0,
    black: 0,
    colors: Array.from('0'.repeat(32).split('').map(parseInt))
  }
}

export function readRange(reader) {
  const range = createRange()
  range.numColors = reader.readNumeric('u1')
  range.type = reader.readNumeric('u1')
  range.fixed = reader.readNumeric('u1')
  range.black = reader.readNumeric('u1')
  for (let j = 0; j < 32; j++) {
    range.colors[j] = reader.readNumeric('u1')
  }
  return range
}

export function readRanges(reader) {
  const ranges = []
  for (let i = 0; i < 16; i++) {
    ranges.push(readRange(reader))
  }
  return ranges
}

export function readSignature(reader) {
  return reader.readContents("pal\x1A\x0D\x0A\x00\x00");
}

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

export function writeFile(writer, pal) {

}

export default {
  readColors,
  createRange,
  readRange,
  readRanges,
  readSignature,
  readFile,
  writeFile
}
