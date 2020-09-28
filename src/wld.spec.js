import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import Writer from './io/Writer'
import wld from './wld'
import fixture from '../test/fixtures/wld.json'

describe('WLD', () => {
  it('should read a WLD file', async () => {
    const { buffer, byteOffset, length } = await fs.promises.readFile(
      'samples/WLD_VIEW.WLD'
    )
    const reader = new Reader({
      dataView: new DataView(buffer, byteOffset, length),
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    const data = wld.readFile(reader)
    expect(data).to.have.deep.property('signature', [
      'w',
      'l',
      'd',
      '\u001a',
      '\r',
      '\n',
      '\u0001',
      '\u0000'
    ])
  })

  it('should create a size estimator for a WLD file', async () => {
    const estimator = Writer.createEstimator({
      endian: Endian.LITTLE,
      encoding: 'Windows-1252'
    })
    wld.writeWld(estimator, fixture)
    fixture.offset = estimator.byteLength + 12
    estimator.offset = 0
    wld.writeFile(estimator, fixture)
    console.log(estimator.byteLength)
  })
})
