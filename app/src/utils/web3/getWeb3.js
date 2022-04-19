import Web3 from 'web3'
import getConfig from '$shared/web3/config'

const { web3, ethereum } = window

if (ethereum) {
    // Disable automatic reload when network is changed in Metamask. Reload is handled
    // in GlobalInfoWatcher component.
    ethereum.autoRefreshOnNetworkChange = false
}

let cache

export default function getWeb3() {
    if (!cache) {
        cache = new Web3(ethereum || (web3 || {}).currentProvider)
        cache.transactionConfirmationBlocks = getConfig().mainnet.transactionConfirmationBlocks
    }

    return cache
}
