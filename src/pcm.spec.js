import { expect } from 'chai'
import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import pcm from './pcm'

describe('PCM', () => {
  it('should read a PCM file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/METAL10.PCM'
    )
    const reader = new Reader({
      dataView: new DataView(buffer, byteOffset, length),
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = pcm.readFile(reader)
    expect(data).to.have.property('length')
    expect(data).to.have.property('numberOfChannels', 1)
    expect(data).to.have.property('sampleRate', 11025)
    expect(data).to.have.property('sampleSize', 1)
    expect(data).to.have.property('audioBuffer', undefined)
    expect(data).to.have.property('buffer')
  })
})
