import type { Node } from 'react'
import React from 'react'
import { createPortal } from 'react-dom'
import { Context } from '$shared/contexts/ModalPortal'
import NoModalRootError from '$shared/errors/NoModalRootError'
type Props = {
    children: Node
}

class ModalPortal extends React.Component<Props> {
    static contextType = Context

    componentDidMount() {
        this.modalRoot = document.getElementById('modal-root')
        const { registerModal } = this.context

        if (!this.modalRoot) {
            throw new NoModalRootError()
        }

        this.modalRoot.appendChild(this.root)

        if (registerModal) {
            registerModal()
        }
    }

    componentWillUnmount() {
        const {
            modalRoot,
            root,
            context: { unregisterModal },
        } = this

        if (modalRoot) {
            modalRoot.removeChild(root)
        }

        if (unregisterModal) {
            unregisterModal()
        }
    }

    modalRoot: HTMLElement | null | undefined
    root: HTMLDivElement = document.createElement('div')

    render() {
        return createPortal(this.props.children, this.root)
    }
}

export default ModalPortal