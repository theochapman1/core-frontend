import React from 'react'
import cx from 'classnames'
import DetailsContainer from '$shared/components/Container/Details'
import { isDataUnionProduct, isPaidProduct } from '$mp/utils/product'
import useEditableState from '$shared/contexts/Undo/useEditableState'
import { productStates } from '$shared/utils/constants'
import { productTypes } from '$mp/utils/constants'
import EditorNav from './EditorNav'
import ProductName from './ProductName'
import CoverImage from './CoverImage'
import ProductDescription from './ProductDescription'
import ProductChain from './ProductChain'
import ProductStreams from './ProductStreams'
import PriceSelector from './PriceSelector'
import PaymentToken from './PaymentToken'
import ProductType from './ProductType'
import ProductBeneficiary from './ProductBeneficiary'
import ProductDetails from './ProductDetails'
import Whitelist from './Whitelist'
import SharedSecrets from './SharedSecrets'
import TermsOfUse from './TermsOfUse'
import DataUnionDeployment from './DataUnionDeployment'
import styles from './editor.pcss'

type Props = {
    disabled?: boolean
}

const Editor = ({ disabled }: Props) => {
    const { state: product } = useEditableState()
    const isDataUnion = isDataUnionProduct(product)
    const isPaid = isPaidProduct(product)
    const isChainSelectorDisabled =
        product.state === productStates.DEPLOYED ||
        (product.type === productTypes.DATAUNION && product.beneficiaryAddress != null)
    return (
        <div className={cx(styles.root, styles.Editor)}>
            <DetailsContainer className={styles.container}>
                <div className={styles.grid}>
                    <div className={styles.nav}>
                        <EditorNav />
                    </div>
                    <div className={styles.info}>
                        <ProductName disabled={disabled} />
                        <CoverImage disabled={disabled} />
                        <ProductDescription disabled={disabled} />
                        <ProductStreams disabled={disabled} />
                        <ProductType disabled={disabled} />
                        {(isDataUnion || isPaid) && (
                            <ProductChain disabled={disabled || isChainSelectorDisabled} />
                        )}
                        {(isDataUnion && !isChainSelectorDisabled) && (
                            <DataUnionDeployment
                                // NOTE: We want to remount component when chain changes
                                // so that we reset the list of selectable data unions.
                                key={`${product.id}-${product.chain}`}
                                disabled={disabled}
                            />
                        )}
                        {isPaid && (
                            <React.Fragment>
                                <PaymentToken disabled={disabled} />
                                <PriceSelector disabled={disabled} />
                                {!isDataUnion && <ProductBeneficiary disabled={disabled} />}
                            </React.Fragment>
                        )}
                        <ProductDetails disabled={disabled} />
                        {!!isPaid && <Whitelist disabled={disabled} />}
                        <TermsOfUse disabled={disabled} />
                        {!!isDataUnion && <SharedSecrets disabled={disabled} />}
                    </div>
                </div>
            </DetailsContainer>
        </div>
    )
}

export default Editor
