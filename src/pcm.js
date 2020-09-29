/**
 * @module pcm
 */

/** Número de velocidad de muestreo de un PCM */
export const SAMPLE_RATE = 11025 // 11025 samples per second
/** Número de bytes por muestra de un PCM */
export const SAMPLE_SIZE = 1 // 1 byte per sample
/** Número de canales de un PCM */
export const NUMBER_OF_CHANNELS = 1

/**
 * Devuelve un archivo de audio PCM.
 * @param {Reader} reader
 * @returns {PCM}
 */
export function readFile(reader) {
  const buffer = reader.read(reader.byteLength)
  const sampleArray = new Uint8Array(buffer)
  const resampledArray = new Float32Array(sampleArray.length)
  for (let index = 0; index < buffer.byteLength; index++) {
    resampledArray[index] = (sampleArray[index] - 127) / 255
  }
  let audioBuffer
  if (typeof AudioBuffer !== 'undefined') {
    audioBuffer = new AudioBuffer({
      length: (buffer.byteLength / SAMPLE_RATE),
      sampleRate: SAMPLE_RATE,
      numberOfChannels: NUMBER_OF_CHANNELS
    })
    audioBuffer.copyToChannel(resampledArray, 0, 0)
  }
  return {
    length: (buffer.byteLength / SAMPLE_RATE),
    numberOfChannels: NUMBER_OF_CHANNELS,
    sampleRate: SAMPLE_RATE,
    sampleSize: SAMPLE_SIZE,
    audioBuffer,
    buffer
  }
}

/**
 * Escribe un archivo PCM.
 * @param {Writer} writer
 * @param {AudioBuffer} audioBuffer
 * @returns {Writer}
 */
export function writeFile(writer, audioBuffer) {
  // Cuando el audioBuffer pasado tenga un
  // sampleRate diferente de 11025 habría que resamplear
  // el audio.
  const sampleRateStep = audioBuffer.sampleRate / 11025
  // Cuando el audioBuffer tenga más de un canal
  // de audio deberíamos realizar la mezcla de los dos
  // canales.
  const channels = []
  for (let index = 0; index < audioBuffer.numberOfChannels; index++) {
    const channelData = audioBuffer.getChannelData(index)
    channels.push(channelData)
  }

  const resampledArray = new Uint8Array(audioBuffer.length / sampleRateStep)
  for (let index = 0; index < audioBuffer.length; index += sampleRateStep) {
    const arrayIndex = Math.floor(index)
    for (const channelData of channels) {
      resampledArray[arrayIndex] += (1.0 + (channelData[arrayIndex] / channels.length)) * 0.5 * 255
    }
  }

  return writer.write(resampledArray)
}

export default {
  readFile,
  writeFile
}
