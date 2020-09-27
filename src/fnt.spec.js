import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import fnt from './fnt'

describe('FNT', () => {
  it('should read a FNT file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/NOID.FNT'
    )
    const reader = new Reader({
      arrayBuffer: buffer,
      byteOffset,
      byteLength: length,
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = fnt.readFile(reader)
    expect(data).to.have.deep.property('signature', [
      'f',
      'n',
      't',
      '\u001a',
      '\r',
      '\n',
      '\u0000',
      '\u0000'
    ])
  })
})
