const COLORS_PER_PALETTE = 256
const RANGES_PER_PALETTE = 16
const COLORS_PER_RANGE = 32

export function createColor(r = 0, g = 0, b = 0) {
  return { r, g, b }
}

export function createColors() {
  const colors = []
  for (let i = 0; i < COLORS_PER_PALETTE; i++) {
    colors[i] = createColor()
  }
  return colors
}

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

export function createRanges() {
  const ranges = []
  for (let i = 0; i < RANGES_PER_PALETTE; i++) {
    ranges[i] = createRange()
  }
  return ranges
}

export function readColor(reader) {
  const r = reader.readNumeric('u1')
  const g = reader.readNumeric('u1')
  const b = reader.readNumeric('u1')
  return { r, g, b }
}

export function readColors(reader) {
  const palette = []
  for (let i = 0; i < COLORS_PER_PALETTE; i++) {
    palette.push(readColor(reader))
  }
  return palette
}

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

export function readRanges(reader) {
  const ranges = []
  for (let i = 0; i < RANGES_PER_PALETTE; i++) {
    ranges.push(readRange(reader))
  }
  return ranges
}

export function readSignature(reader) {
  return reader.readContents('pal\x1A\x0D\x0A\x00\x00')
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

export function writeSignature(writer) {
  return writer.writeContents('pal\x1A\x0D\x0A\x00\x00')
}

export function writeColor(writer, { r, g, b }) {
  return writer
    .writeNumeric('u1', r)
    .writeNumeric('u1', g)
    .writeNumeric('u1', b)
}

export function writeColors(writer, colors) {
  if (colors.length !== COLORS_PER_RANGE) {
    throw new Error('Invalid palette length, it must be 256')
  }
  for (const color of colors) {
    writeColor(writer, color)
  }
  return writer
}

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

export function writeRanges(writer, ranges) {
  for (const range of ranges) {
    writeRanges(writer, range)
  }
}

export function writeFile(writer, pal) {
  writeSignature(writer)
  writeColors(writer, pal.colors)
  writeRanges(writer, pal.ranges)
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
