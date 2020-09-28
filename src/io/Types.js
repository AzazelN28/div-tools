/**
 * @constant {RegExp}
 */
const numericRE = /^([fsu])([1248])(le|be)?$/

/**
 * @constant {RegExp}
 */
const stringRE = /^strz?$/

export default {
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

  isNumeric(value) {
    return numericRE.test(value)
  },

  isString(value) {
    return stringRE.test(value)
  },

  isNullTerminatedString(value) {
    return value === 'strz'
  },
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
