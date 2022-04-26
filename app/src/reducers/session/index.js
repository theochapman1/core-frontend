import Web3 from 'web3'
import { createSelector } from 'reselect'
import getSessionToken from '$auth/utils/getSessionToken'
import validateWeb3 from '$utils/web3/validateWeb3'
import InterruptionError from '$shared/errors/InterruptionError'
import { post } from '$shared/utils/api'
import { logout } from '$shared/modules/user/actions'
import { setToken } from '$shared/utils/sessionToken'
import routes from '$routes'

const Init = 'session / init session'

const Start = 'session / start session'

const Stop = 'session / stop session'

const initialState = {
    busy: false,
    error: undefined,
    method: undefined,
    token: undefined,
    web3: undefined,
}

function defaultAborted() {
    return false
}

// Forever pending.
const defaultCancelPromise = new Promise(() => {})

export function startSession(method, { cancelPromise = defaultCancelPromise, aborted = defaultAborted } = {}) {
    return async (dispatch) => {
        dispatch({
            type: Init,
            payload: method,
        })

        const web3 = new Web3(method.getWeb3())

        let token

        try {
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

            if (!token) {
                throw new Error('No token')
            }

            setToken(token)

            dispatch({
                type: Start,
                payload: {
                    token,
                    web3,
                },
            })
        } catch (e) {
            if (e instanceof InterruptionError) {
                dispatch({
                    type: Stop,
                })
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

export function stopSession() {
    return async (dispatch) => {
        await post({
            url: routes.auth.external.logout(),
        })

        dispatch(logout)

        dispatch({
            type: Stop,
        })
    }
}

export default function sessionReducer(state = initialState, action) {
    switch (action.type) {
        case Init:
            return {
                ...initialState,
                busy: true,
                method: action.payload,
            }
        case Start:
            if (action.error) {
                return {
                    ...initialState,
                    error: action.payload,
                    method: state.method,
                }
            }

            return {
                ...initialState,
                ...action.payload,
                method: state.method,
            }
        case Stop:
            return {
                ...initialState,
            }
        default:
            return state
    }
}

const selectSession = ({ session }) => session

export const selectSessionBusy = createSelector(selectSession, ({ busy }) => busy)

export const selectSessionError = createSelector(selectSession, ({ error }) => error)

export const selectSessionMethod = createSelector(selectSession, ({ method }) => method)

export const selectSessionToken = createSelector(selectSession, ({ token }) => token)

export const selectSessionWeb3 = createSelector(selectSession, ({ web3 }) => web3)
