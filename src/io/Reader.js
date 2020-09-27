import Endian from './Endian'
import Op from './Op'
import Types from './Types'

/**
 * Esta clase se encarga de leer de un DataView.
 */
export default class Reader {
  static normalize(contents) {
    return contents.flatMap((v) => {
      if (typeof v === 'string') {
        const encoder = new TextEncoder()
        const typedArray = encoder.encode(v)
        return [...typedArray]
      }
      return v
    })
  }

  constructor({
    arrayBuffer,
    byteOffset = 0,
    byteLength = 0,
    endian = Endian.BIG,
    encoding = 'utf-8',
    offset = 0
  }) {
    this.dataView = new DataView(arrayBuffer, byteOffset, byteLength)
    this.endian = endian
    this.encoding = encoding
    this.offset = offset
  }

  get bytesAvailable() {
    return this.dataView.byteLength - this.offset
  }

  get byteOffset() {
    return this.dataView.byteOffset
  }

  get byteLength() {
    return this.dataView.byteLength
  }

  readContents(contents) {
    if (typeof contents === 'string') {
      return this.readContents(contents.split(''))
    }
    const normalized = Reader.normalize(contents)
    for (let i = 0; i < normalized.length; i++) {
      const value = this.dataView.getUint8(this.offset + i)
      if (value !== normalized[i]) {
        throw new Error(`Content does not match ${value} !== ${normalized[i]}`)
      }
    }
    this.offset += normalized.length
    return contents
  }

  readFixedLengthString(size) {
    const end = this.offset + size
    const array = []
    let isReading = true
    do {
      const charCode = this.dataView.getUint8(this.offset++)
      if (charCode === 0) {
        isReading = false
      }
      if (isReading) {
        array.push(charCode)
      }
    } while (this.offset < end)
    const typedArray = new Uint8Array(array)
    const decoder = new TextDecoder()
    return decoder.decode(typedArray)
  }

  readNullTerminatedString() {
    const array = []
    let charCode
    do {
      charCode = this.dataView.getUint8(this.offset++)
      array.push(charCode)
    } while (charCode !== 0)
    const typedArray = new Uint8Array(array)
    const decoder = new TextDecoder()
    return decoder.decode(typedArray)
  }

  from(offset, size) {
    return this.dataView.buffer.slice(offset, offset + size)
  }

  read(size) {
    const value = this.dataView.buffer.slice(this.offset, this.offset + size)
    this.offset += size
    return value
  }

  readNumeric(numericType) {
    const description = Types.getNumericDescription(numericType)
    if (!description) {
      throw new Error(
        `Cannot retrieve numeric description for '${numericType}'`
      )
    }
    const { type, size, endian } = description
    const methodName = Types.getNumericMethodName({ op: Op.GET, type, size })
    const isLittleEndian = (endian || this.endian) === Endian.LITTLE
    const value = this.dataView[methodName](this.offset, isLittleEndian)
    this.offset += size
    return value
  }
}
