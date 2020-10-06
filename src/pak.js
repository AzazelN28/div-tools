/**
 * Firma del archivo .pak
 * @constant {string}
 */
export const SIGNATURE = 'dat\x1A\x0D\x0A\x00\x00'

/**
 * Leemos la "firma" de un archivo .pak
 * @param {Reader} reader
 * @returns {Signature}
 */
export function readSignature(reader) {
  return reader.readContents(SIGNATURE)
}

/**
 * Leemos un archivo contenido dentro de un .pak
 * @param {Reader} reader
 * @returns {PakFile}
 */
export function readFileEntry(reader) {
  const filename = reader.readFixedLengthString(16)
  const offset = reader.readNumeric('s4le')
  const compressedSize = reader.readNumeric('s4le')
  const uncompressedSize = reader.readNumeric('s4le')
  return {
    filename,
    offset,
    compressedSize,
    uncompressedSize
  }
}

/**
 * Leemos un archivo .PAK.
 * @param {Reader} reader
 * @returns {Pak}
 */
export function readFile(reader) {
  const signature = readSignature(reader)
  const id = [
    reader.readNumeric('u4le'),
    reader.readNumeric('u4le'),
    reader.readNumeric('u4le')
  ]
  const numFiles = reader.readNumeric('u4le')
  const files = []
  for (let i = 0; i < numFiles; i++) {
    files.push(readFileEntry(reader))
  }
  return {
    signature,
    id,
    numFiles,
    files
  }
}

export default {
  readSignature,
  readFileEntry,
  readFile
}
