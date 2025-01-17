import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import usePending from '$shared/hooks/usePending'
import type { ProductId } from '$mp/types/product-types'
import { getProductFromContract } from '$mp/modules/contractProduct/actions'
export default function useContractProductLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('contractProduct.LOAD')
    return useCallback(
        async (productId: ProductId, chainId: number) =>
            wrap(async () => {
                await dispatch(getProductFromContract(productId, chainId))
            }),
        [wrap, dispatch],
    )
}
