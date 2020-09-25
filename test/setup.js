import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)

global.chai = chai
global.expect = chai.expect
global.should = chai.should
