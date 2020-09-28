import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import map from './map'

describe('MAP', () => {
  it('should read a MAP file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/NOID.MAP'
    )
    const reader = new Reader({
      dataView: new DataView(buffer, byteOffset, length),
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = map.readFile(reader)
    expect(data).to.have.deep.property('signature', [
      'm',
      'a',
      'p',
      '\u001a',
      '\r',
      '\n',
      '\u0000',
      '\u0000'
    ])
  })
})
