import {
    Token,
    Scanner,
    ScanResult,
    ScanTracer,
} from '.'

export type Sink = (token: Token) => void

export type Scan = (scanner: Scanner, trace?: ScanTracer) => ScanResult
