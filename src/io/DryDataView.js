/**
 * @module io
 */

/**
 * Esta clase nos permite simular la escritura o la
 * lectura de un archivo.
 */
export class DryDataView {
  /**
   * Constructor
   * @param {boolean} debug Modo debug
   */
  constructor(debug = false) {
    const getters = [
      'getBigInt64',
      'getBigUint64',
      'getFloat32',
      'getFloat64',
      'getInt16',
      'getInt32',
      'getInt8',
      'getUint16',
      'getUint32',
      'getUint8'
    ]
    const setters = [
      'setBigInt64',
      'setBigUint64',
      'setFloat32',
      'setFloat64',
      'setInt16',
      'setInt32',
      'setInt8',
      'setUint16',
      'setUint32',
      'setUint8'
    ]
    this._byteLength = 0
    for (const getter of getters) {
      this[getter] = (offset, littleEndian) => {
        if (debug) {
          console.log(getter, offset, littleEndian)
        }
      }
    }
    for (const setter of setters) {
      this[setter] = (offset, value, littleEndian) => {
        const [, bitSize] = setter.match(/(8|16|32|64)$/)
        const byteSize = (parseInt(bitSize, 10) / 8)
        this._byteLength = Math.max(offset + byteSize, this._byteLength)
        if (debug) {
          console.log(setter, offset, value, littleEndian)
        }
      }
    }
  }

  /**
   * Buffer (siempre devuelve `null`)
   * @type {ArrayBuffer}
   */
  get buffer() {
    return null
  }

  /**
   * Devuelve la longitud en bytes
   * @type {number}
   */
  get byteLength() {
    return this._byteLength
  }

  /**
   * Devuelve el offset en bytes (siempre es 0)
   * @type {number}
   */
  get byteOffset() {
    return 0
  }
}

export default DryDataView
