import React, { useCallback, ReactNode, FunctionComponent } from 'react'
import styled from 'styled-components'
import { Dropdown } from 'reactstrap'
import ModalPortal from '$shared/components/ModalPortal'
import ModalDialog from '$shared/components/ModalDialog'
import useModal from '$shared/hooks/useModal'
import type { AnyFilter } from '$mp/types/product-types'
import PopoverItem from '$shared/components/Popover/PopoverItem'
import type { Options } from './FilterSelector'
import './FilterSelector'
type Props = {
    title: ReactNode
    options: Options
    selected: string
    onChange: (value: AnyFilter | null | undefined) => void
    onClose: () => void
}
const ModalContainer = styled.div`
    background: var(--white);
    color: var(--greyDark);
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
`
const Header = styled.div`
    min-height: 64px;
    display: flex;
`
const Body = styled.div`
    flex: 1;
    padding: 30px 0 0;
    overflow: auto;
`
const Button = styled.button`
    width: 60px;
    appearance: none;
    background: transparent;
    border: 0;
    margin: 0;
    padding: 0;
    outline: none;
`
const CloseButton = styled(Button)`
    font-size: 16px;
    text-align: right;
    padding-right: 22px;
    padding-top: 2px;
    text-align: right;
`
const Title = styled.span`
    flex: 1;
    text-align: center;
    font-size: 16px;
    font-weight: var(--semiBold);
    padding-top: 18px;
    margin-left: 64px;
`

const FilterModal = ({ title, options, onChange, onClose, selected }: Props) => {
    const onClick = useCallback(
        (value: any) => {
            onChange(value)
        },
        [onChange],
    )
    return (
        <ModalPortal>
            <ModalDialog onClose={onClose} fullpage>
                <ModalContainer>
                    <Header>
                        <Title>{title}</Title>
                        <CloseButton type="button" onClick={onClose}>
                            <span className="icon-cross" />
                        </CloseButton>
                    </Header>
                    <Body>
                        <Dropdown isOpen toggle={() => {}}>
                            {options.map(({ id, value, title: optionTitle }) => (
                                <PopoverItem key={id} value={value} onClick={() => onClick(value)} active={selected === value} leftTick>
                                    {optionTitle}
                                </PopoverItem>
                            ))}
                        </Dropdown>
                    </Body>
                </ModalContainer>
            </ModalDialog>
        </ModalPortal>
    )
}

const FilterModalComponent: FunctionComponent = () => {
    const { api, isOpen, value } = useModal('marketplace.filter')

    if (!isOpen) {
        return null
    }

    const { title, options, selected, onChange, onClear } = value || {}
    return <FilterModal title={title} onChange={onChange} onClear={onClear} onClose={() => api.close()} options={options} selected={selected} />
}

export default FilterModalComponent
