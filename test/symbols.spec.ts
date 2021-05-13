import { describe, it } from 'mocha'
import { expect } from 'chai'
import { isWhitespace, isLetter, isDigit, isSymbol } from '../lib'

describe('symbols', () => {
    describe('isWhitespace', () => {
        it('should match whitespace', () => {
            expect(isWhitespace(' ')).to.be.true
        })
        it('should match tabulator', () => {
            expect(isWhitespace('\t')).to.be.true
        })
        it('should NOT match newline', () => {
            expect(isWhitespace('\n')).to.be.false
        })
        it('should NOT match some letter', () => {
            expect(isWhitespace('A')).to.be.false
        })
    })
    describe('isLetter', () => {
        it('should match some upercase ascii letter', () => {
            expect(isLetter('A')).to.be.true
        })
        it('should match some lowercase ascii letter', () => {
            expect(isLetter('z')).to.be.true
        })
        it('should match some uppercase unicode letter', () => {
            expect(isLetter('\u01c7')).to.be.true
        })
        it('should match some lowercase unicode letter', () => {
            expect(isLetter('\u01C9')).to.be.true
        })
        it('should match some titlecase unicode letter', () => {
            expect(isLetter('\u01C8')).to.be.true
        })
        it('should NOT match a digit', () => {
            expect(isLetter('7')).to.be.false
        })
        it('should NOT match a whitespace', () => {
            expect(isLetter('\t')).to.be.false
        })
        it('should NOT match a symbol', () => {
            expect(isLetter('/')).to.be.false
        })
    })
    describe('isNumber', () => {
        it('should match a digit', () => {
            expect(isDigit('7')).to.be.true
        })
        it('should NOT match a letter', () => {
            expect(isDigit('x')).to.be.false
        })
        it('should NOT match a whitespace', () => {
            expect(isDigit('\t')).to.be.false
        })
        it('should NOT match a symbol', () => {
            expect(isDigit('/')).to.be.false
        })
    })
})
