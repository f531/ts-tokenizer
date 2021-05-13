import {
    Token,
    NumericBase
} from '..'

export class TokenType<Additional extends Object = {}> {

    static readonly ERROR = new TokenType<{ value: string }>('error')
    static readonly NEWLINE = new TokenType('linefeed')
    static readonly INDENT = new TokenType('indent')
    static readonly OUTDENT = new TokenType('outdent')
    static readonly WHITESPACE = new TokenType('whitespce')
    static readonly WORD = new TokenType('word')
    static readonly SYMBOL = new TokenType('symbol')
    static readonly NUMBER = new TokenType<{ value: number, base: NumericBase }>('number')
    static readonly STRING = new TokenType<{ value: string, multiline: boolean, double: boolean }>('string')
    static readonly INTERPOL_START = new TokenType<{ value: string, multiline: boolean }>('interpol_start')
    static readonly INTERPOL_MID = new TokenType<{ value: string, multiline: boolean }>('interpol_mid')
    static readonly INTERPOL_END = new TokenType<{ value: string, multiline: boolean }>('interpol_end')

    private constructor(
        public readonly name: string
    ) { }


}
