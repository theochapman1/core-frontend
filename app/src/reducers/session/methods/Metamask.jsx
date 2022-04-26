import React from 'react'
import Web3 from 'web3'
import { SignInMethod } from '@streamr/streamr-layout'

const Metamask = {
    id: 'metamask',
    label: 'MetaMask',
    icon: <SignInMethod.Icon.Metamask />,
    getWeb3() {
        const ethereumProvider = window.ethereum || (window.web3 || {}).currentProvider

        if (ethereumProvider) {
            return new Web3(ethereumProvider)
        }

        return void 0
    },
}

export default Metamask
