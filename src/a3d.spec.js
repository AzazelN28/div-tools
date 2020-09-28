import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import a3d from './a3d'

describe('A3D', () => {
  it('should read a A3D file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/MUJER/ANIM.A3D'
    )
    const reader = new Reader({
      dataView: new DataView(buffer, byteOffset, length),
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = a3d.readFile(reader)
    // console.log(data)
    expect(data).to.have.property('signature')
  })
})
