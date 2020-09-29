
/**
 * @module a3d
 */

/**
 * Matriz de 4x4
 * @typedef {Array<number>} Matrix
 */

/**
 * Transformación
 * @typedef {Object} Transform
 * @property {Matrix} matrix
 */

/**
 * Fotograma de una animación.
 * @typedef {Array<Transform>} Frame
 */

/**
 * Animación
 * @typedef {Object} Animation
 * @property {number} offset
 * @property {Array<Frame>} frames
 * @property {number} numFrames
 * @property {number} dummy
 */

/**
 * @typedef {Object} A3d
 * @property {Signature} signature
 * @property {number} version
 * @property {number} numObjects
 * @property {number} numAnimations
 * @property {number} dummy
 * @property {Array<Animation>} animations
 */

/**
 * Firma del archivo .a3d
 * @constant {string}
 */
export const SIGNATURE = 'A3D\x00'

/**
 * Leemos la firma de un archivo .a3d
 * @param {Reader} reader
 * @returns {Signature}
 */
export function readSignature(reader) {
  return reader.readContents(SIGNATURE)
}

/**
 * Leemos un fotograma.
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
 * Leemos una matriz de 4x4
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
 * Leemos un archivo A3D
 * @param {Reader} reader
 * @returns {A3d}
 */
export function readFile(reader) {
  const signature = readSignature(reader)
  const version = reader.readNumeric('s2le')
  const numObjects = reader.readNumeric('s2le')
  const numAnimations = reader.readNumeric('s2le')
  const dummy = reader.readNumeric('s2le')
  const animations = []
  for (let animationIndex = 0; animationIndex < numAnimations; animationIndex++) {
    const frames = []
    const offset = reader.readNumeric('s4le')
    const numFrames = reader.readNumeric('s2le')
    const dummy = reader.readNumeric('s2le')
    animations.push({
      offset,
      frames,
      numFrames,
      dummy
    })
  }
  for (const animation of animations) {
    const { offset, frames, numFrames } = animation
    reader.offset = offset
    for (let frameIndex = 0; frameIndex < numFrames; frameIndex++) {
      const objects = readFrame(reader, numObjects)
      frames.push({
        objects
      })
    }
  }
  return {
    signature,
    version,
    numObjects,
    numAnimations,
    dummy,
    animations
  }
}

export default {
  readSignature,
  readFrame,
  readMatrix,
  readFile
}
