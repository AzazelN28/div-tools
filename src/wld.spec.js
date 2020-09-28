import fs from 'fs'
import Endian from './io/Endian'
import Reader from './io/Reader'
import Writer from './io/Writer'
import wld from './wld'
import fixture from '../test/fixtures/wld.json'
import { expect } from 'chai'

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
    const level = wld.readFile(reader)
    expect(level).to.have.deep.property('signature', [
      'w',
      'l',
      'd',
      '\u001a',
      '\r',
      '\n',
      '\u0001',
      '\u0000'
    ])

    expect(level.geom.vertices.length).to.be.equal(level.vpe.vertices.length)
    expect(level.geom.regions.length).to.be.equal(level.vpe.regions.length)
    expect(level.geom.walls.length).to.be.equal(level.vpe.walls.length)
    expect(level.geom.flags.length).to.be.equal(level.vpe.flags.length)

    for (const vertex of level.vpe.vertices) {
      expect(vertex.type).to.be.equal(0)
      expect(vertex.path).to.be.equal(-1)
      expect(vertex.link).to.be.equal(-1)
      // TODO: tengo que testear las coordenadas estas.
      // expect(vertex.x).to.be.equal()
      // zp[i].x=my_map->points[i]->x;  // Point x coordinate
      // zp[i].y=FIN_GRID-my_map->points[i]->y;  // Point y coordinate OJO
    }

    for (const region of level.vpe.regions) {
      expect(region.regionAbove).to.be.equal(-1)
      expect(region.regionBelow).to.be.equal(-1)
      expect(region.effect).to.be.equal('NO_NAME')
      expect(region.tag).to.be.equal(0)
    }

    for (const wall of level.vpe.walls) {
      expect(wall.effect).to.be.equal('NO_NAME')
      expect(wall.mass).to.be.equal(0)
      expect(wall.tag).to.be.equal(0)
    }
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
