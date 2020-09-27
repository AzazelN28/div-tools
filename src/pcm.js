export const SAMPLE_RATE = 11025 // 11025 samples per second
export const SAMPLE_SIZE = 1 // 1 byte per sample
export const NUMBER_OF_CHANNELS = 1

export function readFile(reader) {
  const buffer = reader.read(reader.byteLength)
  const sampleArray = new Uint8Array(buffer)
  const resampledArray = new Float32Array(sampleArray.length)
  const audioBuffer = new AudioBuffer({
    length: (buffer.byteLength / SAMPLE_RATE),
    sampleRate: SAMPLE_RATE,
    numberOfChannels: NUMBER_OF_CHANNELS
  })
  for (let index = 0; index < buffer.byteLength; index++) {
    resampledArray[index] = ((sampleArray[index] - 127) / 255)
  }
  audioBuffer.copyToChannel(resampledArray, 0, 0)
  return {
    length: (buffer.byteLength / SAMPLE_RATE),
    numberOfChannels: NUMBER_OF_CHANNELS,
    sampleRate: SAMPLE_RATE,
    sampleSize: SAMPLE_SIZE,
    audioBuffer,
    buffer
  }
}

export function writeFile(writer) {

}

export default {
  readFile,
  writeFile
}
