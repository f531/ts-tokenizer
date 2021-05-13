import {
    TokenType,
    Scan,
    ScanResult,
    ScanError,
    Ref,
} from '../..'

const eq = (a: any, b: any) => a === b

export const scanForStringEscape: (ref: Ref<string>) => Scan = ref => (scanner, trace?) => {
    if (eq(scanner.source.current, 'n')) {
        ref.referent += '\n'
        scanner.source.move()
    }
    else if (eq(scanner.source.current, 'r')) {
        ref.referent += '\r'
        scanner.source.move()
    }
    else if (eq(scanner.source.current, 't')) {
        ref.referent += '\t'
        scanner.source.move()
    }
    else if (eq(scanner.source.current, 'f')) {
        ref.referent += '\f'
        scanner.source.move()
    }
    else if (eq(scanner.source.current, '\'')) {
        ref.referent += '\''
        scanner.source.move()
    }
    else if (eq(scanner.source.current, '\"')) {
        ref.referent += '\"'
        scanner.source.move()
    }
    else if (eq(scanner.source.current, '\\')) {
        ref.referent += '\\'
        scanner.source.move()
    }
    else if (eq(scanner.source.current, 'u')) {
        const digits = '0123456789abcdef'
        let char = 0
        let value: number
        for (let i = 0; i < 4; i++) {
            trace?.log('fetching first character from unicode escape')
            if (!scanner.source.move()) {
                trace?.log('eof -> error')
                scanner.end(TokenType.ERROR, { value: ScanError.STRING_INCOMPLETE })
                return ScanResult.MATCHED
            }
            trace?.log('determining value')
            value = digits.indexOf(scanner.source.current.toLowerCase())
            if (!value) {
                trace?.log('illegal character -> error')
                scanner.end(TokenType.ERROR, { value: ScanError.STRING_ILLEGAL_ESCAPE })
                return ScanResult.MATCHED
            }
            char = (char << 4) | value
        }
        ref.referent += String.fromCharCode(char)
    }
    else {
        trace?.log('unrecognized escape -> error')
        scanner.end(TokenType.ERROR, { value: ScanError.STRING_ILLEGAL_ESCAPE })
        return ScanResult.ERROR
    }
    return ScanResult.TRY_NEXT
}
