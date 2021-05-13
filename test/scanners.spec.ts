import { describe, it } from 'mocha'
import { expect } from 'chai'
import {
    Scanner,
    Sink,
    Scan,
    ScanResult,
    ScanError,
    Source,
    Token,
    TokenType,
    ScanTracer,
    scanForWhitespace,
    scanForWord,
    scanForSymbol,
    scanForNumber,
    scanForStringSingleline,
} from '../lib'


/**
 * SET THIS TO TRUE TO ENABLE
 * VERBOSE OUTPUT OF SCANS
 */
const USE_TRACE = true


function scanFor(
    scan: Scan,
    source: Source
) {
    const tokens: Token[] = []
    const sink: Sink = token => tokens.push(token)
    const trace: ScanTracer | undefined = USE_TRACE ? {
        log(message) {
            console.info('        [' + scan.name + ' @ ' + source.position.offset + '] ' + message)
        }
    } : undefined
    const scanner = new Scanner(source, sink)
    const result = scan(scanner, trace)
    expect(result).to.not.equal(ScanResult.TRY_NEXT)
    const [token] = tokens
    expect(tokens).to.not.be.undefined
    return token
}

function scanForSingle(
    scan: Scan,
    text: string,
    string: string,
    left: string,
    type: TokenType<any>,
    value?: any
) {
    const source = new Source(text)
    const token = scanFor(scan, source)
    if (value) {
        expect(token.value).to.equal(value)
    }
    expect(token.type).to.equal(type)
    expect(token.span.string).to.equal(string)
    expect(token.span.offset).to.equal(0)
    expect(token.span.length).to.equal(string.length)
    if (left.length === 0) {
        expect(!source.move()).to.be.true
    }
    else {
        const lSource = new Source(left)
        while (true) {
            const next = source.move()
            expect(next).to.equal(lSource.move())
            if (!next) { break }
            expect(source.current).to.equal(lSource.current)
        }
    }
}

describe('scanners', () => {
    describe('scanner', () => {
        it('should yield the right token', () => {
            const source = new Source("Hello World")
            const scan = (scanner: Scanner) => {
                scanner.begin()
                expect(scanner.source.move()).to.be.true
                expect(scanner.source.move()).to.be.true
                scanner.end(TokenType.WORD)
                return ScanResult.MATCHED
            }
            const token1 = scanFor(scan, source)
            expect(token1).to.not.be.undefined
            expect(token1.type).to.be.equal(TokenType.WORD)
            expect(token1.span.offset).to.equal(0)
            expect(token1.span.length).to.equal(2)
            expect(token1.span.string).to.equal('He')
            const token2 = scanFor(scan, source)
            expect(token2).to.not.be.undefined
            expect(token2.type).to.be.equal(TokenType.WORD)
            expect(token2.span.offset).to.equal(2)
            expect(token2.span.length).to.equal(2)
            expect(token2.span.string).to.equal('ll')
        })
    })
    describe('scanForWhitespace', () => {
        it('should match a single whitespace token', () => {
            scanForSingle(
                scanForWhitespace,
                '    ',
                '    ',
                '',
                TokenType.WHITESPACE
            )
        })
        it('should match a single whitespace and should leave the rest', () => {
            scanForSingle(
                scanForWhitespace,
                '    hello world',
                '    ',
                'hello world',
                TokenType.WHITESPACE
            )
        })
    })
    describe('scanForWord', () => {
        it('should match a single word token', () => {
            scanForSingle(
                scanForWord,
                'hello',
                'hello',
                '',
                TokenType.WORD
            )
        })
        it('should match a single word token and leave the rest', () => {
            scanForSingle(
                scanForWord,
                'hello world :D',
                'hello',
                ' world :D',
                TokenType.WORD
            )
        })
    })
    describe('scanForSymbol', () => {
        it('should match a single symbol token', () => {
            scanForSingle(
                scanForSymbol,
                '^=~',
                '^=~',
                '',
                TokenType.SYMBOL
            )
        })
        it('should match a single symbol token and leave the rest', () => {
            scanForSingle(
                scanForSymbol,
                '(-- hello world --)',
                '(--',
                ' hello world --)',
                TokenType.SYMBOL
            )
        })
    })
    describe('scanForNumber', () => {
        it('should match a single decimal number token', () => {
            scanForSingle(
                scanForNumber,
                '123',
                '123',
                '',
                TokenType.NUMBER,
                123
            )
        })
        it('should match a single hexadecimal number token', () => {
            scanForSingle(
                scanForNumber,
                '0xf531',
                '0xf531',
                '',
                TokenType.NUMBER,
                0xf531
            )
        })
        it('should match a single octadic number token and leave the rest', () => {
            scanForSingle(
                scanForNumber,
                '0o1275 + 5 ** 2',
                '0o1275',
                ' + 5 ** 2',
                TokenType.NUMBER,
                0o1275
            )
        })
        it('should match a single hexadecimal number with underscore speraration', () => {
            scanForSingle(
                scanForNumber,
                '0x1234_5678',
                '0x1234_5678',
                '',
                TokenType.NUMBER,
                0x1234_5678
            )
        })
        it('should NOT match a number just constiting of "0x"', () => {
            scanForSingle(
                scanForNumber,
                '0x',
                '0x',
                '',
                TokenType.ERROR,
                ScanError.NUMBER_TERMINATING_WITH_LETTER
            )
        })
        it('should NOT match a number terminating with an underscore', () => {
            scanForSingle(
                scanForNumber,
                '123_',
                '123_',
                '',
                TokenType.ERROR,
                ScanError.NUMBER_TERMINATING_UNDERSCORE
            )
        })
    })
    describe('scanForStringSingleline', () => {
        it('should match a single string token', () => {
            scanForSingle(
                scanForStringSingleline,
                '\'Hello World :D\'',
                '\'Hello World :D\'',
                '',
                TokenType.STRING,
                'Hello World :D'
            )
        })
        it('should match a single string token and leave the rest', () => {
            scanForSingle(
                scanForStringSingleline,
                '\'Hello \' + yourName',
                '\'Hello \'',
                ' + yourName',
                TokenType.STRING,
                'Hello '
            )
        })
        it('should match a single string with escape token and leave the rest', () => {
            scanForSingle(
                scanForStringSingleline,
                '\'Hello\\n\' + yourName',
                '\'Hello\\n\'',
                ' + yourName',
                TokenType.STRING,
                'Hello\n'
            )
        })
        it('should match a single string with unicode escape token and leave the rest', () => {
            scanForSingle(
                scanForStringSingleline,
                '\'Hello\\u0020\' + yourName',
                '\'Hello\\u0020\'',
                ' + yourName',
                TokenType.STRING,
                'Hello\u0020'
            )
        })
    })
})
