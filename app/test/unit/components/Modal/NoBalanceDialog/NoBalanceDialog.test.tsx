import React from 'react'
import { shallow } from 'enzyme'
import BN from 'bignumber.js'
import NoBalanceDialog from '$mp/components/Modal/NoBalanceDialog'
import GetCryptoDialog from '$mp/components/Modal/GetCryptoDialog'
import GetDataTokensDialog from '$mp/components/Modal/GetDataTokensDialog'
import InsufficientDataDialog from '$mp/components/Modal/InsufficientDataDialog'
import InsufficientDaiDialog from '$mp/components/Modal/InsufficientDaiDialog'
import InsufficientTokenDialog from '$mp/components/Modal/InsufficientTokenDialog'
describe('NoBalanceDialog', () => {
    describe('render', () => {
        it('must render GetCryptoDialog when ETH balance is zero', async () => {
            const wrapper = shallow(
                <NoBalanceDialog
                    required={{
                        gas: new BN(0),
                    }}
                    balances={{
                        native: new BN(0),
                        data: new BN(0),
                    }}
                    paymentCurrency="DATA"
                    onCancel={() => null}
                />,
            )
            expect(wrapper.is(GetCryptoDialog)).toBe(true)
        })
        it('must render GetCryptoDialog when the Payment currency is DATA and when ETH balance is not enough for transaction gas', async () => {
            const wrapper = shallow(
                <NoBalanceDialog
                    required={{
                        gas: new BN(2),
                    }}
                    balances={{
                        native: new BN(1),
                    }}
                    paymentCurrency="DATA"
                    onCancel={() => null}
                />,
            )
            expect(wrapper.is(GetCryptoDialog)).toBe(true)
        })
        it('must render GetDataTokensDialog when the Payment currency is DATA and the DATA balance is zero', async () => {
            const wrapper = shallow(
                <NoBalanceDialog
                    required={{
                        gas: new BN(0),
                        data: new BN(1),
                    }}
                    balances={{
                        native: new BN(1),
                        data: new BN(0),
                    }}
                    paymentCurrency="DATA"
                    onCancel={() => null}
                />,
            )
            expect(wrapper.is(GetDataTokensDialog)).toBe(true)
        })
        it('must render InsufficientData when the Payment currency is DATA and the DATA balance is not enough', async () => {
            const wrapper = shallow(
                <NoBalanceDialog
                    required={{
                        gas: new BN(0),
                        data: new BN(3),
                    }}
                    balances={{
                        native: new BN(1),
                        data: new BN(2),
                    }}
                    paymentCurrency="DATA"
                    onCancel={() => null}
                />,
            )
            expect(wrapper.is(InsufficientDataDialog)).toBe(true)
        })
        // eslint-disable-next-line max-len
        it('must render InsufficientDaiDialog when the Payment currency is DAI and the DAI balance is zero while the user has enough ETH for gas', async () => {
            const wrapper = shallow(
                <NoBalanceDialog
                    required={{
                        gas: new BN(1),
                        dai: new BN(2),
                    }}
                    balances={{
                        native: new BN(2),
                        dai: new BN(0),
                    }}
                    paymentCurrency="DAI"
                    onCancel={() => null}
                />,
            )
            expect(wrapper.is(InsufficientDaiDialog)).toBe(true)
        })
        // eslint-disable-next-line max-len
        it('must render InsufficientDaiDialog when the Payment currency is DAI and the DAI balance is not enough while the user has enough ETH for gas', async () => {
            const wrapper = shallow(
                <NoBalanceDialog
                    required={{
                        gas: new BN(1),
                        dai: new BN(10),
                    }}
                    balances={{
                        native: new BN(2),
                        dai: new BN(5),
                    }}
                    paymentCurrency="DAI"
                    onCancel={() => null}
                />,
            )
            expect(wrapper.is(InsufficientDaiDialog)).toBe(true)
        })
        it('must render InsufficientEthDialog when the Payment currency is ETH and ETH balance is not enough', async () => {
            const wrapper = shallow(
                <NoBalanceDialog
                    required={{
                        gas: new BN(1),
                        native: new BN(5),
                    }}
                    balances={{
                        native: new BN(2),
                    }}
                    paymentCurrency="ETH"
                    onCancel={() => null}
                />,
            )
            expect(wrapper.is(InsufficientTokenDialog)).toBe(true)
        })
    })
})
