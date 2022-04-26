import React, { useMemo } from 'react'
import Provider from 'streamr-client-react'
import { useSelector } from 'react-redux'
import getClientConfig from '$app/src/getters/getClientConfig'
import { selectSessionToken, selectSessionEthereumProvider } from '$app/src/reducers/session'

export default function StreamrClientProvider({ children }) {
    const token = useSelector(selectSessionToken)

    const ethereumProvider = useSelector(selectSessionEthereumProvider)

    const config = useMemo(() => {
        const nextConfig = getClientConfig()

        if (token) {
            nextConfig.auth = {
                ...nextConfig.auth,
                sessionToken: token || undefined,
                ethereum: ethereumProvider,
            }
        }

        return nextConfig
    }, [token, ethereumProvider])

    return <Provider {...config}>{children}</Provider>
}
