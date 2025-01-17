import React, { useReducer, useCallback, FunctionComponent, MouseEventHandler } from 'react'
import Button from '$shared/components/Button'
import useIsMounted from '$shared/hooks/useIsMounted'
import KeyFieldEditor, { LabelType } from '../KeyFieldEditor'

type AddKeyFieldProps = {
    label?: string,
    addKeyFieldAllowed?: boolean,
    labelType?: LabelType,
    onSave?: (param?: any) => any
}

const AddKeyField: FunctionComponent<AddKeyFieldProps> = ({ label, addKeyFieldAllowed, labelType, onSave: onSaveProp }) => {
    const [{
        editing,
        waiting,
        error
    }, updateState] = useReducer((
        state: { editing: boolean, waiting: boolean, error: any },
        nextState: Partial<{ editing: boolean, waiting: boolean, error: any }>
    ) => ({...state, ...nextState}), {
        editing: false,
        waiting: false,
        error: undefined,
    })
    const isMounted = useIsMounted()
    const onEdit = useCallback<MouseEventHandler>(
        (e) => {
            e.preventDefault()
            updateState({
                editing: true,
            })
        },
        [updateState],
    )
    const onCancel = useCallback(() => {
        updateState({
            editing: false,
            waiting: false,
        })
    }, [updateState])
    const onSave = useCallback(
        async (keyName: string) => {
            updateState({
                waiting: true,
                error: null,
            })

            try {
                await onSaveProp(keyName)

                if (isMounted()) {
                    updateState({
                        editing: false,
                        waiting: false,
                    })
                }
            } catch (e) {
                if (isMounted()) {
                    updateState({
                        waiting: false,
                        error: e.message,
                    })
                }
            }
        },
        [isMounted, updateState, onSaveProp],
    )
    return !editing ? (
        <Button kind="secondary" onClick={onEdit} disabled={!addKeyFieldAllowed}>
            {label}
        </Button>
    ) : (
        <KeyFieldEditor
            createNew
            onCancel={onCancel}
            onSave={onSave}
            waiting={waiting}
            error={error}
            labelType={labelType}
        />
    )
}

export default AddKeyField
