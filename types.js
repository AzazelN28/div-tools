const numericRE = /^([fsu])([1248])(le|be)?$/
const stringRE = /^strz?$/

export function getNumeric(value) {
  const matches = value.match(re)
  if (matches) {
    const [, type, size, endianness ] = matches
    return { type, size, endianness }
  }
}

export function isNumeric(value) {
  return re.test(value)
}

export function isNullTerminatedString(value) {
  return value === 'strz'
}

export function isString(value) {
  return re.test(value)
}

