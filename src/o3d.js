/**
 * @module o3d
 */

/**
 * Matriz de 4x4
 * @typedef {Array<number>} Matrix
 * @property {number} 0
 * @property {number} 1
 * @property {number} 2
 * @property {number} 3
 * @property {number} 4
 * @property {number} 5
 * @property {number} 6
 * @property {number} 7
 * @property {number} 8
 * @property {number} 9
 * @property {number} 10
 * @property {number} 11
 * @property {number} 12
 * @property {number} 13
 * @property {number} 14
 * @property {number} 15
 */

/**
 * Vector de 2 dimensiones
 * @typedef {Object} Vector2
 * @property {number} u
 * @property {number} v
 */

/**
 * Vector de 3 dimensiones
 * @typedef {Object} Vector3
 * @property {number} x
 * @property {number} y
 * @property {number} z
 */

/**
 * Color
 * @typedef {Object} Color
 * @property {number} r
 * @property {number} g
 * @property {number} b
 */

/**
 * BoundingBox
 * @typedef {Object} BoundingBox
 * @property {Vector3} min
 * @property {Vector3} max
 */

/**
 * @typedef {Object} Material
 * @property {Color} diffuse Color del difuso
 * @property {Color} ambient Color del ambient
 * @property {Color} specular Color del especular
 * @property {number} transparency Transparencia
 * @property {string} texture Nombre de la textura
 * @property {MaterialType} type Tipo de material
 */

/**
 * Vértice de un modelo
 * @typedef {Object} Vertex
 * @property {Vector3} position Posición del vértice
 * @property {Vector3} normal Normal del vértice
 * @property {Vector2} texture Posición de la textura del vértice
 */

/**
 * Cara de un modelo
 * @typedef {Object} Face
 * @property {number} a Índice del primer vértice
 * @property {number} b Índice del segundo vértice
 * @property {number} c Índice del tercer vértice
 * @property {number} material Índice del material
 */

/**
 * Modelo 3D
 * @typedef {Object} Mesh
 * @property {number} numVertices Número de vértices
 * @property {number} numFaces Número de caras
 * @property {number} material Índice del material
 * @property {string} name Nombre
 * @property {BoundingBox} boundingBox Bounding box del objeto
 * @property {Array<Vertex>} vertices Vértices
 * @property {Array<Face>} faces Caras
 */

/**
 * "Cinta americana" con la que tapar los agujeros entre objetos.
 * @typedef {Object} Tape
 * @property {number} startObject Índice del objeto inicial
 * @property {number} startVertex Índice del vértice del objeto inicial
 * @property {number} endObject Índice del objeto final
 * @property {number} endVertex Índice del vértice del objeto final
 * @property {number} linkMode Tipo de enlace
 */

/**
 * Transformación de un objeto.
 * @typedef {Object} Transform
 * @property {Matrix} matrix
 */

/**
 * Fotograma de una animación
 * @typedef {Array<Transform>} Frame
 */

/**
 * Objeto 3D
 * @typedef {Object} O3d
 * @property {Signature} signature
 * @property {number} version
 * @property {number} num
 * @property {number} offset
 * @property {BoundingBox} boundingBox
 * @property {Array<Mesh>} objects
 * @property {Array<Material>} materials
 * @property {Array<BoundingBox>} dummies
 * @property {Array<Tape>} tapes
 * @property {Array<Frame>} frames
 */

/**
 * Tipos de materiales
 * @readonly
 * @enum {number}
 */
export const MaterialType = {
  /** Wireframe */
  WIRE: 0,
  /** Plano */
  FLAT: 1,
  /** Gouraud */
  GOURAUD: 2,
  /** Phong */
  PHONG: 3,
  /** Metal? */
  METAL: 4
}

/**
 * Lee la "firma" del archivo O3D
 * @param {Reader} reader
 * @returns {ArrayBufferView}
 */
export function readSignature(reader) {
  return reader.readContents('O3D\x00')
}

/**
 * Lee un vector de 2 coordenadas. Sólo se
 * usa para las coordenadas de las texturas.
 * @param {Reader} reader
 * @returns {Vector2}
 */
export function readVector2(reader) {
  const u = reader.readNumeric('f4le')
  const v = reader.readNumeric('f4le')
  return { u, v }
}

/**
 * Devuelve un vector de 3 coordenadas. Se usa
 * para las bounding boxes y las coordenadas de
 * los triángulos.
 * @param {Reader} reader
 * @returns {Vector3}
 */
export function readVector3(reader) {
  const x = reader.readNumeric('f4le')
  const y = reader.readNumeric('f4le')
  const z = reader.readNumeric('f4le')
  return { x, y, z }
}

/**
 * Devuelve un color. Esta función es distinta a la
 * de `pal` ya que esta devuelve los componentes como
 * floats.
 * @param {Reader} reader
 * @returns {Color}
 */
export function readColor(reader) {
  const r = reader.readNumeric('f4le')
  const g = reader.readNumeric('f4le')
  const b = reader.readNumeric('f4le')
  return { r, g, b }
}

/**
 * Devuelve una bounding box.
 * @param {Reader} reader
 * @returns {BoundingBox}
 */
