import React from 'react'
import { SignInMethod } from '@streamr/streamr-layout'

const Metamask = {
    id: 'metamask',
    label: 'MetaMask',
    icon: <SignInMethod.Icon.Metamask />,
    async setProvider(web3) {
        const provider = window.ethereum || (window.web3 || {}).currentProvider

        if (web3.currentProvider !== provider) {
            web3.setProvider(provider)
        }
    },
}

export default Metamask
