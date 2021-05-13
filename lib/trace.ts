import { Scan } from '.'

export interface ScanTracer {
    log(message: string): void
}

export interface TokenizeTracer {
    for(scan: Scan): ScanTracer | undefined
}
