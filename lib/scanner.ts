import { ensure } from '@f531/utils'
import {
    Source,
    SourceSpan,
    Sink,
    Token,
    TokenType,
} from '.'

export class Scanner {

    private _token?: SourceSpan

    constructor(
        public readonly source: Source,
        public readonly sink: Sink
    ) {
        ensure({ source })
        ensure({ sink })
    }

    begin(): void {
        this._token = this.source.position
    }

    end<T extends Object>(type: TokenType<T>, data?: T): void {
        const token = this._token
        if (!token) { throw new Error('call begin() before calling end()') }
        const span = token.limit(this.source.position.offset - token.offset)
        this.sink({ type, span, ...data })
    }

}

