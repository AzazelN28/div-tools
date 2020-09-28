export function readSignature(reader) {
  return reader.readContents('wld\x1A\x0D\x0A\x01\x00')
}

export function readVertex(reader) {
  const active = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const links = reader.readNumeric('u4le')
  return {
    active,
    x,
    y,
    links
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
    active,
    type,
    vertexStart,
    vertexEnd,
    regionFront,
    regionBack,
    textureMiddle,
    textureTop,
    textureBottom,
    fade
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
    active,
    type,
    heightFloor,
    heightCeiling,
    textureFloor,
    textureCeiling,
    fade
  }
}

export function readFlag(reader) {
  const active = reader.readNumeric('u4le')
  const x = reader.readNumeric('s4le')
  const y = reader.readNumeric('s4le')
  const number = reader.readNumeric('s4le')
  return {
    active,
    x,
    y,
    number
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
    type,
    x,
    y,
    path,
    link
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
  const padding = reader.readNumeric('s2le')
  return {
    type,
    heightFloor,
    heightCeiling,
    regionBelow,
    regionAbove,
    textureFloor,
    textureCeiling,
    effect,
    fade,
    tag,
    padding
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
  const palette = reader.readFixedLengthString(9)
  const textureScreen = reader.readNumeric('s4le')
  const textureBack = reader.readNumeric('s4le')
  const effect = reader.readFixedLengthString(9)
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
    force
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

export function writeSignature(writer) {
  return writer.writeContents('wld\x1A\x0D\x0A\x01\x00')
}

export function writeVPESignature(writer) {
  return writer.writeContents('dat\x00')
}

export function writeVPEVertex(writer, { type, x, y, path, link }) {
  return writer
    .writeNumeric('u4le', type)
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('s2le', path)
    .writeNumeric('s2le', link)
}

export function writeVPEWall(writer, {
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
}) {
  return writer
    .writeNumeric('u4le', type)
    .writeNumeric('s2le', vertexStart)
    .writeNumeric('s2le', vertexEnd)
    .writeNumeric('s2le', regionFront)
    .writeNumeric('s2le', regionBack)
    .writeNumeric('s4le', textureTop)
    .writeNumeric('s4le', textureMiddle)
    .writeNumeric('s4le', textureBottom)
    .writeFixedLengthString(10, effect)
    .writeNumeric('s2le', fade)
    .writeNumeric('s2le', textureX)
    .writeNumeric('s2le', textureY)
    .writeNumeric('s2le', mass)
    .writeNumeric('s2le', tag)
}

export function writeVPERegion(writer, {
  type,
  heightFloor,
  heightCeiling,
  regionBelow,
  regionAbove,
  textureFloor,
  textureCeiling,
  effect,
  fade,
  tag
}) {
  return writer
    .writeNumeric('u4le', type)
    .writeNumeric('s2le', heightFloor)
    .writeNumeric('s2le', heightCeiling)
    .writeNumeric('s2le', regionBelow)
    .writeNumeric('s2le', regionAbove)
    .writeNumeric('s4le', textureFloor)
    .writeNumeric('s4le', textureCeiling)
    .writeFixedLengthString(10, effect)
    .writeNumeric('s2le', fade)
    .writeNumeric('s2le', tag)
    .writeNumeric('s2le', 0)
}

export function writeVPEFlag(writer, { x, y, number }) {
  return writer
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('s4le', number)
}

export function writeVPEForce(writer, { x, y, z, t }) {
  return writer
    .writeNumeric('s2le', x)
    .writeNumeric('s2le', y)
    .writeNumeric('s2le', z)
    .writeNumeric('s2le', t)
}

export function writeVPE(writer, { vertices, regions, walls, flags, title, palette, textureScreen, textureBack, effect, angle, view, force }) {
  writeVPESignature(writer)
    .writeNumeric('s2le', vertices.length)
    .writeNumeric('s2le', regions.length)
    .writeNumeric('s2le', walls.length)
    .writeNumeric('s2le', flags.length)
  for (const vertex of vertices) {
    writeVPEVertex(writer, vertex)
  }
  for (const region of regions) {
    writeVPERegion(writer, region)
  }
  for (const wall of walls) {
    writeVPEWall(writer, wall)
  }
  for (const flag of flags) {
    writeVPEFlag(writer, flag)
  }
  writer
    .writeFixedLengthString(24, title)
    .writeFixedLengthString(9, palette)
    .writeNumeric('s4le', textureScreen)
    .writeNumeric('s4le', textureBack)
    .writeFixedLengthString(10, effect)
    .writeNumeric('s2le', angle)
    .writeNumeric('s2le', view)
  return writeVPEForce(writer, force)
}

export function writeVertex(writer, { active, x, y, links }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('u4le', links)
}

export function writeWall(writer, { active, type, vertexStart, vertexEnd, regionFront, regionBack, textureMiddle, textureTop, textureBottom, fade }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', type)
    .writeNumeric('s4le', vertexStart)
    .writeNumeric('s4le', vertexEnd)
    .writeNumeric('s4le', regionFront)
    .writeNumeric('s4le', regionBack)
    .writeNumeric('s4le', textureMiddle)
    .writeNumeric('s4le', textureTop)
    .writeNumeric('s4le', textureBottom)
    .writeNumeric('u4le', fade)
}

export function writeRegion(writer, { active, type, heightFloor, heightCeiling, textureFloor, textureCeiling, fade }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', type)
    .writeNumeric('s4le', heightFloor)
    .writeNumeric('s4le', heightCeiling)
    .writeNumeric('s4le', textureFloor)
    .writeNumeric('s4le', textureCeiling)
    .writeNumeric('u4le', fade)
}

export function writeFlag(writer, { active, x, y, number }) {
  return writer
    .writeNumeric('u4le', active)
    .writeNumeric('s4le', x)
    .writeNumeric('s4le', y)
    .writeNumeric('s4le', number)
}

export function writeGeom(writer, { vertices, walls, regions, flags, background }) {
  writer.writeNumeric('s4le', vertices.length)
  for (const vertex of vertices) {
    writeVertex(writer, vertex)
  }
  writer.writeNumeric('s4le', walls.length)
  for (const wall of walls) {
    writeWall(writer, wall)
  }
  writer.writeNumeric('s4le', regions.length)
  for (const region of regions) {
    writeRegion(writer, region)
  }
  writer.writeNumeric('s4le', flags.length)
  for (const flag of flags) {
    writeFlag(writer, flag)
  }
  return writer.writeNumeric('s4le', background)
}

export function writeWld(writer, wld) {
  writeSignature(writer)
    .writeNumeric('u4le', wld.offset)
    .writeFixedLengthString(256, wld.wld.path)
    .writeFixedLengthString(16, wld.wld.name)
    .writeNumeric('s4le', wld.number)
    .writeFixedLengthString(256, wld.fpg.path)
    .writeFixedLengthString(16, wld.fpg.name)

  // leemos la parte del editor WLD.
  writeGeom(writer, wld.geom)
}

export function writeFile(writer, wld) {
  writeWld(writer, wld)
  writer.offset = wld.offset + 12
  writeVPE(writer, wld.vpe)
}

export default {
  readSignature,
  readGeom,
  readVertex,
  readWall,
  readRegion,
  readFlag,
  readVPE,
  readVPESignature,
  readVPEVertex,
  readVPEWall,
  readVPERegion,
  readVPEFlag,
  readVPEForce,
  readFile,
  writeSignature,
  writeGeom,
  writeVertex,
  writeWall,
  writeRegion,
  writeFlag,
  writeVPE,
  writeVPEVertex,
  writeVPEWall,
  writeVPERegion,
  writeVPEFlag,
  writeVPEForce,
  writeVPESignature,
  writeWld,
  writeFile
}
