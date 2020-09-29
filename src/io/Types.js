
/**
 * @module io
 */

/**
 * @typedef {Object} NumericMethodDescription
 * @property {Op} op
 * @property {Type} type
 * @property {number} size
 */

/**
 * Tipos de númericos que podemos leer/escribir.
 * @readonly
 * @enum {string}
 */
export const Type = {
  /** Entero con signo */
  SIGNED: 's',
  /** Entero sin signo */
  UNSIGNED: 'u',
  /** Decimal de coma flotante */
  FLOAT: 'f'
}

/**
 * Expresión regular usada para parsear los tipos de dato numérico.
 * @constant {RegExp}
 */
const numericRE = /^([fsu])([1248])(le|be)?$/

/**
 * Expresión regular usada para parsear los tipos de dato cadena.
 * @constant {RegExp}
 */
const stringRE = /^strz?$/

/**
 * @instance io.Types
 */
export const Types = {
  /**
   * Normaliza un `content`
   * @param {string|Array} contents
   * @returns {Uint8Array}
   */
  normalize(contents) {
    return contents.flatMap((v) => {
      if (typeof v === 'string') {
        const encoder = new TextEncoder()
        const typedArray = encoder.encode(v)
        return [...typedArray]
      }
      return v
    })
  },

  /**
   * Devuelve si el tipo pasado es de tipo numérico o no.
   * @param {string} value
   * @returns {boolean}
   */
  isNumeric(value) {
    return numericRE.test(value)
  },

  /**
   * Devuelve si el tipo pasado es de tipo cadena o no.
   * @param {string} value
   * @returns {boolean}
   */
  isString(value) {
    return stringRE.test(value)
  },

  /**
   * Devuelve si el tipo pasado es de tipo: cadena terminada en \x00
   * @param {string} value
   * @returns {boolean}
   */
  isNullTerminatedString(value) {
    return value === 'strz'
  },

  /**
   * Devuelve el tipo de método que necesitamos para el leer el tipo
   * numérico indicado.
   * @param {NumericMethodDescription} numericMethodDescription
   * @returns {string}
   */
  getNumericMethodName({ op, type, size }) {
    if (op !== 'get' && op !== 'set') {
      throw new Error(`Unknown operation "${op}"`)
    }
    switch (type) {
      case 's':
        if (size >= 8) {
          return `${op}BigInt${size * 8}`
        }
        return `${op}Int${size * 8}`
      case 'u':
        if (size >= 8) {
          return `${op}BigUint${size * 8}`
        }
        return `${op}Uint${size * 8}`
      case 'f':
        return `${op}Float${size * 8}`
      default:
        throw new Error('Unknown type')
    }
  },

  /**
   * Leemos la descripción de un número.
   * @param {string} value
   * @returns {NumericDescription}
   */
  getNumericDescription(value) {
    const matches = value.match(numericRE)
    if (matches) {
      const [, type, size, endian] = matches
      return {
        type,
        size: parseInt(size, 10),
        endian
      }
    }
  }
}

export default Types
