import React, { useEffect, useState, useCallback } from 'react'
import styled from 'styled-components'
import { useDebouncedCallback } from 'use-debounce'
import Button from '$shared/components/Button'
import { MEDIUM } from '$shared/utils/styled'
import { truncate } from '$shared/utils/text'
import { fromAtto } from '$mp/utils/math'
import Text from '$ui/Text'
import SvgIcon from '$shared/components/SvgIcon'
import UnstyledLoadingIndicator from '$shared/components/LoadingIndicator'
import useIsMounted from '$shared/hooks/useIsMounted'
import useDataUnionMembers from '$mp/modules/dataUnion/hooks/useDataUnionMembers'
import useAllDataUnionStats from '$mp/modules/dataUnion/hooks/useAllDataUnionStats'
const Container = styled.div`
    background: #fdfdfd;
    border: 1px solid #efefef;
    border-radius: 4px;
    display: grid;
    grid-template-rows: 72px auto 16px;
`
const LoadingIndicator = styled(UnstyledLoadingIndicator)`
    position: sticky !important;
    top: 58px;
`
const Row = styled.div`
    padding-left: 24px;
    align-items: center;
`
const Heading = styled(Row)`
    font-weight: ${MEDIUM};
    font-size: 14px;
    line-height: 18px;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-column-gap: 32px;
    align-items: center;
    color: #323232;
    border-bottom: 1px solid #efefef;
`
const TableGrid = styled(Row)`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 40px 80px;
    grid-column-gap: 16px;
`
const Table = styled.div`
    overflow: auto;
`
const TableHeader = styled(TableGrid)`
    font-weight: ${MEDIUM};
    font-size: 12px;
    line-height: 16px;
    color: #a3a3a3;
    border-bottom: 1px solid #efefef;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #fdfdfd;

    &:nth-child(3) {
        justify-items: center;
    }
`
const TableRows = styled.div`
    height: ${({ rowCount }) => rowCount * 56}px;
`
const TableRow = styled(TableGrid)`
    font-size: 14px;
    line-height: 56px;
    color: #525252;

    > * {
        opacity: ${({ processing }) => (processing ? 0.5 : 1.0)};
    }

    &:not(:last-child),
    &:nth-child(-n + 3) {
        /* -n+3 means the 3 first children  */
        border-bottom: 1px solid #efefef;
    }
`
const Footer = styled.div`
    border-top: 1px solid #efefef;
`
const RemoveButton = styled(Button).attrs(() => ({
    kind: 'link',
    variant: 'dark',
}))`
    visibility: hidden;
    font-size: 12px !important;

    ${TableRow}:hover & {
        visibility: visible;
    }
`
const Status = styled.div`
    border-radius: 100%;
    background: ${({ status }) => {
        if (status === 'ACTIVE') {
            return '#2AC437'
        } else if (status === 'INACTIVE') {
            return '#D90C25'
        }

        return '#EFEFEF'
    }};
    height: 16px;
    width: 16px;
    justify-self: center;
`
const Disabled = styled.span`
    opacity: 0.5;
`
const SearchContainer = styled.div`
    display: flex;
    margin-right: 16px;
`
const SearchIcon = styled(SvgIcon).attrs({
    name: 'search',
})`
    width: 16px;
    height: 16px;
    color: #a3a3a3;
    position: relative;
    display: flex;
    align-self: center;
    left: 24px;
`
const SearchInput = styled(Text)`
    padding-left: 32px;
`
const CenteredMessage = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 14px;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
`
const Heavy = styled.span`
    font-weight: ${MEDIUM};
`
const Removing = styled.div`
    font-size: 12px;
