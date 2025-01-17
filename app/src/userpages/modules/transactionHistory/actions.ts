import { Action, AnyAction } from 'redux'
import type { HashList, EventLog, EventLogList, TransactionEntityList, TransactionEntity } from '$shared/types/web3-types'
import type { ErrorInUi } from '$shared/types/common-types'
import { handleEntities } from '$shared/utils/entities'
import { transactionsSchema, contractProductSchema } from '$shared/modules/entities/schema'
import type { StoreState } from '$shared/types/store-state'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectEntities } from '$shared/modules/entities/selectors'
import { selectEthereumNetworkId } from '$mp/modules/global/selectors'
import type { ProductIdList } from '$mp/types/product-types'
import { getProductFromContract } from '$mp/modules/contractProduct/services'
import { selectMyProductList } from '$mp/modules/myProductList/selectors'
import { isEthereumAddress } from '$mp/utils/validate'
import { getValidId } from '$mp/utils/product'
import { selectTransactionEvents, selectOffset } from './selectors'
import * as services from './services'
export const GET_TRANSACTION_EVENTS_REQUEST = 'GET_TRANSACTION_EVENTS_REQUEST'
export const GET_TRANSACTION_EVENTS_SUCCESS = 'GET_TRANSACTION_EVENTS_SUCCESS'
export const GET_TRANSACTION_EVENTS_FAILURE = 'GET_TRANSACTION_EVENTS_FAILURE'
export const GET_TRANSACTIONS_REQUEST = 'GET_TRANSACTIONS_REQUEST'
export const GET_TRANSACTIONS_SUCCESS = 'GET_TRANSACTIONS_SUCCESS'
export const GET_TRANSACTIONS_FAILURE = 'GET_TRANSACTIONS_FAILURE'
export const CLEAR_TRANSACTION_LIST = 'CLEAR_TRANSACTION_LIST'

const getTransactionEventsRequest = () => ({
    type: GET_TRANSACTION_EVENTS_REQUEST,
})

const getTransactionEventsSuccess = (events: EventLogList) => ({
    type: GET_TRANSACTION_EVENTS_SUCCESS,
    events,
})

const getTransactionEventsFailure = (error: ErrorInUi) => ({
    type: GET_TRANSACTION_EVENTS_FAILURE,
    error,
})

const getTransactionsRequest = () => ({
    type: GET_TRANSACTIONS_REQUEST,
})

const getTransactionsSuccess = (ids: HashList) => ({
    type: GET_TRANSACTIONS_SUCCESS,
    ids,
})

const getTransactionsFailure = (error: ErrorInUi): AnyAction => ({
    type: GET_TRANSACTIONS_FAILURE,
    error,
})

export const fetchProducts =
    (ids: ProductIdList, chainId: number) =>
        (dispatch: (...args: Array<any>) => void): void => {
            (ids || []).forEach((id) => {
                try {
                    getProductFromContract(id, true, chainId)
                        .then(handleEntities(contractProductSchema, dispatch))
                        .catch((e) => {
                            console.warn(e)
                        })
                } catch (e) {
                    console.warn(e)
                }
            })
        }
export const clearTransactionList = (): Action => ({
    type: CLEAR_TRANSACTION_LIST,
})

export const showEvents =
    () =>
        (dispatch: (...args: Array<any>) => void, getState: () => StoreState): Promise<void> => {
            dispatch(getTransactionsRequest())
            const state = getState()
            const events = selectTransactionEvents(state) || []
            const entities = selectEntities(state)
            const offset = selectOffset(state)
            const chainId = selectEthereumNetworkId(state)
            const eventsToShow = events.splice(offset, 10)
            const eventsToFetch = eventsToShow.filter((event: EventLog) => !(entities.transactions && entities.transactions[event.id]))
            return services
                .getTransactionsFromEvents(eventsToFetch)
                .then((data: TransactionEntityList) => {
                    const productsToFetch: ProductIdList = data
                        .filter(
                            (transaction: TransactionEntity) =>
                                transaction.productId &&
                            transaction.productId !== '0x0' &&
                            !(entities.contractProducts && entities.contractProducts[transaction.productId]),
                        )
                        .reduce(
                            (result, transaction: TransactionEntity) =>
                                result.includes(transaction.productId) ? result : [...result, transaction.productId || ''],
                            [],
                        )
                    dispatch(fetchProducts(productsToFetch, chainId))
                    return data
                })
                .then(handleEntities(transactionsSchema, dispatch))
                .then(() => {
                    dispatch(getTransactionsSuccess(eventsToShow.map((event) => event.id)))
                })
                .catch((error) => {
                    dispatch(getTransactionsFailure(error))
                })
        }
export const getTransactionEvents =
    () =>
        (dispatch: (...args: Array<any>) => void, getState: () => StoreState): Promise<void> => {
            const state = getState()
            const { username } = selectUserData(state) || {}

            if (!username || !isEthereumAddress(username)) {
                return dispatch(getTransactionsSuccess([]))
            }

            const address = username.toLowerCase()
            const products = selectMyProductList(state)
            const ownedProductIds: ProductIdList = (products || [])
                .filter(({ ownerAddress }) => (ownerAddress || '').toLowerCase() === address)
                .map(({ id }) => getValidId(id || ''))
            dispatch(getTransactionEventsRequest())
            return services
                .getTransactionEvents([address], ownedProductIds)
                .then((result) => {
                    dispatch(getTransactionEventsSuccess(result))
                    dispatch(showEvents())
                })
                .catch((error) => {
                    dispatch(getTransactionEventsFailure(error))
                })
        }
