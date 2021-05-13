export enum ScanError {
    NUMBER_TERMINATING_UNDERSCORE   /**/ = 'number cannot be terminated by an underscore',
    NUMBER_ILLEGAL_DIGIT            /**/ = 'number contains an illegal digit or letter',
    NUMBER_TERMINATING_WITH_LETTER  /**/ = 'number cannot be terminated by base letter',
    STRING_INCOMPLETE               /**/ = 'string is incomplete',
    STRING_ILLEGAL_ESCAPE           /**/ = 'string contains illegal escape',
}

