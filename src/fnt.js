import { readColors, readRanges, writeColors, writeRanges } from './pal'

export function readSignature (reader) {
  return reader.readContents('fnt\x1A\x0D\x0A\x00\x00')
}

export function readCharset (reader) {
  const data = reader.readNumeric('u4le')
  const numbers = (data >> 5) & 0x01
  const uppercase = (data >> 4) & 0x01
  const lowercase = (data >> 3) & 0x01
  const symbols = (data >> 2) & 0x01
  const extended = (data >> 1) & 0x01
  return {
    numbers,
    uppercase,
    lowercase,
    symbols,
    extended
  }
}

export function readCharacter (reader) {
  const width = reader.readNumeric('u4le')
  const height = reader.readNumeric('u4le')
  const incY = reader.readNumeric('s4le')
  const offset = reader.readNumeric('u4le')
  const pixels = reader.from(offset, width * height)
  return {
    width,
    height,
    incY,
    offset,
    pixels
  }
}

export function readCharacters (reader) {
  const characters = []
  for (let index = 0; index < 256; index++) {
    const character = readCharacter(reader)
    characters.push(character)
  }
  return characters
}

export function readFile (reader) {
  const signature = readSignature(reader)
  const palette = {
    colors: readColors(reader),
    ranges: readRanges(reader)
  }
  const charset = readCharset(reader)
  const characters = readCharacters(reader)
  return {
    signature,
    palette,
    charset,
    characters
  }
}

export function writeSignature(writer) {
  return writer.readContents('fnt\x1A\x0D\x0A\x00\x00')
}

export function writeCharset(writer, {
  numbers,
  uppercase,
  lowercase,
  symbols,
  extended
}) {
  const charset = (numbers & 0x01) << 5
  | (uppercase & 0x01) << 4
  | (lowercase & 0x01) << 3
  | (symbols & 0x01) << 2
  | (extended & 0x01) << 1
  return writer.writeNumeric('u4le', charset)
}

export function writeCharacter(writer, { width, height, incY, offset, pixels }) {
  return writer
    .writeNumeric('u4le', width)
    .writeNumeric('u4le', height)
    .writeNumeric('s4le', incY)
    .writeNumeric('u4le', offset)
    .to(offset, width * height, pixels)
}

export function writeCharacters(writer, characters) {
  if (characters.length !== 256) {
    throw new Error('Invalid characters length, it must be 256')
  }
  for (const character of characters) {
    writeCharacter(writer, character)
  }
  return writer
}

export function writeFile (writer, fnt) {
  writeSignature(writer)
  writeColors(writer, fnt.palette.colors)
  writeRanges(writer, fnt.palette.ranges)
  writeCharset(writer, fnt.charset)
  writeCharacters(writer, fnt.characters)
}

export default {
  readSignature,
  readCharset,
  readCharacter,
  readCharacters,
  readFile,
  writeSignature,
  writeCharset,
  writeCharacter,
  writeCharacters,
  writeFile
}
