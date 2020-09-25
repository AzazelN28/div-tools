import Endian from './Endian'

/**
 * @constant {RegExp}
 */
const numericRE = /^([fsu])([1248])(le|be)?$/

/**
 * @constant {RegExp}
 */
const stringRE = /^strz?$/

/**
 * Esta clase se encarga de leer de un DataView.
 */
export default class Reader {
  static isNumeric(value) {
    return numericRE.test(value)
  }

  static isString(value) {
    return stringRE.test(value)
  }

  static isNullTerminatedString(value) {
    return value === 'strz'
  }

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

  static getNumericDescription(value) {
    const matches = value.match(numericRE)
    if (matches) {
      const [, type, size, endian] = matches
      return { type, size: parseInt(size, 10), endian }
    }
  }

  static getNumericMethodName({ type, size }) {
    switch (type) {
      case 's':
        if (size >= 8) {
          return `getBigInt${size * 8}`
        }
        return `getInt${size * 8}`
      case 'u':
        if (size >= 8) {
          return `getBigUint${size * 8}`
        }
        return `getUint${size * 8}`
      case 'f':
        return `getFloat${size * 8}`
      default:
        throw new Error('Unknown type')
    }
  }

  constructor(arrayBuffer, byteOffset, byteLength) {
    this.dataView = new DataView(arrayBuffer, byteOffset, byteLength)
    this.endian = Endian.LITTLE
    this.encoding = 'utf8'
    this.offset = 0
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

  readString(size) {
    const decoder = new TextDecoder()
    const typedArray = this.dataView.buffer.slice(
      this.offset,
      this.offset + size
    )
    this.offset += size
    return decoder.decode(typedArray)
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
    } while (this.offset < end);
    const typedArray = new Uint8Array(array)
    const decoder = new TextDecoder()
    return decoder.decode(typedArray)
  }

  readNullTerminatedString() {
    const array = []
    do {
      const charCode = this.dataView.getUint8(this.offset++)
      array.push(charCode)
    } while (charCode !== 0)
    const typedArray = new Uint8Array(array)
    const decoder = new TextDecoder()
    return decoder.decode(typedArray)
  }

  read(size) {
    const value = this.dataView.buffer.slice(this.offset, this.offset + size)
    this.offset += size
    return value
  }

  readNumeric(numericType) {
    const description = Reader.getNumericDescription(numericType)
    if (!description) {
      throw new Error(
        `Cannot retrieve numeric description for '${numericType}'`
      )
    }
    const { type, size, endian } = description
    const methodName = Reader.getNumericMethodName({ type, size })
    const isLittleEndian = (endian || this.endian) === Endian.LITTLE
    const value = this.dataView[methodName](this.offset, isLittleEndian)
    this.offset += size
    return value
  }
}