`
type Props = {
    dataUnion: any
    dataUnionId: string
    chainId: number
    className?: string
}

const ManageMembers = ({ dataUnion, dataUnionId, chainId, className }: Props) => {
    const isMounted = useIsMounted()
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [processingMembers, setProcessingMembers] = useState([])
    const {
        loading: loadingMembers,
        load: loadMembers,
        remove: removeMembers,
        members,
        search: searchMembers,
    } = useDataUnionMembers()
    const loading = loadingMembers || processingMembers.length > 0
    const { loadByDataUnionId: loadDataUnionStats } = useAllDataUnionStats()
    useEffect(() => {
        const load = async () => {
            try {
                if (dataUnionId) {
                    await loadMembers(dataUnionId, chainId)
                }
            } catch (e) {
                console.error('Could not load member list', e)
            }
        }
        load()
    }, [dataUnionId, chainId, loadMembers])
    const debouncedSetSearch = useDebouncedCallback((value) => setSearch(value), 250)
    const onSearchChange = useCallback(
        (e) => {
            const search = e.target.value.trim()
            debouncedSetSearch(search)
        },
        [debouncedSetSearch],
    )
    const removeMember = useCallback(async (memberAddress: string) => {
        setProcessingMembers((prev) => [
            ...prev,
            memberAddress,
        ])
        try {
            await removeMembers(dataUnionId, chainId, [memberAddress])
        } catch (e) {
            console.error('Could not remove member', e)
        } finally {
            if (isMounted()) {
                setProcessingMembers((prev) => prev.filter((member) => member !== memberAddress))
                loadDataUnionStats([dataUnionId])
            }
        }
    }, [dataUnionId, chainId, removeMembers, isMounted, loadDataUnionStats])

    useEffect(() => {
        const doSearch = async () => {
            try {
                if (dataUnionId) {
                    const results = await searchMembers(dataUnionId, search, chainId)

                    if (isMounted()) {
                        setSearchResults(results)
                    }
                }
            } catch (e) {
                console.error('Could not load search results', e)
            }
        }

        doSearch()
    }, [search, dataUnionId, chainId, isMounted, searchMembers])
    const listing = search.length > 0 ? searchResults : members
    return (
        <Container className={className}>
            <Heading>
                Manage members
                <SearchContainer>
                    <SearchIcon />
                    <SearchInput
                        onChange={onSearchChange}
                        name="search"
                        placeholder="Search for any member by ETH address"
                        autoComplete="off"
                    />
                </SearchContainer>
            </Heading>
            <Table>
                <TableHeader>
                    <span>Address</span>
                    <span>Earnings</span>
                    <span>Withdrawable</span>
                    <span>Status</span>
                </TableHeader>
                <LoadingIndicator loading={loading} />
                <TableRows rowCount={4}>
                    {search && search.length > 0 && searchResults.length === 0 && (
                        <CenteredMessage>
                            <span>
                                No members found that match <Heavy>{search}</Heavy>
                            </span>
                        </CenteredMessage>
                    )}
                    {listing.map((member) => {
                        const processing = processingMembers.includes(member.address)
                        return (
                            <TableRow key={member.address} processing={processing}>
                                <span>{truncate(member.address)}</span>
                                {dataUnion && dataUnion.version === 2 ? (
                                    <React.Fragment>
                                        <span>{fromAtto(member.totalEarnings).toFixed(3)}</span>
                                        <span>{fromAtto(member.withdrawableEarnings).toFixed(3)}</span>
                                        <Status status={member.status} />
                                        {processing ? (
                                            <Removing>Removing...</Removing>
                                        ) : (
                                            <RemoveButton onClick={() => removeMember(member.address)}>
                                                Remove
                                            </RemoveButton>
                                        )}
                                    </React.Fragment>
                                ) : (
                                    <React.Fragment>
                                        <Disabled>0.000</Disabled>
                                        <Disabled>0.000</Disabled>
                                        <Status status={member.status} />
                                    </React.Fragment>
                                )}
                            </TableRow>
                        )
                    })}
                    {members.length === 0 && !search && <CenteredMessage>No members at the moment</CenteredMessage>}
                </TableRows>
            </Table>
            <Footer />
        </Container>
    )
}

export default styled(ManageMembers)``
