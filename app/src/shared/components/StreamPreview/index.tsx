import React, { useState, useMemo, Fragment } from 'react'
import styled, { css } from 'styled-components'
import SvgIcon from '$shared/components/SvgIcon'
import Errors from '$ui/Errors'
import LoadingIndicator from '$shared/components/LoadingIndicator'
import IconButton from './IconButton'
import Toolbar from './Toolbar'
import Feed from './Feed'
import Foot from './Foot'
import Head from './Head'
import Selector from './Selector'

type InspectorButtonProps = {
    active: boolean,
}

const InspectorButton = styled(IconButton)<InspectorButtonProps>`
    width: 32px;
    height: 32px;
    text-align: center;
    position: relative;
    border: none;
    background: none;
    appearance: none;
    border-radius: 2px;
    color: #cdcdcd;

    &:hover,
    &:active,
    &:focus {
        background-color: #efefef;
        color: #525252;
    }

    ${({ active }) =>
        !!active &&
        css`
            background-color: #efefef;
            color: #525252;
        `}
`

type Props = {
    activePartition?: number,
    className?: string,
    dataError?: string,
    loading?: boolean,
    streamId?: string,
    navigableStreamIds?: Array<string>,
    onChange?: () => void,
    onClose?: () => void,
    onPartitionChange?: (partition: number) => void,
    onStreamSettings?: () => void,
    stream?: any,
    streamData?: any,
    subscriptionError?: string,
    titlePrefix?: string,
}

const UnstyledStreamPreview = ({
    activePartition = 0,
    className,
    dataError,
    loading = false,
    streamId,
    navigableStreamIds = [streamId],
    onChange: onStreamChange,
    onClose,
    onPartitionChange,
    onStreamSettings,
    stream,
    streamData,
    subscriptionError,
    titlePrefix,
}: Props) => {
    const [inspectorFocused, setInspectorFocused] = useState(false)
    const streamLoaded = !!(stream && stream.id === streamId)
    const { description, partitions } = stream || {}
    const partitionOptions = useMemo(
        () => (partitions ? [...new Array(partitions)].map((_, index) => index) : undefined),
        [partitions],
    )
    return (
        <div className={className}>
            {/*
            <Head
                description={description}
                onCloseClick={onClose}
                skeletonize={!streamLoaded}
                streamId={streamId}
                titlePrefix={titlePrefix}
            />
            */}
            <Toolbar
                onPartitionChange={onPartitionChange}
                onSettingsButtonClick={onStreamSettings}
                onStreamChange={onStreamChange}
                partition={activePartition}
                partitions={partitionOptions || []}
                streamId={streamId}
                streamIds={navigableStreamIds || []}
            />
            <LoadingIndicator loading={!streamLoaded || !!loading} />
            <Feed
                inspectorFocused={inspectorFocused}
                stream={stream}
                streamData={streamData}
                streamLoaded={streamLoaded}
                errorComponent={
                    <Fragment>
                        {!!subscriptionError && <Errors>{subscriptionError}</Errors>}
                        {!!dataError && <Errors>{dataError}</Errors>}
                    </Fragment>
                }
            />
            <Foot>
                <div>
                    <InspectorButton
                        active={!inspectorFocused}
                        onClick={() => setInspectorFocused(false)}
                        type="button"
                    >
                        <SvgIcon name="list" />
                    </InspectorButton>
                </div>
                <div>
                    <InspectorButton
                        active={!!inspectorFocused}
                        onClick={() => setInspectorFocused(true)}
                        type="button"
                    >
                        <SvgIcon name="listInspect" />
                    </InspectorButton>
                </div>
                {!inspectorFocused && !!streamLoaded && (
                    <div>
                        <Selector
                            title="Partitions"
                            options={partitionOptions || []}
                            active={activePartition}
                            onChange={onPartitionChange}
                        />
                    </div>
                )}
            </Foot>
        </div>
    )
}

const StreamPreview = styled(UnstyledStreamPreview)`
    background: #ffffff;
    color: #323232;
    display: flex;
    flex-direction: column;
    height: 100%;

    ${Errors} {
        margin: 20px 40px 0;
    }

    ${Errors} + ${Errors} {
        margin-top: 1em;
    }

    ${Errors}:last-child {
        padding-bottom: 20px;
    }
`
export default StreamPreview
