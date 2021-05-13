import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Source } from '../lib'

describe('source', () => {
    it('should yield the right substrings', () => {
        const source = new Source('Hello')
        expect(source.position.offset).to.equal(0)
        expect(source.position.length).to.equal(5)
        expect(source.current).to.equal('H')
        expect(source.current).to.equal('H')
        expect(source.move()).to.be.true
        expect(source.position.offset).to.equal(1)
        expect(source.position.length).to.equal(4)
        expect(source.current).to.equal('e')
        expect(source.move()).to.be.true
        expect(source.position.offset).to.equal(2)
        expect(source.position.length).to.equal(3)
        expect(source.current).to.equal('l')
        expect(source.move()).to.be.true
        expect(source.position.offset).to.equal(3)
        expect(source.position.length).to.equal(2)
        expect(source.current).to.equal('l')
        expect(source.move()).to.be.true
        expect(source.position.offset).to.equal(4)
        expect(source.position.length).to.equal(1)
        expect(source.current).to.equal('o')
        expect(source.move()).to.be.false
        expect(source.position.offset).to.equal(5)
        expect(source.position.length).to.equal(0)
    })
})
