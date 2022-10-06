import BN from 'bignumber.js'
import * as all from '$mp/utils/price'
describe('price utils', () => {
    describe('isPriceValid', () => {
        it('works with positive number', () => {
            expect(all.isPriceValid(2)).toBe(true)
            expect(all.isPriceValid('300')).toBe(true)
            expect(all.isPriceValid(BN(4e20))).toBe(true)
            expect(all.isPriceValid(BN('4444562598.111772'))).toBe(true)
        })
        it('works with zero', () => {
            expect(all.isPriceValid(0)).toBe(false)
            expect(all.isPriceValid('0')).toBe(false)
            expect(all.isPriceValid(BN(0))).toBe(false)
            expect(all.isPriceValid(BN('0'))).toBe(false)
        })
        it('works with negative number', () => {
            expect(all.isPriceValid(-2)).toBe(false)
            expect(all.isPriceValid('-300')).toBe(false)
            expect(all.isPriceValid(BN(-4e20))).toBe(false)
            expect(all.isPriceValid(BN('-1234567.898765'))).toBe(false)
        })
        it('works with NaN', () => {
            expect(all.isPriceValid(NaN)).toBe(false)
            expect(all.isPriceValid('NaN')).toBe(false)
        })
    })
    describe('priceForTimeUnits', () => {
        it('works without the digits parameter', () => {
            const pps = 2
            expect(all.priceForTimeUnits(pps, 0, 'second')).toStrictEqual(BN(0))
            expect(all.priceForTimeUnits(0, 0, 'second')).toStrictEqual(BN(0))
            expect(all.priceForTimeUnits(pps, 7, 'second')).toStrictEqual(BN(14))
            expect(all.priceForTimeUnits(pps, 7, 'minute')).toStrictEqual(BN(840))
            expect(all.priceForTimeUnits(pps, 7, 'hour')).toStrictEqual(BN(50400))
            expect(all.priceForTimeUnits(pps, 7, 'day')).toStrictEqual(BN(1209600))
            expect(all.priceForTimeUnits(pps, 7, 'week')).toStrictEqual(BN(8467200))
            // expect(all.priceForTimeUnits(pps, 7, 'month')).toBe(36288000) depends on the month we're now
            expect(() => all.priceForTimeUnits(pps, 7, 'asdf')).toThrow()
        })
    })
    describe('pricePerSecondFromTimeUnit', () => {
        it('calculates PPS for time units', () => {
            expect(all.pricePerSecondFromTimeUnit(0, 'second', 18)).toStrictEqual('0')
            expect(all.pricePerSecondFromTimeUnit(1, 'second', 18)).toStrictEqual('1000000000000000000')
            expect(all.pricePerSecondFromTimeUnit(1, 'minute', 18)).toStrictEqual('16666666666666667')
            expect(all.pricePerSecondFromTimeUnit(1, 'hour', 18)).toStrictEqual('277777777777778')
            expect(all.pricePerSecondFromTimeUnit(1, 'day', 18)).toStrictEqual('11574074074074')
            expect(all.pricePerSecondFromTimeUnit(1, 'week', 18)).toStrictEqual('1653439153439')
            expect(() => all.pricePerSecondFromTimeUnit(0, 'asdf', 18)).toThrow()
        })
    })
    describe('sanitize', () => {
        it('sanitizes correctly', () => {
            expect(all.sanitize(-500)).toStrictEqual(BN(0))
            expect(all.sanitize(-1.345345)).toStrictEqual(BN(0))
            expect(all.sanitize(12300)).toStrictEqual(BN(12300))
            expect(all.sanitize(1.012030123012)).toStrictEqual(BN(1.012030123012))
        })
    })
    describe('formatAmount', () => {
        it('formats amount', () => {
            expect(all.formatAmount(1, -2123123)).toStrictEqual(1)
            expect(all.formatAmount(1, 5)).toStrictEqual(BN(1))
            expect(all.formatAmount(0.0005, 3)).toStrictEqual(BN(0.001))
            expect(all.formatAmount(0.000551, 4)).toStrictEqual(BN(0.0006))
            expect(all.formatAmount(0.000541, 4)).toStrictEqual(BN(0.0005))
        })
    })
    describe('formatDecimals', () => {
        it('displays, rounds and recognizes currency', () => {
            expect(all.formatDecimals(1, 'DATA')).toBe('1')
            expect(all.formatDecimals(1.234, 'DATA')).toBe('1.234')
            expect(all.formatDecimals(10, 'DATA')).toBe('10')
            expect(all.formatDecimals(12.34, 'DATA')).toBe('12.34')
            expect(all.formatDecimals(12.345, 'DATA')).toBe('12.35')
            expect(all.formatDecimals(123.45, 'DATA')).toBe('123.5')
            expect(all.formatDecimals(1234.5, 'DATA')).toBe('1235')
            expect(all.formatDecimals(1234, 'DATA')).toBe('1234')
            expect(all.formatDecimals(1, 'USD')).toBe('1.00')
            expect(all.formatDecimals(1.234, 'USD')).toBe('1.23')
            expect(all.formatDecimals(10, 'USD')).toBe('10.00')
            expect(all.formatDecimals(12.34, 'USD')).toBe('12.34')
            expect(all.formatDecimals(12.345, 'USD')).toBe('12.35')
            expect(all.formatDecimals(123.45, 'USD')).toBe('123.5')
            expect(all.formatDecimals(1234.5, 'USD')).toBe('1235')
            expect(all.formatDecimals(1234, 'USD')).toBe('1234')
        })
    })
    describe('arePricesEqual', () => {
        it('checks prices', () => {
            expect(all.arePricesEqual(1, 0.5)).toBe(false)
            expect(all.arePricesEqual(1, 1)).toBe(true)
            expect(all.arePricesEqual(-1.123123, -1.123123)).toBe(true)
            expect(all.arePricesEqual(0.00000000000000001, -0.00000000000000001)).toBe(false)
            expect(all.arePricesEqual(0.00000000000000001, 0.00000000000000001)).toBe(true)
        })
    })
    describe('getMostRelevantTimeUnit', () => {
        it('calculates the most relevant time unit', () => {
            expect(all.getMostRelevantTimeUnit(1)).toBe('second')
            expect(all.getMostRelevantTimeUnit(0.017)).toBe('minute')
            expect(all.getMostRelevantTimeUnit(0.0017)).toBe('hour')
            expect(all.getMostRelevantTimeUnit(0.00017)).toBe('day')
            expect(all.getMostRelevantTimeUnit(0.0000017)).toBe('week')
        })
    })
    describe('formatPrice', () => {
        it('works with all parameters given', () => {
            expect(all.formatPrice(1, 'DATA', BN(18), 'second')).toBe('1 DATA / s')
            expect(all.formatPrice(1, 'DATA', BN(18), 'minute')).toBe('60 DATA / min')
            expect(all.formatPrice(0.016666, 'DATA', BN(18), 'minute')).toBe('1 DATA / min')
            expect(all.formatPrice(0.016666, 'DATA', BN(18), 'hour')).toBe('60 DATA / hr')
            expect(all.formatPrice(1.004512, 'DATA', BN(18), 'second')).toBe('1.005 DATA / s')
            expect(all.formatPrice(123.456789, 'DATA', BN(18), 'second')).toBe('123.5 DATA / s')
            expect(all.formatPrice(123.512345, 'DATA', BN(18), 'second')).toBe('123.5 DATA / s')
            expect(all.formatPrice(0.00000000008, 'DATA', BN(18), 'second')).toBe('0 DATA / s')
            expect(all.formatPrice(0.0002777777, 'USD', BN(18), 'hour')).toBe('1.00 USD / hr')
            expect(all.formatPrice(0.0002777777, 'USD', BN(18), 'day')).toBe('24.00 USD / d')
            expect(all.formatPrice(0.0000115, 'USD', BN(18), 'day')).toBe('0.99 USD / d')
            expect(all.formatPrice(0.0000115, 'USD', BN(18), 'week')).toBe('6.96 USD / wk')
        })
        it('works without timeunit given', () => {
            expect(all.formatPrice(1, 'DATA', BN(18))).toBe('1 DATA / s')
            expect(all.formatPrice(0.0166666666667, 'DATA', BN(18))).toBe('1 DATA / min')
            expect(all.formatPrice(0.04, 'DATA', BN(18))).toBe('2.4 DATA / min')
            expect(all.formatPrice(0.0002777777778, 'USD', BN(18))).toBe('1.00 USD / hr')
            expect(all.formatPrice(0.000011574075, 'USD', BN(18))).toBe('1.00 USD / d')
            expect(all.formatPrice(0.00005, 'USD', BN(18))).toBe('4.32 USD / d')
            expect(all.formatPrice(0.00000165344, 'USD', BN(18))).toBe('1.00 USD / wk')
        })
    })
})