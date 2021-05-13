import {
    TokenType,
    Scan,
    Ref,
    ScanResult,
    ScanError,
    scanForStringEscape,
    isNewline,
} from '../..'

const eq = (a: any, b: any) => a === b

export const scanForStringSingleline: Scan = (scanner, trace?) => {
    trace?.log('beginning')
    scanner.begin()

    trace?.log('checking if scanner yields a single quiote')
    if (!eq(scanner.source.current, '\'')) {
        trace?.log('scanner did not yield single quote -> try next')
        return ScanResult.TRY_NEXT
    }

    const value = new Ref('')

    trace?.log('iterating trough any symbols')
    while (scanner.source.move()) {
        trace?.log('iterating... check if start of escape')
        if (eq(scanner.source.current, '\\')) {
            trace?.log('delegateing to escape scanner')
            if (!scanner.source.move()) {
                trace?.log('eof')
                scanner.end(TokenType.ERROR, { value: ScanError.STRING_ILLEGAL_ESCAPE })
                return ScanResult.MATCHED
            }
            const result = scanForStringEscape(value)(scanner, trace)
            if (result !== ScanResult.TRY_NEXT) {
                trace?.log('escape scanner terminated')
                return result
            }
        }
        else if (eq(scanner.source.current, '\'')) {
            trace?.log('found end of string')
            scanner.source.move()
            scanner.end(TokenType.STRING, { value: value.referent, double: false, multiline: false })
            return ScanResult.MATCHED
        }
        else if (isNewline(scanner.source.current)) {
            trace?.log('string did not end before newline')
            scanner.end(TokenType.ERROR, { value: ScanError.STRING_INCOMPLETE })
            return ScanResult.ERROR
        }
        value.referent += scanner.source.current
    }
    trace?.log('eof -> error')
    scanner.end(TokenType.ERROR, { value: ScanError.STRING_INCOMPLETE })
    return ScanResult.ERROR
}
