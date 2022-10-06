import React from 'react'
import type { ErrorInUi } from '$shared/flowtype/common-types'
import styles from './error.pcss'
type Props = {
    source: ErrorInUi | null | undefined
}

const Error = ({ source }: Props) => (source ? <div className={styles.error}>{source.message}</div> : null)

export default Error