import {
    TokenType,
    Scan,
    ScanResult,
    isLetter,
    isDigit,
    isUnderscore,
} from '../..'


export const scanForWord: Scan = (scanner, trace?) => {
    trace?.log('beginning')
    scanner.begin()

    trace?.log('checking if scanner yields underscore or letter')
    if (!isUnderscore(scanner.source.current) && !isLetter(scanner.source.current)) {
        trace?.log('scanner yielded neither underscore nor letter -> try next')
        return ScanResult.TRY_NEXT
    }

    trace?.log('iterating trough letters, digits and underscores')
    while (scanner.source.move() && (isLetter(scanner.source.current) || isDigit(scanner.source.current) || isUnderscore(scanner.source.current))) {
        trace?.log('iterating...')
    }

    trace?.log('ending token -> matched')
    scanner.end(TokenType.WORD)
    return ScanResult.MATCHED
}
