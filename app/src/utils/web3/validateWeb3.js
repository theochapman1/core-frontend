import getWeb3 from '$utils/web3/getWeb3'
import Web3NotSupportedError from '$shared/errors/Web3NotSupportedError'
import { networks } from '$shared/utils/constants'
import { checkEthereumNetworkIsCorrect } from '$shared/utils/web3'
import getDefaultWeb3Account from '$utils/web3/getDefaultWeb3Account'
import unlock from '$utils/web3/unlock'

export const DefaultFiniteTimeout = 100

export default async function validateWeb3({ timeoutAfter, network } = {}) {
    const web3 = getWeb3()

    if (!web3.currentProvider) {
        throw new Web3NotSupportedError()
    }

    await unlock(web3.currentProvider, {
        timeoutAfter,
    })

    // The following will throw an exception if the account is inaccessible.
    await getDefaultWeb3Account(web3)

    if (typeof network !== 'string' || !Object.values(networks).includes(network)) {
        return
    }

    await checkEthereumNetworkIsCorrect({
        web3,
        network,
    })
}
