import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import pal from './pal'

describe('PAL', () => {
  it('should read a PAL file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/DIV2.PAL'
    )
    const reader = new Reader({
      arrayBuffer: buffer,
      byteOffset,
      byteLength: length,
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = pal.readFile(reader)
    expect(data).to.have.property('signature')
  })
})
