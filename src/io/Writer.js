import Endian from '../Endian'
import Op from './Op'
import Types from './Types'

/**
 *
 */
export default class Writer {
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

  writeContents(contents) {
    throw new Error('To be implemented')
  }

  writeFixedLengthString(size, string) {
    throw new Error('To be implemented')
  }

  writeNullTerminatedString(string) {
    throw new Error('To be implemented')
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
}
