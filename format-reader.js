import fs from 'fs'
import YAML from 'yaml'
import Reader from './src/Reader'

function evaluate(object, expression) {
  Object.assign(this, object)
  return eval(expression)
}

function read(definition, reader, level = 0) {
  if (level === 0) {
    const { meta } = definition
    if (meta.endian) {
      reader.endian = meta.endian
    }
    if (meta.encoding) {
      reader.encoding = meta.encoding
    }
  }
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
        parsed[id] = reader.read(bufferSize)
        continue
      } else {
        throw new Error('Invalid definition')
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
      if (Reader.isNumeric(type)) {
        current = reader.readNumeric(type)
      } else if (Reader.isString(type)) {
        if (Reader.isNullTerminatedString(type)) {
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
  return parsed
};

(async () => {
  const definition = YAML.parse(await fs.promises.readFile(process.argv[2], 'utf8'))
  const buffer = await fs.promises.readFile(process.argv[3])
  const dataView = new DataView(buffer.buffer, buffer.byteOffset, buffer.length)
  const parsed = read(definition, new Reader(dataView))
  console.log(parsed)
})()

