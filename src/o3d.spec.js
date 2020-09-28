import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import o3d from './o3d'

describe('O3D', () => {
  it('should read a O3D file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/MUJER/ANIM.O3D'
    )
    const reader = new Reader({
      dataView: new DataView(buffer, byteOffset, length),
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = o3d.readFile(reader)
    // console.log(data)
    expect(data).to.have.property('signature')
  })
})
