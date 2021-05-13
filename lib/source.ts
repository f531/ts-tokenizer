import { ensure } from '@f531/utils/lib'
import { SourceSpan } from '.'

export class Source {
    private _position: SourceSpan
    private _current: string
    private _next: string

    constructor(
        public readonly string: string,
        public readonly offset: number = 0
    ) {
        ensure({ offset }, it => it >= 0)
        ensure({ string }, it => offset < it.length)
        this._position = new SourceSpan(string.substring(offset), offset, string.length - offset)
        this._current = ''
        this._next = ''
        this._makeScanned()
    }

    private _makeScanned() {
        this._current = String.fromCodePoint(this.string.codePointAt(this._position.offset) ?? 0)
        this._next = String.fromCodePoint(this.string.codePointAt(this.position.offset + this._current.length) ?? 0)
    }

    move(): boolean {
        const newOffset = this._position.offset + this._current.length
        const newLength = this.string.length - newOffset
        if (newLength <= 0) {
            this._position = new SourceSpan('', newOffset, 0)
            this._current = ''
            return false
        }
        const newString = this.string.substring(newOffset)
        this._position = new SourceSpan(newString, newOffset, newLength)
        this._makeScanned()
        return true
    }

    get eof() {
        const newOffset = this._position.offset + this._current.length
        const newLength = this.string.length - newOffset
        return newLength < 0
    }

    get position() { return this._position }

    get current() { return this._current }

}
