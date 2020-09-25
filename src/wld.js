export function readSignature(reader) {
  return reader.readContents('wld\x1A\x0D\x0A\x01\x00')
}

export function readVertex(reader) {

}

export function readWall(reader) {

}

export function readRegion(reader) {

}

export function readFlag(reader) {

}

export function readGeom(reader) {
  const vertices = []
  const walls = []
  const regions = []
  const flags = []
  const numVertices = reader.readNumeric('s4le')
  for (let index = 0; index < numVertices; index++) {
    const vertex = readVertex(reader)
    vertices.push(vertex)
  }
  const numWalls = reader.readNumeric('s4le')
  for (let index = 0; index < numWalls; index++) {
    const wall = readWall(reader)
    walls.push(wall)
  }
  const numRegions = reader.readNumeric('s4le')
  for (let index = 0; index < numRegions; index++) {
    const region = readRegion(reader)
    regions.push(region)
  }
  const numFlags = reader.readNumeric('s4le')
  for (let index = 0; index < numFlags; index++) {
    const flag = readFlag(reader)
    flags.push(flag)
  }
  const background = reader.readNumeric('s4le')
  return {
    vertices,
    walls,
    regions,
    flags,
    background
  }
}

export function readVPESignature(reader) {
  return reader.readSignature('DAT\x00')
}

export function readVPEVertex(reader) {

}

export function readVPEWall(reader) {

}

export function readVPERegion(reader) {

}

export function readVPEFlag(reader) {

}

export function readVPE(reader) {
  const header = readVPESignature(reader)
  return {
    header
  }
}

export function readFile(reader) {
  const header = readSignature(reader)
  const offset = reader.readNumeric('u4le')
  const wld = {
    path: reader.readFixedLengthString(256),
    name: reader.readFixedLengthString(16)
  }
  const number = reader.readNumeric('s4le')
  const fpg = {
    path: reader.readFixedLengthString(256),
    name: reader.readFixedLengthString(16)
  }
  const geom = readGeom(reader)
  reader.offset = offset + 12
  const vpe = readVPE(reader)
  return {
    header,
    offset,
    number,
    wld,
    fpg,
    geom,
    vpe
  }  
}

export default {
  readSignature,

  readFile,
  writeFile
}