import React, { Component, ComponentType, ReactNode } from 'react'
import analytics from '../../analytics'
type Props = {
    path?: string
    children?: ReactNode | null | undefined
}
type State = {
    error: Error | null | undefined
}

function getDisplayName(WrappedComponent: ComponentType) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component'
}

const withErrorBoundary = (ErrorComponent: ComponentType<any>) => (OriginalComponent: ComponentType<any>): any => {
    class ErrorBoundary extends Component<Props, State> {
        state: State = {
            error: undefined,
        }

        displayName = `With${getDisplayName(ErrorComponent)}(${getDisplayName(OriginalComponent)})`

        static getDerivedStateFromError(error: any, extra: any) {
            if (error && !error.noReport) {
                console.error({
                    error,
                })
                analytics.reportError(error, extra)
            }

            // Reset error state if route changes, otherwise error is always shown.
            return {
                error,
            }
        }

        componentDidUpdate(prevProps: Props) {
            // Reset error state if route changes, otherwise error is always shown.
            if (this.props.path !== prevProps.path) {
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState({
                    error: undefined,
                })
            }
        }

        render() {
            const { error } = this.state
            const { children, ...props } = this.props
            return error ? (
                <ErrorComponent {...props} error={this.state.error} />
            ) : (
                <OriginalComponent {...props}>{children}</OriginalComponent>
            )
        }
    }

    return ErrorBoundary
}

export default withErrorBoundary
