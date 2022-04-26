import React, { useMemo } from 'react'
import Provider from 'streamr-client-react'
import { useSelector } from 'react-redux'
import getClientConfig from '$app/src/getters/getClientConfig'
import getWeb3 from '$utils/web3/getWeb3'
import { selectSessionToken } from '$app/src/reducers/session'

export default function StreamrClientProvider({ children }) {
    const token = useSelector(selectSessionToken)

    const config = useMemo(() => {
        const nextConfig = getClientConfig()

        if (token) {
            nextConfig.auth = {
                ...nextConfig.auth,
                sessionToken: token || undefined,
                ethereum: getWeb3().currentProvider,
            }
        }

        return nextConfig
    }, [token])

    return config.auth.ethereum
        ? <Provider {...config}>{children}</Provider>
        : children
}
