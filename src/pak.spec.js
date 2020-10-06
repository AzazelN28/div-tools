import zlib from 'zlib'
import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import pak from './pak'

describe('PAK', () => {
  it('should read a PAK file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/WLD_VIEW.PAK'
    )
    const reader = new Reader({
      dataView: new DataView(buffer, byteOffset, length),
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = pak.readFile(reader)
    const [fileEntry] = data.files
    const uncompressedData = zlib.inflateSync(
      buffer.slice(fileEntry.offset, fileEntry.offset + fileEntry.compressedSize)
    )
    expect(uncompressedData.byteLength).to.be.equal(fileEntry.uncompressedSize)
    expect(data).to.have.deep.property('signature', [
      'd',
      'a',
      't',
      '\u001a',
      '\r',
      '\n',
      '\u0000',
      '\u0000'
    ])
  })
})
