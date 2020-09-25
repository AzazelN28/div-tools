export function readSignature(reader) {
  return reader.readContents('wld\x1A\x0D\x0A\x01\x00')
}

export function readVertex(reader) {
  const active = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const links = reader.readNumeric('u4le')
  return {
    active, x, y, links
  }
}

export function readWall(reader) {
  const active = reader.readNumeric('u4le')
  const type = reader.readNumeric('s4le')
  const vertexStart = reader.readNumeric('s4le')
  const vertexEnd = reader.readNumeric('s4le')
  const regionFront = reader.readNumeric('s4le')
  const regionBack = reader.readNumeric('s4le')
  const textureMiddle = reader.readNumeric('s4le')
  const textureTop = reader.readNumeric('s4le')
  const textureBottom = reader.readNumeric('s4le')
  const fade = reader.readNumeric('u4le')
  return {
    active, type, vertexStart, vertexEnd, regionFront, regionBack, textureMiddle, textureTop, textureBottom, fade
  }
}

export function readRegion(reader) {
  const active = reader.readNumeric('u4le')
  const type = reader.readNumeric('s4le')
  const heightFloor = reader.readNumeric('s4le')
  const heightCeiling = reader.readNumeric('s4le')
  const textureFloor = reader.readNumeric('s4le')
  const textureCeiling = reader.readNumeric('s4le')
  const fade = reader.readNumeric('u4le')
  return {
    active, type, heightFloor, heightCeiling, textureFloor, textureCeiling, fade
  }
}

export function readFlag(reader) {
  const active = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const number = reader.readNumeric('s4le')
  return {
    active, x, y, number
  }
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
  return reader.readContents('DAT\x00')
}

export function readVPEVertex(reader) {
  const type = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const path = reader.readNumeric('s2le')
  const link = reader.readNumeric('s2le')
  return {
    type, x, y, path, link
  }
}

export function readVPEWall(reader) {
  const type = reader.readNumeric('u4le')
  const vertexStart = reader.readNumeric('s2le')
  const vertexEnd = reader.readNumeric('s2le')
  const regionFront = reader.readNumeric('s2le')
  const regionBack = reader.readNumeric('s2le')
  const textureTop = reader.readNumeric('s4le')
  const textureMiddle = reader.readNumeric('s4le')
  const textureBottom = reader.readNumeric('s4le')
  const effect = reader.readFixedLengthString(10)
  const fade = reader.readNumeric('s2le')
  const textureX = reader.readNumeric('s2le')
  const textureY = reader.readNumeric('s2le')
  const mass = reader.readNumeric('s2le')
  const tag = reader.readNumeric('s2le')
  return {
    type,
    vertexStart,
    vertexEnd,
    regionFront,
    regionBack,
    textureTop,
    textureMiddle,
    textureBottom,
    effect,
    fade,
    textureX,
    textureY,
    mass,
    tag
  }
}

export function readVPERegion(reader) {
  const type = reader.readNumeric('u4le')
  const heightFloor = reader.readNumeric('s2le')
  const heightCeiling = reader.readNumeric('s2le')
  const regionBelow = reader.readNumeric('s2le')
  const regionAbove = reader.readNumeric('s2le')
  const textureFloor = reader.readNumeric('s4le')
  const textureCeiling = reader.readNumeric('s4le')
  const effect = reader.readFixedLengthString(10)
  const fade = reader.readNumeric('s2le')
  const tag = reader.readNumeric('s2le')
  return {
    type, heightFloor, heightCeiling,
    regionBelow,regionAbove,textureFloor,textureCeiling,
    effect,fade,tag
  }
}

export function readVPEFlag(reader) {
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const number = reader.readNumeric('s4le')
  return { x, y, number }
}

export function readVPEForce(reader) {
  const x = reader.readNumeric('s2le')
  const y = reader.readNumeric('s2le')
  const z = reader.readNumeric('s2le')
  const t = reader.readNumeric('s2le')
  return { x, y, z, t }
}

export function readVPE(reader) {
  const signature = readVPESignature(reader)

  const numVertices = reader.readNumeric('s2le')
  const numRegions = reader.readNumeric('s2le')
  const numWalls = reader.readNumeric('s2le')
  const numFlags = reader.readNumeric('s2le')
  const vertices = []
  const regions = []
  const walls = []
  const flags = []
  for (let index = 0; index < numVertices; index++) {
    vertices.push(readVPEVertex(reader))
  }
  for (let index = 0; index < numRegions; index++) {
    regions.push(readVPERegion(reader))
  }
  for (let index = 0; index < numWalls; index++) {
    walls.push(readVPEWall(reader))
  }
  for (let index = 0; index < numFlags; index++) {
    flags.push(readVPEFlag(reader))
  }
  const title = reader.readFixedLengthString(24)
  const palette = reader.readFixedLengthString(12)
  const textureScreen = reader.readNumeric('s4le')
  const textureBack = reader.readNumeric('s4le')
  const effect = reader.readFixedLengthString(10)
  const angle = reader.readNumeric('s2le')
  const view = reader.readNumeric('s2le')
  const force = readVPEForce(reader)
  return {
    signature,
    vertices,
    regions,
    walls,
    flags,
    title,
    palette,
    textureScreen,
    textureBack,
    effect,
    angle,
    view,
    force,
  }
}

export function readFile(reader) {
  const signature = readSignature(reader)
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

  // leemos la parte del editor WLD.
  const geom = readGeom(reader)

  // leemos la parte de VPE
  reader.offset = offset + 12
  const vpe = readVPE(reader)
  return {
    signature,
    offset,
    number,
    wld,
    fpg,
    geom,
    vpe
  }
}

export function writeFile(writer, wld) {}

export default {
  readSignature,
  readVertex,
  readWall,
  readRegion,
  readFlag,
  readVPE,
  readVPEFlag,
  readVPEForce,
  readVPERegion,
  readVPEVertex,
  readVPESignature,
  readVPEWall,
  readFile,
  writeFile
}