export function readBoundingBox(reader) {
  const min = readVector3(reader)
  const max = readVector3(reader)
  return { min, max }
}

/**
 * Devuelve un vértice.
 * @param {Reader} reader
 * @returns {Vertex}
 */
export function readVertex(reader) {
  const position = readVector3(reader)
  const normal = readVector3(reader)
  const texture = readVector2(reader)
  return { position, normal, texture }
}

/**
 * Devuelve una cara de un objeto 3D.
 * @param {Reader} reader
 * @returns {Face}
 */
export function readFace(reader) {
  const a = reader.readNumeric('s2le')
  const b = reader.readNumeric('s2le')
  const c = reader.readNumeric('s2le')
  const material = reader.readNumeric('s2le')
  return { a, b, c, material }
}

/**
 * Devuelve un objeto 3D.
 * @param {Reader} reader
 * @returns {Mesh}
 */
export function readMesh(reader) {
  const numVertices = reader.readNumeric('s2le')
  const numFaces = reader.readNumeric('s2le')
  const material = reader.readNumeric('s2le')
  const name = reader.readFixedLengthString(20)
  const boundingBox = readBoundingBox(reader)
  const vertices = []
  for (let index = 0; index < numVertices; index++) {
    vertices.push(readVertex(reader))
  }
  const faces = []
  for (let index = 0; index < numFaces; index++) {
    faces.push(readFace(reader))
  }
  return {
    numVertices,
    numFaces,
    material,
    name,
    boundingBox,
    vertices,
    faces
  }
}

/**
 * Devuelve un material.
 * @param {Reader}
 * @returns {Material}
 */
export function readMaterial(reader) {
  const diffuse = readColor(reader)
  const ambient = readColor(reader)
  const specular = readColor(reader)
  const transparency = reader.readNumeric('s4le')
  const texture = reader.readFixedLengthString(16)
  const type = reader.readNumeric('s4le')
  return {
    diffuse,
    ambient,
    specular,
    transparency,
    texture,
    type
  }
}

/**
 * Devuelve la "cinta americana" del modelo. Estos
 * "tapes" sirven para unir los diferentes objetos
 * del modelo.
 * @param {Reader} reader
 * @returns {Tape}
 */
export function readTape(reader) {
  const startObject = reader.readNumeric('s4le')
  const startVertex = reader.readNumeric('s4le')
  const endObject = reader.readNumeric('s4le')
  const endVertex = reader.readNumeric('s4le')
  const linkMode = reader.readNumeric('s4le')
  return {
    startObject,
    startVertex,
    endObject,
    endVertex,
    linkMode
  }
}

/**
 * Devuelve una matriz de 4x4.
 * @param {Reader} reader
 * @returns {Matrix}
 */
export function readMatrix(reader) {
  const matrix = []
  for (let index = 0; index < 16; index++) {
    matrix.push(reader.readNumeric('f4le'))
  }
  return matrix
}

/**
 * Devuelve un fotograma.
 * @param {Reader} reader
 * @param {number} numObjects
 * @returns {Frame}
 */
export function readFrame(reader, numObjects) {
  const objects = []
  for (let objectIndex = 0; objectIndex < numObjects; objectIndex++) {
    const matrix = readMatrix(reader)
    objects.push({
      matrix
    })
  }
  return objects
}

/**
 * Devuelve un objeto 3D.
 * @param {Reader} reader
 * @returns {O3d}
 */
export function readFile(reader) {
  const signature = readSignature(reader)
  const version = reader.readNumeric('s2le')
  const num = {
    objects: reader.readNumeric('s2le'),
    materials: reader.readNumeric('s2le'),
    dummies: reader.readNumeric('s2le'),
    tapes: reader.readNumeric('s2le'),
    frames: reader.readNumeric('s2le')
  }
  const offset = {
    objects: reader.readNumeric('s4le'),
    materials: reader.readNumeric('s4le'),
    dummies: reader.readNumeric('s4le'),
    tapes: reader.readNumeric('s4le'),
    frames: reader.readNumeric('s4le')
  }
  const boundingBox = readBoundingBox(reader)
  reader.offset = offset.objects
  const objects = []
  for (let index = 0; index < num.objects; index++) {
    objects.push(readMesh(reader))
  }
  reader.offset = offset.materials
  const materials = []
  for (let index = 0; index < num.materials; index++) {
    materials.push(readMaterial(reader))
  }
  reader.offset = offset.dummies
  const dummies = []
  for (let index = 0; index < num.dummies; index++) {
    dummies.push(readBoundingBox(reader))
  }
  reader.offset = offset.tapes
  const tapes = []
  for (let index = 0; index < num.tapes; index++) {
    tapes.push(readTape(reader))
  }
  reader.offset = offset.frames
  const frames = []
  for (let index = 0; index < num.frames; index++) {
    frames.push(readFrame(reader, num.objects))
  }
  return {
    signature,
    version,
    num,
    offset,
    boundingBox,
    objects,
    materials,
    dummies,
    tapes,
    frames
  }
}

export default {
  readSignature,
  readColor,
  readVector2,
  readVector3,
  readMatrix,
  readMesh,
  readVertex,
  readFace,
  readMaterial,
  readTape,
  readFrame,
  readFile
}
