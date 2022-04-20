import React from 'react'
import EthereumProvider from '@walletconnect/ethereum-provider'
import { SignInMethod } from '@streamr/streamr-layout'

const WalletConnect = {
    id: 'walletConnect',
    label: 'WalletConnect',
    icon: <SignInMethod.Icon.WalletConnect />,
    async setProvider(web3) {
        const provider = new EthereumProvider({
            chainId: 137,
            rpc: {
                '137': 'https://polygon-rpc.com/',
                '8997': 'http://192.168.0.192:8546',
                '8995': 'http://192.168.0.192:8545',
            },
        })

        // WalletConnect fix. lol
        provider.signer.request = provider.signer.request.bind(provider.signer)

        web3.setProvider(provider)
    },
}

export default WalletConnect
