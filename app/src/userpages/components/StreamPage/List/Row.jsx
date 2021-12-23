import React, { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { StatusIcon, titleize } from '@streamr/streamr-layout'
import styled from 'styled-components'
import { StreamPermission } from 'streamr-client'

import Popover from '$shared/components/Popover'
import confirmDialog from '$shared/utils/confirm'
import { NotificationIcon, networks } from '$shared/utils/constants'
import Notification from '$shared/utils/Notification'
import Button from '$shared/components/Button'
import useCopy from '$shared/hooks/useCopy'
import { ago } from '$shared/utils/time'
import { LG } from '$shared/utils/styled'
import useModal from '$shared/hooks/useModal'
import { StreamList } from '$shared/components/List'
import useLastMessageTimestamp from '$shared/hooks/useLastMessageTimestamp'
import getStreamActivityStatus from '$shared/utils/getStreamActivityStatus'
import useIsMounted from '$shared/hooks/useIsMounted'
import { validateWeb3, getWeb3 } from '$shared/web3/web3Provider'
import { WrongNetworkSelectedError } from '$shared/errors/Web3/index'
import { selectUserData } from '$shared/modules/user/selectors'
import routes from '$routes'
import useStreamPath from '../shared/useStreamPath'

const DesktopOnlyButton = styled(Button)`
    && {
        display: none;
    }

    @media (min-width: ${LG}px) {
        && {
            display: inline-flex;
        }
    }
`

export const CreateStreamButton = () => (
    <DesktopOnlyButton
        tag={Link}
        to={routes.streams.new()}
    >
        Create stream
    </DesktopOnlyButton>
)

const Row = ({ stream, onShareClick: onShareClickProp, onRemoveStream: onRemoveStreamProp }) => {
    const history = useHistory()
    const { copy } = useCopy()
    const isMounted = useIsMounted()
    const [permissions, setPermissions] = useState([])
    const permissionsFetchedRef = useRef(false)
    const { username } = useSelector(selectUserData) || {}

    const { api: switchNetworkDialog } = useModal('switchNetwork')
    const { api: snippetDialog } = useModal('userpages.streamSnippet')
    const { truncatedId } = useStreamPath(stream.id)

    const [canBeDeletedByCurrentUser, canBeSharedByCurrentUser] = useMemo(() => [
        !!permissions[StreamPermission.DELETE],
        !!permissions[StreamPermission.GRANT],
    ], [permissions])

    const validateNetwork = useCallback(async () => {
        try {
            await validateWeb3({
                web3: getWeb3(),
                requireNetwork: networks.SIDECHAIN,
            })
        } catch (e) {
            let propagateError = true

            if (e instanceof WrongNetworkSelectedError) {
                const { proceed } = await switchNetworkDialog.open({
                    requiredNetwork: e.requiredNetwork,
                    initialNetwork: e.currentNetwork,
                })

                propagateError = !proceed
            }

            if (propagateError) {
                throw e
            }
        }
    }, [switchNetworkDialog])

    const confirmDeleteStream = useCallback(async () => {
        const confirmed = await confirmDialog('stream', {
            title: `${canBeDeletedByCurrentUser ? 'Delete' : 'Remove'} this stream?`,
            message: 'This is an unrecoverable action. Please confirm this is what you want before you proceed.',
            acceptButton: {
                title: `Yes, ${canBeDeletedByCurrentUser ? 'delete' : 'remove'}`,
                kind: 'destructive',
            },
            centerButtons: true,
            dontShowAgain: false,
        })

        if (confirmed) {
            try {
                await validateNetwork()

                if (canBeDeletedByCurrentUser) {
                    await stream.delete()
                } else {
                    // fetch permissions again to get ids
                    const newPermissions = await stream.getUserPermissions(username)

                    await Promise.allSettled(Object.keys(newPermissions)
                        .map((operation) => stream.revokeUserPermission(operation)))
                }

                Notification.push({
                    title: `Stream ${canBeDeletedByCurrentUser ? 'deleted' : 'removed'} successfully`,
                    icon: NotificationIcon.CHECKMARK,
                })

                if (!isMounted()) { return }

                onRemoveStreamProp(stream)
            } catch (e) {
                console.warn(e)

                Notification.push({
                    title: `Stream ${canBeDeletedByCurrentUser ? 'deletion' : 'removal'} failed`,
                    icon: NotificationIcon.ERROR,
                })
            } finally {
                if (isMounted()) {
                    setPermissions([])
                }
            }
        }
    }, [stream, canBeDeletedByCurrentUser, onRemoveStreamProp, isMounted, validateNetwork, username])

    const onToggleStreamDropdown = useCallback(async (open) => {
        if (open && !permissionsFetchedRef.current) {
            permissionsFetchedRef.current = true

            try {
                const permissions = await stream.getUserPermissions(username)

                if (isMounted()) {
                    setPermissions(permissions)
                }
            } catch (e) {
                // Noop.
            }
        }
    }, [stream, isMounted, username])

    const onShareClick = useCallback(() => {
        onShareClickProp(stream)
    }, [onShareClickProp, stream])

    const onOpenSnippetDialog = useCallback(async () => {
        await snippetDialog.open({
            streamId: stream.id,
        })
    }, [snippetDialog, stream.id])

    const showStream = useCallback(() => (
        history.push(routes.streams.show({
            id: stream.id,
        }))
    ), [history, stream.id])

    const onCopyId = useCallback(() => {
        copy(stream.id)

        Notification.push({
            title: 'Stream ID copied',
            icon: NotificationIcon.CHECKMARK,
        })
    }, [copy, stream.id])

    const [timestamp, error, refresh, refreshedAt] = useLastMessageTimestamp(stream.id)

    useEffect(() => {
        // Initial status check is not a "refresh" that's why `refreshedAt`
        // is gonna be undefined. We're taking advantage of it here.

        if (refreshedAt) {
            Notification.push({
                title: 'Stream refreshed',
                icon: NotificationIcon.CHECKMARK,
            })
        }
    }, [refreshedAt])

    const status = error ? StatusIcon.ERROR : getStreamActivityStatus(timestamp, stream.inactivityThresholdHours)

    return (
        <StreamList.Row id={stream.id} onClick={showStream} data-test-hook={`Stream row for ${stream.id}`}>
            <StreamList.Title
                description={stream.description}
                moreInfo={timestamp && titleize(ago(new Date(timestamp)))}
            >
                {truncatedId}
            </StreamList.Title>
            <StreamList.Item truncate title={stream.description}>
                {stream.description}
            </StreamList.Item>
            <StreamList.Item>
                {stream.lastUpdated && titleize(ago(new Date(stream.lastUpdated)))}
            </StreamList.Item>
            <StreamList.Item data-test-hook="Last message at">
                {timestamp && titleize(ago(new Date(timestamp)))}
            </StreamList.Item>
            <StreamList.Item>
                <StatusIcon status={status} tooltip />
            </StreamList.Item>
            <StreamList.Actions>
                <Popover
                    title="Actions"
                    type="meatball"
                    caret={false}
                    onMenuToggle={onToggleStreamDropdown}
                    menuProps={{
                        right: true,
                    }}
                >
                    <Popover.Item onClick={showStream}>
                        Edit stream
                    </Popover.Item>
                    <Popover.Item onClick={onCopyId}>
                        Copy ID
                    </Popover.Item>
                    <Popover.Item onClick={onOpenSnippetDialog}>
                        Copy Snippet
                    </Popover.Item>
                    <Popover.Item disabled={!canBeSharedByCurrentUser} onClick={onShareClick}>
                        Share
                    </Popover.Item>
                    <Popover.Item onClick={refresh}>
                        Refresh
                    </Popover.Item>
                    <Popover.Item onClick={confirmDeleteStream}>
                        {canBeDeletedByCurrentUser ? 'Delete' : 'Remove'}
                    </Popover.Item>
                </Popover>
            </StreamList.Actions>
        </StreamList.Row>
    )
}

export default Row
