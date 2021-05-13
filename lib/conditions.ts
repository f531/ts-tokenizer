export function isWhitespace(codepoint: string): boolean {
    return !!codepoint.match(/[^\S\r\n]/u)
}

export function isLetter(codepoint: string): boolean {
    return !!codepoint.match(/\p{L}/u)
}

export function isDigit(codepoint: string): boolean {
    return !!codepoint.match(/[0-9]/u)
}

export function isSymbol(codepoint: string): boolean {
    return '()[]{}<>?!~^&|%+-*/\\@#='.includes(codepoint)
}

export function isUnderscore(codepoint: string): boolean {
    return codepoint === '_'
}

export function isHexDigit(codepoint: string): boolean {
    return !!codepoint.match(/[a-fA-F]/u)
}

export function isNewline(codepoint: string): boolean {
    return '\n\r'.includes(codepoint)
}

export function isSurrogate(codepoint: string): boolean {
    return !!codepoint.match(/[\uD800-\uDFFF]/u)
}
