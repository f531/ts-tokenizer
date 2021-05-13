import {
    TokenType,
    Scan,
    ScanResult,
    ScanError,
    NumericBase,
    isDigit,
    isLetter,
    isUnderscore,
} from '../..'

const eq = (a: any, b: any) => a === b

export const scanForNumber: Scan = (scanner, trace?) => {
    trace?.log('beginning')
    scanner.begin()

    let termLetter = false
    let base = NumericBase.BASE10

    trace?.log('checking if scanner yields digit')
    if (!isDigit(scanner.source.current)) {
        trace?.log('scanner yielded non-digit -> try next')
        return ScanResult.TRY_NEXT
    }

    trace?.log('checking if first character is "0"')
    if (eq(scanner.source.current, '0')) {
        trace?.log('checking if the token is just "0"')
        if (!scanner.source.move()) {
            trace?.log('token is simply "0" -> matched')
            scanner.end(TokenType.NUMBER, { value: 0, base: NumericBase.BASE10 })
            return ScanResult.MATCHED
        }

        trace?.log('checking the next character, it might be "x", "o", "b", a digit or an underscore')
        if (eq(scanner.source.current, 'x')) {
            trace?.log('next character is "x" setting base to 16')
            base = NumericBase.BASE16
            termLetter = true
        }
        else if (eq(scanner.source.current, 'o')) {
            trace?.log('next character is "o" setting base to 8')
            base = NumericBase.BASE8
            termLetter = true
        }
        else if (eq(scanner.source.current, 'b')) {
            trace?.log('next character is "b" setting base to 2')
            base = NumericBase.BASE2
            termLetter = true
        }

        trace?.log('checking for eof')
        if (!scanner.source.move()) {
            trace?.log('reached eof, checking if the token terminates with a letter, which is illegal')
            if (termLetter) {
                trace?.log('token terminates with a letter -> error')
                scanner.end(TokenType.ERROR, { value: ScanError.NUMBER_TERMINATING_WITH_LETTER })
                return ScanResult.ERROR
            }
            else {
                trace?.log('token terminates legally -> matched')
                return ScanResult.MATCHED
            }
        }
    }

    trace?.log('setting up legal digits and other variables')
    const digits = '0123456789abcdef'.substring(0, base)
    let value = 0
    let termUnderscore = false

    trace?.log('iterating though remaining characters')
    while (true) {
        trace?.log('converting character to lower case')
        const c = scanner.source.current.toLowerCase()


        trace?.log('checking if the character is an underscore, one of the valid digits or any digit or letter')
        if (isUnderscore(c)) {
            trace?.log('character is an underscore, noted')
            termUnderscore = true
        }
        else if (scanner.source.eof || (!isDigit(c) && !isLetter(c))) {
            if (termUnderscore) {
                trace?.log('character is not a digit or underscore -> matched')
                scanner.end(TokenType.ERROR, { value: ScanError.NUMBER_TERMINATING_UNDERSCORE })
                return ScanResult.ERROR
            }
            else {
                trace?.log('character is not a digit or underscore -> matched')
                scanner.end(TokenType.NUMBER, { value, base })
                return ScanResult.MATCHED
            }
        }
        else {
            trace?.log('character is a digit or letter, determining its value')
            const d = digits.indexOf(c)

            if (d < 0) {
                trace?.log('character is not a valid digit')
                scanner.end(TokenType.ERROR, { value: ScanError.NUMBER_ILLEGAL_DIGIT })
                return ScanResult.ERROR
            }

            trace?.log('computing new value')
            value = value * base + d
            termUnderscore = false
        }

        trace?.log('moving')
        scanner.source.move()
    }
}
