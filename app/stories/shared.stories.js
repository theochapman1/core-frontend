import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, text, array, number, boolean } from '@storybook/addon-knobs'
import { withNotes } from '@storybook/addon-notes'
import styles from '@sambego/storybook-styles'

import Toggle from '$shared/components/Toggle'
import Table from '$shared/components/Table'
import FileUpload from '$shared/components/FileUpload'
import Tabs from '$shared/components/Tabs'
import Checkbox from '$shared/components/Checkbox'
import DropdownActions from '$shared/components/DropdownActions'
import Meatball from '$shared/components/Meatball'
import StatusIcon from '$shared/components/StatusIcon'
import TextInput from '$shared/components/TextInput'

const story = (name) => storiesOf(`Shared/${name}`, module)
    .addDecorator(styles({
        padding: '15px',
    }))
    .addDecorator(withKnobs)

story('Toggle')
    .addWithJSX('basic', () => <Toggle onChange={action('onChange')} />)

story('Dropdown')
    .addWithJSX('basic', () => (
        <DropdownActions title="Select">
            <DropdownActions.Item onClick={action('clicked')}>
                Click me
            </DropdownActions.Item>
            <DropdownActions.Item>Another option</DropdownActions.Item>
        </DropdownActions>
    ))
    .addWithJSX('meatball dropdown', () => (
        <DropdownActions
            title={<Meatball alt="Select" />}
            noCaret
        >
            <DropdownActions.Item onClick={action('clicked')}>
                Click me
            </DropdownActions.Item>
            <DropdownActions.Item>Another option</DropdownActions.Item>
        </DropdownActions>
    ))

story('Status icon')
    .addWithJSX('normal', () => <StatusIcon />)
    .addWithJSX('error', () => <StatusIcon status={StatusIcon.ERROR} />)

story('Table')
    .addWithJSX('basic', () => (
        <Table>
            <Table.Head>
                <Table.Tr>
                    <Table.Th>#</Table.Th>
                    <Table.Th>First Name</Table.Th>
                    <Table.Th>Last Name</Table.Th>
                    <Table.Th>Address</Table.Th>
                    <Table.Th>Username</Table.Th>
                    <Table.Th>Username</Table.Th>
                    <Table.Th>Username</Table.Th>
                </Table.Tr>
            </Table.Head>
            <Table.Body>
                <Table.Tr>
                    <Table.Th>Helsinki Tram Network GPS</Table.Th>
                    <Table.Td>Mark</Table.Td>
                    <Table.Td>Otto</Table.Td>
                    <Table.Td noWrap title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">
                        0xeedcd46d223399e6b3ca395f9d9ca80b429714d9
                    </Table.Td>
                    <Table.Td>Larry</Table.Td>
                    <Table.Td>the Bird</Table.Td>
                    <Table.Td>@twitter</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Helsinki Tram Network GPS</Table.Th>
                    <Table.Td>Jacob</Table.Td>
                    <Table.Td>Thornton</Table.Td>
                    <Table.Td noWrap title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">
                        0xeedcd46d223399e6b3ca395f9d9ca80b429714d9
                    </Table.Td>
                    <Table.Td>Larry</Table.Td>
                    <Table.Td>the Bird</Table.Td>
                    <Table.Td>@twitter</Table.Td>
                </Table.Tr>
                <Table.Tr>
                    <Table.Th>Helsinki Tram Network GPS</Table.Th>
                    <Table.Td>Larry</Table.Td>
                    <Table.Td>the Bird</Table.Td>
                    <Table.Td noWrap title="0xeedcd46d223399e6b3ca395f9d9ca80b429714d9">
                        0xeedcd46d223399e6b3ca395f9d9ca80b429714d9
                    </Table.Td>
                    <Table.Td>Larry</Table.Td>
                    <Table.Td>the Bird</Table.Td>
                    <Table.Td>@twitter</Table.Td>
                </Table.Tr>
            </Table.Body>
        </Table>
    ))

story('FileUpload')
    .addWithJSX('basic', () => (
        <FileUpload
            style={{
                color: 'black',
            }}
            component={<span>Drag a file here or click to browse</span>}
            dropTargetComponent={<span>Drop here!</span>}
            dragOverComponent={<span>Yay, just drop it!</span>}
            onFilesAccepted={action('onFilesAccepted')}
            onError={action('onError')}
            acceptMime={array('acceptMime', ['image/jpeg', 'image/png'])}
            maxFileSizeInMB={number('maxFileSizeInMB', 5)}
            multiple={false}
            disablePreview
        />
    ))

story('Tabs')
    .addWithJSX('basic', () => (
        <Tabs defaultActiveIndex={1}>
            <Tabs.Tab title={text('tab1Title', 'Tab 1')}><span>Content of tab 1</span></Tabs.Tab>
            <Tabs.Tab title={text('tab2Title', 'Tab 2')}><span>Content of tab 2</span></Tabs.Tab>
            <Tabs.Tab title={text('tab3Title', 'Tab 3 with longer name')}><span>Content of tab 3</span></Tabs.Tab>
        </Tabs>
    ))

class CheckboxContainer extends React.Component {
    constructor() {
        super()
        this.state = {
            checked: false,
        }
    }
    render() {
        return (
            <Checkbox
                checked={this.state.checked}
                onChange={(e) => {
                    this.setState({
                        checked: e.target.checked,
                    })
                    action('checked')(e)
                }}
            />
        )
    }
}

story('Checkbox')
    .addWithJSX('checked', () => (
        <Checkbox checked={boolean('checked', true)} />
    ))
    .addWithJSX('unchecked', () => (
        <Checkbox checked={boolean('checked', false)} />
    ))
    .addWithJSX('changeable', () => (
        <CheckboxContainer />
    ))

story('Text Field/Text')
    .addWithJSX('basic', () => (
        <TextInput label="Initially empty text input" onChange={action('change')} />
    ))
    .addWithJSX('w/ placeholder', () => (
        <TextInput label="Text input w/ placeholder" placeholder="Placeholder" readOnly />
    ))
    .addWithJSX('w/ value', () => (
        <TextInput label="Text input w/ value" value="Something important!" readOnly />
    ))
    .addWithJSX('processing', () => (
        <TextInput label="Processing" readOnly processing />
    ))
    .addWithJSX('errored', () => (
        <TextInput label="Errored!" readOnly error="Oh, something went wrong!" />
    ))
    .addWithJSX('with invalid value', () => (
        <TextInput label="With invalid value" value="Something invalid" error="Oh, something went wrong!" />
    ))

story('Text Field/Password')
    .addWithJSX('basic', () => (
        <TextInput label="Password…" value={text('value', 'You shall not pass!')} type="password" />
    ))
    .addWithJSX('min strength 0', () => (
        <TextInput label="" value={text('value', 'password')} type="password" measureStrength={0} />
    ))
    .addWithJSX('min strength 1', () => (
        <TextInput label="" value={text('value', 'password')} type="password" measureStrength={1} />
    ))
    .addWithJSX('min strength 2', () => (
        <TextInput label="" value={text('value', 'password')} type="password" measureStrength={2} />
    ))