import React, { useState, useEffect, useCallback, FunctionComponent } from 'react'
import cx from 'classnames'
import { useTransition, animated } from 'react-spring'
import { useDebouncedCallback } from 'use-debounce'
import styles from './loadingIndicator.pcss'
type Props = {
    loading?: boolean
    className?: string | null | undefined
}

const LoadingIndicator: FunctionComponent<Props> = ({ loading: loadingProp, className }) => {
    const isLoading = !!loadingProp
    const [loadingState, setLoadingState] = useState<boolean>(isLoading)
    // debounce loading flag changes to avoid flickering loading indicator
    const updateLoading = useDebouncedCallback((value) => setLoadingState(value), 1000)
    useEffect(() => {
        updateLoading(isLoading)
    }, [isLoading, setLoadingState, updateLoading])
    const transitions = useTransition(loadingState, null, {
        config: {
            tension: 500,
            friction: 50,
            clamp: true,
        },
        from: {
            opacity: 0,
        },
        enter: {
            opacity: 1,
        },
        leave: {
            opacity: 0,
        },
    })
    return <>
        {transitions.map(
            ({ item, key, props }) =>
                item && (
                    <animated.div
                        key={key}
                        style={props}
                        className={cx(styles.loadingIndicator, className, {
                            [styles.loading]: loadingState,
                        })}
                    />
                ),
        )}
    </>
}

export default LoadingIndicator
