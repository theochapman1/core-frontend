import { useSelector } from 'react-redux'
import { selectAuthState } from '$shared/modules/user/selectors'
import { selectSessionToken } from '$app/src/reducers/session'

export default function useIsSessionTokenReady() {
    const token = useSelector(selectSessionToken())

    const { isAuthenticating, authenticationFailed, isAuthenticated } = useSelector(selectAuthState)

    return !!token || (!isAuthenticating && (!!authenticationFailed || !isAuthenticated))
}
