import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import usePending from '$shared/hooks/usePending'
import type { DataUnionId } from '$mp/types/product-types'
import { getDataUnionById } from '$mp/modules/dataUnion/actions'
export default function useDataUnionLoadCallback() {
    const dispatch = useDispatch()
    const { wrap } = usePending('dataUnion.LOAD')
    return useCallback(
        async (id: DataUnionId, chainId: number) =>
            wrap(async () => {
                await dispatch(getDataUnionById(id, chainId))
            }),
        [wrap, dispatch],
    )
}
