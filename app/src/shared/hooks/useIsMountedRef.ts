import { useEffect, useRef } from 'react'
import type { Ref } from '$shared/types/common-types'
import '$shared/types/common-types'
export default () => {
    const ref: Ref<boolean> = useRef(true)
    useEffect(
        () => () => {
            ref.current = false
        },
        [],
    )
    return ref
}
