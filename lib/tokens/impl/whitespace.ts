import {
    TokenType,
    Scan,
    ScanResult,
    isWhitespace,
} from '../..'

export const scanForWhitespace: Scan = (scanner, trace?) => {
    trace?.log('beginning')
    scanner.begin()

    trace?.log('checking if scanner yields any whitespace')
    if (!isWhitespace(scanner.source.current)) {
        trace?.log('scanner yielded non-whitespace -> try next')
        return ScanResult.TRY_NEXT
    }

    trace?.log('iterating trough any whitespaces')
    while (scanner.source.move() && isWhitespace(scanner.source.current)) {
        trace?.log('iterating...')
    }

    trace?.log('ending token -> matched')
    scanner.end(TokenType.WHITESPACE)
    return ScanResult.MATCHED
}
