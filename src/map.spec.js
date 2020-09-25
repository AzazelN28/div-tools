import fs from 'fs'
import Reader from './Reader'
import map from './map'

describe('MAP', () => {
  it('should read a MAP file', async () => {
    const { buffer } = await fs.promises.readFile('samples/NOID.MAP')
    const reader = new Reader(buffer)
    console.log(map.readFile(reader))
  })
})
