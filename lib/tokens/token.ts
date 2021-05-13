import {
    TokenType,
    SourceSpan,
} from '..'

export interface Token {
    type: TokenType<any>,
    span: SourceSpan
    value?: any
}

