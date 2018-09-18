// @flow

import React, { Component } from 'react'
import BN from 'bignumber.js'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { Container, Button } from 'reactstrap'
import { Translate } from '@streamr/streamr-layout'

import links from '../../links'
import type { Filter, SearchFilter, CategoryFilter, SortByFilter } from '../../flowtype/product-types'
import type { Category } from '../../flowtype/category-types'
import { isValidSearchQuery } from '../../utils/validate'
import withI18n from '../../containers/WithI18n/index'

import SearchInput from './SearchInput/index'
import FilterSelector from './FilterSelector/index'
import FilterDropdownItem from './FilterDropdownItem/index'
import styles from './actionBar.pcss'

export type Props = {
    filter: Filter,
    categories: ?Array<Category>,
    onCategoryChange: (filter: Filter) => void,
    onSortChange: (filter: Filter) => void,
    onSearchChange: (filter: Filter) => void,
    translate: (key: string, options: any) => string,
}

class ActionBar extends Component<Props> {
    static sortByOptions = ['pricePerSecond', 'free']

    onSearchChange = (search: SearchFilter) => {
        if (isValidSearchQuery(search)) {
            this.props.onSearchChange({
                ...this.props.filter,
                search,
            })
        }
    }

    onCategoryChange = (category: ?CategoryFilter) => {
        this.props.onCategoryChange({
            ...this.props.filter,
            categories: category,
        })
    }

    onSortByChange = (sortBy: ?SortByFilter) => {
        if (sortBy === 'free') {
            this.props.onSortChange({
                ...this.props.filter,
                sortBy: null,
                maxPrice: '0',
            })
        } else {
            this.props.onSortChange({
                ...this.props.filter,
                maxPrice: null,
                sortBy,
            })
        }
    }

    onSortBySelect = (sortBy: ?SortByFilter, dropdownValue: string) => (
        (sortBy === 'pricePerSecond' && dropdownValue === 'pricePerSecond') ||
        (BN(this.props.filter.maxPrice).isEqualTo('0') && dropdownValue === 'free')
    )

    currentCategoryFilter = () => {
        const { filter: { categories: category }, categories } = this.props
        const categoryFilter = categories ? categories.find((c) => c.id === category) : null
        return categoryFilter && categoryFilter.name
    }

    currentSortByFilter = () => {
        const opt = BN(this.props.filter.maxPrice).isEqualTo('0') ?
            ActionBar.sortByOptions.find((o) => o === 'free') :
            ActionBar.sortByOptions.find((o) => o === this.props.filter.sortBy)

        return opt ? this.props.translate(`actionBar.sortOptions.${opt}`) : null
    }

    render() {
        const { filter: { search, categories: category, sortBy, maxPrice }, categories } = this.props
        return (
            <div className={styles.actionBar}>
                <SearchInput value={search} onChange={this.onSearchChange} />
                <div className={styles.searchFilter}>
                    <Container fluid className={styles.actionBarContainer}>
                        <ul>
                            <li>
                                <FilterSelector
                                    title={this.props.translate('actionBar.category')}
                                    selected={this.currentCategoryFilter()}
                                    onClear={() => this.onCategoryChange(null)}
                                    className={(category === null) ? '' : styles.activeFilter}
                                >
                                    {!!categories && categories.map((c) => (
                                        <FilterDropdownItem
                                            key={c.id}
                                            value={c.id}
                                            selected={c.id === category}
                                            onSelect={this.onCategoryChange}
                                        >
                                            {c.name}
                                        </FilterDropdownItem>
                                    ))}
                                </FilterSelector>
                            </li>
                            <li>
                                <FilterSelector
                                    title={this.props.translate('actionBar.sortBy')}
                                    selected={this.currentSortByFilter()}
                                    onClear={() => this.onSortByChange(null)}
                                    className={(sortBy === null && maxPrice === null) ? '' : styles.activeFilter}
                                >
                                    {ActionBar.sortByOptions.map((option) => (
                                        <FilterDropdownItem
                                            key={option}
                                            value={option}
                                            selected={this.onSortBySelect(sortBy, option)}
                                            onSelect={this.onSortByChange}
                                        >
                                            <Translate value={`actionBar.sortOptions.${option}`} />
                                        </FilterDropdownItem>
                                    ))}
                                </FilterSelector>
                            </li>
                            <li className={classNames('hidden-sm-down', styles.createProduct)}>
                                <Link to={links.createProduct}>
                                    <Button className={styles.createProductButton} color="secondary" outline>
                                        <Translate value="actionBar.create" />
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </Container>
                </div>
            </div>
        )
    }
}

export default withI18n(ActionBar)
