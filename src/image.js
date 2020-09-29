/**
 * @module image
 */

/**
 * Devuelve el color más cercano al indicado dentro de la
 * paleta de colores que hemos pasado.
 * @param {Array<Color>} palette
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {number}
 */
export function findNearestColor(palette, r, g, b) {
  const [, index] = palette
    .map((color, index) => [color, index])
    .sort((ca, cb) => {
      // Obtenemos las distancias de los colores
      // y calculamos cuál está más cerca del color
      // que nos interesa.
      const cad = Math.hypot(ca.color.r - r, ca.color.g - g, ca.color.b - b)
      const cbd = Math.hypot(cb.color.r - r, cb.color.g - g, cb.color.b - b)
      return cad - cbd
    })
    .shift()
  return index
}

/**
 * Devuelve un Uint8Array con la imagen convertida de
 * RGBA a indexed.
 * @param {Array<Color>} palette
 * @param {ImageData} imageData
 * @returns {Uint8Array}
 */
export function toIndexed(palette, { data: rgba }) {
  const indexed = new Uint8Array()
  for (let offset = 0; offset < rgba.length; offset += 4) {
    const r = rgba[offset + 0]
    const g = rgba[offset + 1]
    const b = rgba[offset + 2]
    const index = findNearestColor(palette, r, g, b)
    indexed[offset >> 2] = index
  }
  return indexed
}

/**
 * Devuelve un ImageData con la imagen convertida de
 * indexed a RGBA
 * @param {Array<Color>} palette
 * @param {number} indexed
 * @param {number} width
 * @param {number} height
 * @returns {ImageData}
 */
export function fromIndexed(palette, indexed, width, height) {
  const imageData = new ImageData(width, height)
  for (let offset = 0; offset < width * height; offset++) {
    const color = indexed[offset]
    const { r, g, b } = palette[color]
    imageData.data.set(new Uint8ClampedArray([r * 4, g * 4, b * 4, 255]), offset * 4)
  }
  return imageData
}

export default {
  findNearestColor,
  toIndexed,
  fromIndexed
}
