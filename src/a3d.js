export function readSignature(reader) {
  return reader.readContents('A3D\x00')
}

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

export function readMatrix(reader) {
  const matrix = []
  for (let index = 0; index < 16; index++) {
    matrix.push(reader.readNumeric('f4le'))
  }
  return matrix
}

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
