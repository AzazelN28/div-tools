const fs = require('fs')
const YAML = require('yaml')

const format = YAML.parse(fs.readFileSync(process.argv[2], 'utf-8'))

const parsed = {}
for (const item of format.seq) {
  if (item.id) {
    parsed[item.id] = {}
  }
  if (item.type) {

  }
  if (item.repeat) {
    
  }
  console.log(item)
}
