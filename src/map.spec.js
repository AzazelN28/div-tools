import fs from 'fs'
import Reader from './Reader'
import map from './map'

describe('MAP', () => {
  it('should read a MAP file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile('samples/NOID.MAP')
    const reader = new Reader(buffer, byteOffset, length)
    const data = map.readFile(reader)
    expect(data).to.have.deep.property('signature', ['m','a','p','\u001a','\r','\n','\u0000','\u0000'])
  })
})
