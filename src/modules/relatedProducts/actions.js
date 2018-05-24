// @flow

import { createAction } from 'redux-actions'
import { normalize } from 'normalizr'

import type { Product } from '../../flowtype/product-types'
import type { ErrorInUi, ReduxActionCreator } from '../../flowtype/common-types'
import { relatedProductsSchema } from '../entities/schema'
import { updateEntities } from '../entities/actions'
import * as api from './services'
import {
    GET_RELATED_PRODUCTS_REQUEST,
    GET_RELATED_PRODUCTS_SUCCESS,
    GET_RELATED_PRODUCTS_FAILURE,
} from './constants'
import type {
    RelatedProductsActionCreator,
    RelatedProductsErrorActionCreator,
} from './types'

export const getRelatedProductsRequest: ReduxActionCreator = createAction(GET_RELATED_PRODUCTS_REQUEST)

export const getRelatedProductsSuccess: RelatedProductsActionCreator = createAction(GET_RELATED_PRODUCTS_SUCCESS, (products: Array<Product>) => ({
    products,
}))

export const getRelatedProductsFailure: RelatedProductsErrorActionCreator = createAction(GET_RELATED_PRODUCTS_FAILURE, (error: ErrorInUi) => ({
    error,
}))

export const getRelatedProducts = (dispatch: Function) => (id: string) => {
    dispatch(getRelatedProductsRequest())
    return api.getRelatedProducts(id)
        .then((data) => {
            const { result, entities } = normalize(data, relatedProductsSchema)
            dispatch(updateEntities(entities))
            dispatch(getRelatedProductsSuccess(result))
        })
        .catch((error) => dispatch(getRelatedProductsFailure(error)))
}
