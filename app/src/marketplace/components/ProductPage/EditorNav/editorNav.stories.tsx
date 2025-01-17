import React, { useState } from 'react'
import { storiesOf } from '@storybook/react'
import styles from '@sambego/storybook-styles'
import EditorNav, { statuses } from '.'
const stories = storiesOf('Marketplace/ProductPage/EditorNav', module)
    .addDecorator(
        styles({
            color: '#323232',
            padding: '5rem',
            background: '#F8F8F8',
        }),
    )
const sections = [
    {
        id: 'name',
        heading: 'Name',
    },
    {
        id: 'coverImage',
        heading: 'Cover Image',
    },
    {
        id: 'description',
        heading: 'Description',
    },
    {
        id: 'streams',
        heading: 'Streams',
    },
    {
        id: 'price',
        heading: 'Price',
    },
    {
        id: 'details',
        heading: 'Details',
    },
]

const EditNavController = (props) => {
    const [activeSection, setActiveSection] = useState('')
    const nameStatus = statuses.EMPTY
    const coverImageStatus = statuses.EMPTY
    const descriptionStatus = statuses.EMPTY
    const streamsStatus = statuses.EMPTY
    const priceStatus = statuses.EMPTY
    const datailsStatus = statuses.EMPTY
    const statusValues = {
        name: nameStatus,
        coverImage: coverImageStatus,
        description: descriptionStatus,
        streams: streamsStatus,
        price: priceStatus,
        details: datailsStatus,
    }
    const sectionsData = sections.map(({ id, ...section }) => ({
        id,
        ...section,
        status: statusValues[id],
        onClick: () => setActiveSection(id),
    }))
    return (
        <div
            style={{
                width: '180px',
            }}
        >
            <EditorNav sections={sectionsData} activeSection={activeSection} {...props} />
        </div>
    )
}

stories.add('basic', () => <EditNavController />)
stories.add('with errors', () => <EditNavController showErrors />)
stories.add('with errors & tracking', () => <EditNavController showErrors trackScrolling />)
