import fs from 'fs'
import Reader from './Reader'
import pal from './pal'

describe('PAL', () => {
  it('should read a PAL file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile('samples/DIV2.PAL')
    const reader = new Reader(buffer, byteOffset, length)
    const data = pal.readFile(reader)
    expect(data).to.have.property('signature')
  })
})
