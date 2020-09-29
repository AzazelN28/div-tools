import Endian from './Endian'
import Op from './Op'
import Types from './Types'

/**
 * @module io
 */

/**
 * @typedef {object} ReaderOptions
 * @property {DataView} dataView
 * @property {Endian} [endian=Endian.BIG]
 * @property {string} [encoding='utf-8']
 * @property {number} [offset=0]
 */

/**
 * Esta clase se encarga de leer de un DataView.
 */
export class Reader {
  /**
   * Constructor
   * @param {ReaderOptions} [options]
   */
  constructor({
    dataView,
    endian = Endian.BIG,
    encoding = 'utf-8',
    offset = 0
  }) {
    this.dataView = dataView
    this.endian = endian
    this.encoding = encoding
    this.offset = offset
  }

  /**
   * Bytes disponibles
   * @type {number}
   */
  get bytesAvailable() {
    return this.dataView.byteLength - this.offset
  }

  /**
   * Offset dentro del DataView
   * @type {number}
   */
  get byteOffset() {
    return this.dataView.byteOffset
  }

  /**
   * Longitud en bytes del DataView
   * @type {number}
   */
  get byteLength() {
    return this.dataView.byteLength
  }

  /**
   * Lee un contenido
   * @param {string|Array} contents
   * @returns {Uint8Array}
   */
  readContents(contents) {
    if (typeof contents === 'string') {
      return this.readContents(contents.split(''))
    }
    const normalized = Types.normalize(contents)
    for (let i = 0; i < normalized.length; i++) {
      const value = this.dataView.getUint8(this.offset + i)
      if (value !== normalized[i]) {
        throw new Error(`Content does not match ${value} !== ${normalized[i]}`)
      }
    }
    this.offset += normalized.length
    return contents
  }

  /**
   * Lee una cadena de longitud fija
   * @param {number} size
   * @returns {string}
   */
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

  /**
   * Lee una cadena de la que no sabemos la longitud
   * @returns {string}
   */
  readNullTerminatedString() {
    const array = []
    let charCode
    do {
      charCode = this.dataView.getUint8(this.offset++)
      if (charCode !== 0) {
        array.push(charCode)
      }
    } while (charCode !== 0)
    const typedArray = new Uint8Array(array)
    const decoder = new TextDecoder()
    return decoder.decode(typedArray)
  }

  /**
   * Devuelve un ArrayBuffer desde la posición y el
   * tamaño indicados.
   * @param {number} offset
   * @param {number} size
   * @returns {ArrayBuffer}
   */
  from(offset, size) {
    return this.dataView.buffer.slice(offset, offset + size)
  }

  /**
   * Devuelve un ArrayBuffer del tamaño indicado
   * desde la posición actual.
   * @param {number} size
   * @returns {ArrayBuffer}
   */
  read(size) {
    const value = this.dataView.buffer.slice(this.offset, this.offset + size)
    this.offset += size
    return value
  }

  /**
   * Devuelve un número
   * @param {NumericDescription} numericType
   * @returns {number}
   */
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

  /**
   * Devuelve un objeto a partir de una lista de valores.
   * @param {Array<string>} sequence
   * @returns {Object}
   */
  readObject(sequence) {
    const object = {}
    for (const item of sequence) {
      const { name, type, size } = item
      let value
      if (Types.isNumeric(type)) {
        value = this.readNumeric(type)
      } else if (Types.isString(type)) {
        if (type === 'str') {
          value = this.readFixedLengthString(size)
        } else if (type === 'strz') {
          value = this.readNullTerminatedString()
        }
      } else {
        throw new Error(`Invalid type "${type}"`)
      }
      object[name] = value
    }
    return object
  }
}

export default Reader
