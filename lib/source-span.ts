import { ensure } from '@f531/utils/lib';

export class SourceSpan {
    constructor(
        public readonly string: string,
        public readonly offset: number,
        public readonly length: number
    ) {
        ensure({ offset }, it => it >= 0);
        ensure({ length }, it => it >= 0);
    }

    limit(amount: number) {
        ensure({ amount }, it => it >= 0 && it <= this.length)
        return new SourceSpan(
            this.string.substring(0, amount),
            this.offset,
            amount
        )
    }

    move(amount: number) {
        ensure({ amount }, it => it >= 0 && it <= this.length)
        return new SourceSpan(
            this.string.substring(amount),
            this.offset + amount,
            this.length - amount
        )
    }

}
