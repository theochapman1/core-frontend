// @flow

import React, { Component } from 'react'
import { Container } from '@streamr/streamr-layout'
import classNames from 'classnames'
import styles from './details.pcss'
import pageStyles from '../productPage.pcss'

import type { Stream, StreamList } from '../../../flowtype/stream-types'
import { Row, HeaderRow } from '../Table'

export type Props = {
    fetchingStreams: boolean,
    streams: StreamList,
}

export default class Details extends Component<Props> {
    render() {
        const { streams, fetchingStreams } = this.props

        return (
            <div className={classNames(styles.details, pageStyles.section)}>
                <Container>
                    <div className={classNames(styles.streams)}>
                        <HeaderRow title={`Streams (${streams.length || 0})`}>Description</HeaderRow>
                        <hr />
                        {fetchingStreams && (
                            <Row>Loading streams...</Row>
                        )}
                        {!fetchingStreams && streams.length > 0 && streams.map(({id, name, description}: Stream) => (
                            <Row key={id} title={name}>{description}</Row>
                        ))}
                    </div>
                </Container>
            </div>
        )
    }
}
