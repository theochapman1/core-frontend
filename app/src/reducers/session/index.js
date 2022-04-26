import Web3 from 'web3'
import { createSelector } from 'reselect'
import getSessionToken from '$auth/utils/getSessionToken'
import validateWeb3 from '$utils/web3/validateWeb3'
import InterruptionError from '$shared/errors/InterruptionError'
import { post } from '$shared/utils/api'
import { logout } from '$shared/modules/user/actions'
import { getUserData } from '$shared/modules/user/services'
import { getToken, getMethod, setToken, setMethod } from '$shared/utils/sessionToken'
import routes from '$routes'
import methods from './methods'

const Init = 'session / init session'

const Start = 'session / start session'

const Stop = 'session / stop session'

const cleanState = {
    busy: false,
    error: undefined,
    method: undefined,
    token: undefined,
    web3: undefined,
}

const recentMethod = methods.find(({ id }) => id === getMethod())

const initialState = {
    ...cleanState,
    method: recentMethod,
    token: getToken() || void 0,
    web3: recentMethod ? recentMethod.getWeb3() : void 0,
}

export function stopSession() {
    return async (dispatch) => {
        try {
            await post({
                url: routes.auth.external.logout(),
            })
        } catch (e) {
            // No-op.
        }

        dispatch(logout())

        dispatch({
            type: Stop,
        })
    }
}

function initSession(method) {
    return (dispatch) => {
        setToken(undefined)

        setMethod(undefined)

        dispatch({
            type: Init,
            payload: method,
        })
    }
}

function defaultAborted() {
    return false
}

// Forever pending.
const defaultCancelPromise = new Promise(() => {})

export function startSession(method, { cancelPromise = defaultCancelPromise, aborted = defaultAborted } = {}) {
    return async (dispatch) => {
        dispatch(initSession(method))

        const web3 = new Web3(method.getWeb3())

        try {
            let token

            try {
                token =
                    await Promise.race([
                        (async () => {
                            await validateWeb3(web3)

                            return getSessionToken({
                                ethereum: web3.currentProvider,
                            })
                        })(),
                        cancelPromise,
                    ])
            } finally {
                if (aborted()) {
                    // eslint-disable-next-line no-unsafe-finally
                    throw new InterruptionError()
                }
            }

            setToken(token)

            setMethod(method.id)

            if (!token) {
                throw new Error('No token')
            }

            let user

            try {
                user = await getUserData()
            } finally {
                if (aborted()) {
                    // eslint-disable-next-line no-unsafe-finally
                    throw new InterruptionError()
                }
            }

            if (!user) {
                throw new Error('No user')
            }

            dispatch({
                type: Start,
                payload: {
                    token,
                    web3,
                },
            })
        } catch (e) {
            if (e instanceof InterruptionError) {
                // Login page has been changed during the sign in process. Clean up (sign out).
                await dispatch(stopSession())
                return
            }

            dispatch({
                type: Start,
                payload: e,
                error: true,
            })
        }
    }
}

export default function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case Init:
            return {
                ...cleanState,
                busy: true,
                method: action.payload,
            }
        case Start:
            if (action.error) {
                return {
                    ...cleanState,
                    error: action.payload,
                    method: state.method,
                }
            }

            return {
                ...cleanState,
                ...action.payload,
                method: state.method,
            }
        case Stop:
            return {
                ...cleanState,
            }
        default:
            return state
    }
}

const selectSession = ({ session }) => session

export const selectSessionBusy = createSelector(selectSession, ({ busy }) => busy)

export const selectSessionError = createSelector(selectSession, ({ error }) => error)

export const selectSessionMethod = createSelector(selectSession, ({ method }) => method)

export const selectSessionToken = createSelector(selectSession, ({ token }) => token || undefined)

export const selectSessionWeb3 = createSelector(selectSession, ({ web3 }) => web3)

export const selectSessionEthereumProvider = createSelector(selectSessionWeb3, (web3) => (
    web3
        ? web3.currentProvider
        : undefined
))
