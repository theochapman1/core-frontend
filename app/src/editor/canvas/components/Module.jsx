/* eslint-disable react/no-unused-state */

import cx from 'classnames'
import React from 'react'
import { Translate } from 'react-redux-i18n'

import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ModuleUI from '$editor/shared/components/ModuleUI'
import RenameInput from '$editor/shared/components/RenameInput'

import { RunStates } from '../state'

import Ports from './Ports'
import ModuleDragger from './ModuleDragger'

import ModuleStyles from '$editor/shared/components/Module.pcss'
import styles from './Module.pcss'
import { Resizer, isModuleResizable } from './Resizer'

class CanvasModule extends React.PureComponent {
    /**
     * Resizer handling
     */

    el = React.createRef()

    static getDerivedStateFromProps(props) {
        if (!props.module) {
            return null
        }

        return {
            layout: props.module.layout,
        }
    }

    onTriggerOptions = (event) => {
        event.stopPropagation()
        const { api, module, moduleSidebarIsOpen, selectedModuleHash } = this.props
        const isSelected = module.hash === selectedModuleHash

        // need to selectModule here rather than in parent focus handler
        // otherwise selection changes before we can toggle open/close behaviour
        api.selectModule({ hash: module.hash })
        if (isSelected) {
            // toggle sidebar if same module
            api.moduleSidebarOpen(!moduleSidebarIsOpen)
        } else {
            // only open if different
            api.moduleSidebarOpen(true)
        }
    }

    onFocusOptionsButton = (event) => {
        event.stopPropagation() /* skip parent focus behaviour */
    }

    onChangeModuleName = (value) => (
        this.props.api.renameModule(this.props.module.hash, value)
    )

    render() {
        const { api, module, canvas } = this.props

        const { layout } = this.state

        const isSelected = module.hash === this.props.selectedModuleHash

        const isRunning = canvas.state === RunStates.Running

        const moduleSpecificStyles = [ModuleStyles[module.jsModule], ModuleStyles[module.widget]]
        const isResizable = isModuleResizable(module)
        return (
            /* eslint-disable-next-line max-len */
            /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-tabindex */
            <div
                role="rowgroup"
                tabIndex="0"
                onFocus={() => api.selectModule({ hash: module.hash })}
                className={cx(styles.CanvasModule, ModuleStyles.ModuleBase, ...moduleSpecificStyles, {
                    [styles.isSelected]: isSelected,
                })}
                style={{
                    minWidth: layout.width,
                    minHeight: layout.height,
                }}
                data-modulehash={module.hash}
                ref={this.el}
            >
                <div className={cx(ModuleStyles.moduleHeader, styles.dragHandle)}>
                    <RenameInput
                        className={ModuleStyles.name}
                        value={module.displayName || module.name}
                        onChange={this.onChangeModuleName}
                        disabled={!!isRunning}
                        required
                    />
                    <button
                        type="button"
                        className={cx(styles.optionsButton, styles.dragCancel)}
                        onFocus={this.onFocusOptionsButton}
                        onClick={this.onTriggerOptions}
                    >
                        <HamburgerIcon />
                    </button>
                </div>
                <Ports {...this.props} />
                <ModuleUI
                    className={styles.canvasModuleUI}
                    layoutKey={JSON.stringify(layout)}
                    {...this.props}
                    moduleHash={module.hash}
                    canvasId={canvas.id}
                    isActive={isRunning}
                />
                {isResizable && (
                    <Resizer
                        api={api}
                        module={module}
                        target={this.el}
                    />
                )}
            </div>
        )
        /* eslint-enable */
    }
}

function HamburgerIcon(props = {}) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <g fill="none" fillRule="evenodd" stroke="#CDCDCD" strokeLinecap="round" strokeWidth="1.5">
                <path d="M7 16h10M7 12h10M7 8h10" />
            </g>
        </svg>
    )
}

// try render module error in-place
function ModuleError(props) {
    const { module } = props
    const { layout } = module
    return (
        <div
            className={cx(styles.Module)}
            style={{
                top: layout.position.top,
                left: layout.position.left,
                minHeight: layout.height,
                minWidth: layout.width,
            }}
        >
            <div className={styles.moduleHeader}>
                {module.displayName || module.name}
            </div>
            <div className={styles.ports}>
                <Translate value="error.general" />
            </div>
        </div>
    )
}

export default withErrorBoundary(ModuleError)((props) => (
    <ModuleDragger module={props.module} api={props.api}>
        <div>
            <CanvasModule {...props} />
        </div>
    </ModuleDragger>
))
