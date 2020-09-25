import fs from 'fs'
import Reader from './Reader'
import fpg from './fpg'

describe('FPG', () => {
  it('should read a FPG file', async () => {
    const { buffer } = await fs.promises.readFile('samples/WLD_VIEW.FPG')
    const reader = new Reader(buffer)
    console.log(fpg.readFile(reader))
  })
})