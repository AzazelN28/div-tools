import fs from 'fs'
import Reader from './Reader'
import wld from './wld'

describe('WLD', () => {
  it('should read a WLD file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile('samples/WLD_VIEW.WLD')
    const reader = new Reader(buffer, byteOffset, length)
    const data = wld.readFile(reader)
    expect(data).to.have.deep.property('signature', ['w', 'l', 'd', '\u001a','\r','\n','\u0001','\u0000'])
  })
})
