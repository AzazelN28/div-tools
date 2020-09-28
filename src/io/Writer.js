import Endian from './Endian'
import DryDataView from './DryDataView'
import Op from './Op'
import Types from './Types'

/**
 * Esta clase nos permite escribir en un DataView
 */
export default class Writer {
  static createEstimator({ endian = Endian.BIG, encoding = 'utf-8', debug = false, offset = 0 }) {
    return new Writer({ dataView: new DryDataView(debug), endian, encoding, offset })
  }

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

  get bytesAvailable() {
    return this.dataView.byteLength - this.offset
  }

  get byteOffset() {
    return this.dataView.byteOffset
  }

  get byteLength() {
    return this.dataView.byteLength
  }

  writeContents(contents) {
    if (typeof contents === 'string') {
      return this.writeContents(contents.split(''))
    }
    const normalized = Types.normalize(contents)
    for (let i = 0; i < normalized.length; i++) {
      this.dataView.setUint8(this.offset + i, normalized[i])
    }
    this.offset += normalized.length
    return this
  }

  writeFixedLengthString(size, string) {
    const textEncoder = new TextEncoder(this.encoding)
    const encoded = textEncoder.encode(string)
    for (let i = 0; i < size; i++) {
      if (i < encoded.length) {
        this.dataView.setUint8(this.offset + i, encoded[i])
      } else {
        this.dataView.setUint8(this.offset + i, 0)
      }
    }
    this.offset += encoded.length
    return this
  }

  writeNullTerminatedString(string) {
    const textEncoder = new TextEncoder(this.encoding)
    const encoded = textEncoder.encode(string)
    for (let i = 0; i < encoded.length; i++) {
      this.dataView.setUint8(this.offset + i, encoded[i])
    }
    this.dataView.setUint8(this.offset + encoded.length, 0)
    this.offset += encoded.length
    return this
  }

  writeNumeric(numericType, value) {
    const description = Types.getNumericDescription(numericType)
    if (!description) {
      throw new Error(
        `Cannot retrieve numeric description for '${numericType}'`
      )
    }
    const { type, size, endian } = description
    const methodName = Types.getNumericMethodName({ op: Op.SET, type, size })
    const isLittleEndian = (endian || this.endian) === Endian.LITTLE
    this.dataView[methodName](this.offset, value, isLittleEndian)
    this.offset += size
    return this
  }

  writeObject(sequence, object) {
    for (const item of sequence) {
      const { name, type, size } = item
      const value = object[name]
      if (Types.isNumeric(type)) {
        this.writeNumeric(type, value)
      } else if (Types.isString(type)) {
        if (type === 'str') {
          this.writeFixedLengthString(size, value)
        } else if (type === 'strz') {
          this.writeNullTerminatedString(value)
        }
      } else {
        throw new Error(`Invalid type "${type}"`)
      }
    }
    return this
  }

  /**
   *
   * @param {ArrayBuffer} buffer
   * @returns {Writer}
   */
  write(buffer) {
    const typedArray = new Uint8Array(this.dataView.buffer)
    typedArray.set(new Uint8Array(buffer), this.offset)
    this.offset += buffer.byteLength
    return this
  }

  /**
   * Escribe un ArrayBuffer del tamaño y en la posición
   * indicadas.
   * @param {number} offset
   * @param {number} size
   * @param {ArrayBuffer} buffer
   * @returns {Writer}
   */
  to(offset, size, buffer) {
    const typedArray = new Uint8Array(this.dataView.buffer, offset, size)
    typedArray.set(new Uint8Array(buffer))
    return this
  }
}
