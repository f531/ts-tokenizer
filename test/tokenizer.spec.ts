import { describe, it } from 'mocha'
import { expect } from 'chai'
import { Token, TokenType } from '../lib/index'

function test(source: string, tokens: any[]) {
    // TODO
}

function token(type: TokenType<any>, value?: any) {
    return { type, value }
}

const newline = token(TokenType.NEWLINE)
const indent = token(TokenType.INDENT)
const outdent = token(TokenType.OUTDENT)
const sp = token(TokenType.WHITESPACE)
const word = (value: string) => token(TokenType.WORD, value)
const symbol = (value: string) => token(TokenType.SYMBOL, value)
const number = (value: number) => token(TokenType.NUMBER, value)
const string = (value: string) => token(TokenType.STRING, value)
const ipol_a = (value: string) => token(TokenType.INTERPOL_START, value)
const ipol_b = (value: string) => token(TokenType.INTERPOL_MID, value)
const ipol_c = (value: string) => token(TokenType.INTERPOL_END, value)

describe('tokenizer', () => {
    it('should tokenize a couple of words', () => {
        test('hello world', [word('hello'), sp, word('world')])
    })
    it('should tokenize a word with an operator and a number', () => {
        test('x + 1', [word('x'), sp, symbol('+'), sp, number(1)])
    })
    it('should tokenize a #letlang constant declaration', () => {
        test('let lang = awesome()', [word('let'), sp, word('lang'), sp, symbol('='), sp, word('awesome'), symbol('()')])
    })
    it('should tokenize a #letlang type declaration', () => {
        test(
            'type Person = record {\n' +
            '    let Firstname :String\n' +
            '    let Lastname  :String\n' +
            '    let Birthdate :Date?\n' +
            '}',
            [
                word('type'), sp, word('Person'), sp, symbol('='), sp, word('record'), sp, symbol('{'), newline, indent,
                word('let'), sp, word('Firstname'), sp, symbol(':'), word('String'), newline,
                word('let'), sp, word('Lastname'), sp, symbol(':'), word('String'), newline,
                word('let'), sp, word('Birthdate'), sp, symbol(':'), word('Date'), symbol('?'), newline,
                outdent, symbol('}')
            ]
        )
    })
    it('should tokenize some #letlang program', () => {
        test(
            'fun App::Main(): Unit {\n' +
            '    WriteLine("Hello World")\n' +
            '}',
            [
                word('fun'), sp, word('App'), symbol('::'), word('Main'), symbol('():'), sp, word('Unit'), sp, symbol('{'), newline, indent,
                word('WriteLine'), symbol('('), string('Hello World'), symbol(')'), newline,
                outdent, symbol('}')
            ]
        )
    })
    it('should tokenize some #letlang string interpolation', () => {
        test(
            'WriteLine("Point(X = {this.X}, Y = {this.y}))',
            [word('WriteLine'), symbol('('), ipol_a('Point(X = '), word('this'), symbol('.'), word('x'), ipol_b(', Z = '), word('this'), symbol('.'), word('y'), ipol_c(')'), symbol(')')]
        )
    })
})



