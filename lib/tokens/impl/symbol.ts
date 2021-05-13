import {
    TokenType,
    Scan,
    ScanResult,
    isSymbol,
} from '../..'

export const scanForSymbol: Scan = (scanner, trace?) => {
    trace?.log('beginning')
    scanner.begin()

    trace?.log('checking if scanner yields any symbol')
    if (!isSymbol(scanner.source.current)) {
        trace?.log('scanner yielded non-symbol -> try next')
        return ScanResult.TRY_NEXT
    }
    
    trace?.log('iterating trough any symbols')
    while (scanner.source.move() && isSymbol(scanner.source.current)) {
        trace?.log('iterating...')
    }

    trace?.log('ending token -> matched')
    scanner.end(TokenType.SYMBOL)
    return ScanResult.MATCHED
}
