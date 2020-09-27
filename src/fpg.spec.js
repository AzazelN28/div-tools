import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import fpg from './fpg'

describe('FPG', () => {
  it('should read a FPG file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/WLD_VIEW.FPG'
    )
    const reader = new Reader({
      arrayBuffer: buffer,
      byteOffset,
      byteLength: length,
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = fpg.readFile(reader)
    expect(data).to.have.deep.property('signature', [
      'f',
      'p',
      'g',
      '\u001a',
      '\r',
      '\n',
      '\u0000',
      '\u0000'
    ])
  })
})
