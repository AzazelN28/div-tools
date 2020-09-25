const numericRE = /^([fsu])([1248])(le|be)?$/
const stringRE = /^strz?$/

function getNumeric(value) {
  const matches = value.match(numericRE)
  if (matches) {
    const [, type, size, endian ] = matches
    return { type, size: parseInt(size, 10), endian }
  }
}

function isNumeric(value) {
  return numericRE.test(value)
}

function isNullTerminatedString(value) {
  return value === 'strz'
}

function isString(value) {
  return stringRE.test(value)
}

function normalize(contents) {
  return contents.flatMap(v => {
    if (typeof v === 'string') {
      const encoder = new TextEncoder()
      const typedArray = encoder.encode(v)
      return [...typedArray]
    }
    return v
  })
}

function evaluate(object, expression) {
  Object.assign(this, object)
  return eval(expression)
}

const Endian= {
  LITTLE: 'le',
  BIG: 'be'
}

function getNumericMethodName({ type, size }) {
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

class Reader {
  constructor(dataView, encoding = 'utf8', endian = Endian.BIG) {
    this.dataView = dataView
    this.offset = 0
    this.encoding = 'utf8'
    this.endian = Endian.BIG 
  }

  get byteLength() {
    return this.dataView.byteLength
  }

  readContents(contents) {
    if (typeof contents === 'string') {
      return this.readContents(contents.split(''))
    }
    const normalized = normalize(contents) 
    for (let i = 0; i < normalized.length; i++) {
      const value = this.dataView.getUint8(this.offset + i)
      if (value !== normalized[i]) {
        throw new Error('Content does not match')
      }
    }
    this.offset += normalized.length
    return contents 
  }

  readNumeric(numericType) {
    const { type, size, endian } = getNumeric(numericType)
    const methodName = getNumericMethodName({ type, size })
    const isLittleEndian = (endian || this.endian) === Endian.LITTLE
    const value = this.dataView[methodName](
      this.offset, 
      isLittleEndian
    )
    this.offset += size
    return value
  }

  readNullTerminatedString() {
    const array = []
    do {
      const charCode = this.dataView.getUint8(this.offset++)
      array.push(charCode)
    } while (charCode !== 0);
    const typedArray = new Uint8Array(array)
    const decoder = new TextDecoder()
    return decoder.decode(typedArray)
  }

  readString(size) {
    const decoder = new TextDecoder()
    const typedArray = this.dataView.buffer.slice(this.offset, this.offset + size)
    return decoder.decode(typedArray)
  }

  readBuffer(size) {
    const value = this.dataView.buffer.slice(this.offset, this.offset + size)
    this.offset += size
    return value
  }
}

function read(definition, reader, level = 0) {
  if (level === 0) {
    const { meta } = definition
    if (meta.endian) {
      reader.endian = meta.endian
      console.log(reader.endian)
    }
  }
  console.log(level, definition)
  const parsed = {} 
  const { seq, types, enums } = definition
  for (const item of seq) {
    const { id, type, contents, size, repeat } = item
    if (type === undefined) {
      if (contents !== undefined) {
        parsed[id] = reader.readContents(contents)
        continue
      } else if (size !== undefined) {
        const bufferSize = evaluate(parsed, size)
        parsed[id] = reader.readBuffer(bufferSize)
        continue
      } else {
        throw new Error('What the fuck')
      }
    }

    let count = 1
    if (repeat === 'expr') {
      count = evaluate(parsed, item['repeat-expr'])
    } else if (repeat === 'eos') {
      count = Infinity
    }

    if (count > 1) {
      parsed[id] = []
    }

    for (let i = 0; i < count; i++) {
      let current 
      if (isNumeric(type)) {
        current = reader.readNumeric(type)
        if (id === 'n_cpoints') {
          console.log(id, current)
          throw new Error('Bullshit')
        }
      } else if (isString(type)) {
        if (isNullTerminatedString(type)) {
          current = reader.readNullTerminatedString()
        } else {
          current = reader.readString(size)
        }
      } else {
        if (type in types) {
          current = read(types[type], reader, level + 1)
        } else {
          throw new Error(`Unknown type "${type}"`)
        }
      }

      // si es una lista de elementos...
      if (count > 1) {
        parsed[id][i] = current
      } else {
        parsed[id] = current
      }
    }
  }
  console.log(parsed)
  return parsed
}

const fs = require('fs');
const YAML = require('yaml');

(async () => {
  console.log(process.argv[2], process.argv[3])
  const definition = YAML.parse(await fs.promises.readFile(process.argv[2], 'utf8'))
  console.log(definition)
  const buffer = await fs.promises.readFile(process.argv[3])
  console.log(buffer)
  const dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length)
  console.log(dataView)
  const parsed = read(definition, new Reader(dataView))
  console.log(parsed)
})()

