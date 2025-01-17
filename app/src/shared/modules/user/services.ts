import { $Values } from 'utility-types'
import { get, post, put, del } from '$shared/utils/api'
import type { ApiResult } from '$shared/types/common-types'
import type { User, Challenge } from '$shared/types/user-types'
import { BalanceType } from '$shared/types/user-types'
import type { Address } from '$shared/types/web3-types'
import { getDataTokenBalance, getNativeTokenBalance } from '$mp/utils/web3'
import routes from '$routes'
const GRAPH_API_URL = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'
export const getUserData = (): ApiResult<User> =>
    get({
        url: routes.api.currentUser.index({
            noCache: Date.now(),
        }),
    })
export const putUser = (user: User): ApiResult<User> =>
    put({
        url: routes.api.currentUser.index(),
        data: user,
    })
export const uploadProfileAvatar = (image: File): Promise<any> => {
    const options = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    const data = new FormData()
    data.append('file', image, image.name)
    return post({
        url: routes.api.currentUser.image(),
        data,
        options,
    })
}
export const deleteUserAccount = (): ApiResult<null> =>
    del({
        url: routes.api.currentUser.index(),
    })
export const createChallenge = (account: Address): ApiResult<Challenge> =>
    post({
        url: routes.api.loginChallenge({
            account,
        }),
        useAuthorization: false,
    })
type GetBalance = {
    address: Address
    type: $Values<typeof BalanceType>
    usePublicNode?: boolean
    chainId?: number
}
export async function getBalance({ address, type, usePublicNode = false, chainId }: GetBalance) {
    let balance

    if (type === BalanceType.ETH) {
        balance = await getNativeTokenBalance(address, usePublicNode)
    } else if (type === BalanceType.DATA) {
        if (chainId == null) {
            throw new Error('chainId must be provided!')
        }

        balance = await getDataTokenBalance(address, usePublicNode, chainId)
    } else {
        throw new Error(`Unknown balance type ${type}!`)
    }

    return balance
}
type Domains = {
    data: {
        domains: Array<{
            name: string
        }>
    }
}
export const getEnsDomains = ({ addresses }: { addresses: Array<Address> }): ApiResult<Domains> =>
    post({
        url: GRAPH_API_URL,
        data: {
            query: `
            query {
                domains(
                    where: { owner_in: [${(addresses || []).map((address) => `"${address}"`).join(', ')}]}
                    orderBy: name
                ) {
                    id
                    name
                    labelName
                    labelhash
                }
            }
        `,
        },
        useAuthorization: false,
    })
