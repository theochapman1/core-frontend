import assert from 'assert-diff'
import sinon from 'sinon'

import * as all from '../../../../modules/createContractProduct/services'
import * as utils from '../../../../utils/smartContract'

describe('Product services', () => {
    let sandbox
    beforeEach(() => {
        sandbox = sinon.sandbox.create()
    })

    afterEach(() => {
        sandbox.restore()
    })

    describe('createContractProduct', () => {
        let exampleProduct
        beforeEach(() => {
            exampleProduct = {
                id: '1234abcdef',
                name: 'Awesome Granite Sausages',
                description: 'Minus dolores reprehenderit velit. Suscipit excepturi iure ea asperiores nam dolores nemo. Et repellat inventore.',
                category: 'dfd',
                streams: [],
                previewStream: null,
                dateCreated: '2018-03-27T08:51:37.261Z',
                lastUpdated: '2018-03-27T08:51:37.261Z',
                ownerAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                beneficiaryAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                pricePerSecond: 63,
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: 0,
                imageUrl: null,
            }
        })
        it('must fail if no id', (done) => {
            const createContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    id: null,
                })
            } catch (e) {
                assert(/No id/.test(e.message))
                done()
            }
        })
        it('must transform the currency to number', () => {
            const createContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            all.createContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            all.createContractProduct({
                ...exampleProduct,
                priceCurrency: 'DATA',
            })
            assert(createContractProductStub.calledTwice)
            assert.equal(1, createContractProductStub.getCall(0).args[4])
            assert.equal(0, createContractProductStub.getCall(1).args[4])
        })
        it('must fail if price is 0', (done) => {
            const createContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    pricePerSecond: 0,
                })
            } catch (e) {
                assert(e.message.match(/product price/i))
                done()
            }
        })
        it('must fail if price is negative', (done) => {
            const createContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    pricePerSecond: -3,
                })
            } catch (e) {
                assert(e.message.match(/product price/i))
                done()
            }
        })
        it('must fail if invalid currency', (done) => {
            const createContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: createContractProductStub,
                },
            }))
            try {
                all.createContractProduct({
                    ...exampleProduct,
                    priceCurrency: 'foobar',
                })
            } catch (e) {
                assert(e.message.match('Invalid currency: foobar'))
                done()
            }
        })
        it('must call send with correct object', (done) => {
            sandbox.stub(utils, 'send').callsFake((a) => {
                assert.equal('test', a)
                done()
            })
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: () => 'test',
                },
            }))
            all.createContractProduct(exampleProduct)
        })
        it('must return the result of send', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: () => {
                    },
                },
            }))
            assert.equal('test', all.createContractProduct(exampleProduct))
        })
        it('must call createProduct with correct params (when DATA)', () => {
            const createProductSpy = sandbox.spy()
            sandbox.stub(utils, 'send')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: createProductSpy,
                },
            }))
            all.createContractProduct(exampleProduct)
            assert(createProductSpy.calledOnce)
            assert(createProductSpy.calledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000000000000',
                0,
                0,
            ))
        })
        it('must call createProduct with correct params (when USD)', () => {
            const createProductSpy = sandbox.spy()
            sandbox.stub(utils, 'send')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: createProductSpy,
                },
            }))
            all.createContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            assert(createProductSpy.calledOnce)
            assert(createProductSpy.calledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000',
                1,
                0,
            ))
        })
    })

    describe('updateContractProduct', () => {
        let exampleProduct
        beforeEach(() => {
            exampleProduct = {
                id: '1234abcdef',
                name: 'Awesome Granite Sausages',
                description: 'Minus dolores reprehenderit velit. Suscipit excepturi iure ea asperiores nam dolores nemo. Et repellat inventore.',
                category: 'dfd',
                streams: [],
                previewStream: null,
                dateCreated: '2018-03-27T08:51:37.261Z',
                lastUpdated: '2018-03-27T08:51:37.261Z',
                ownerAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                beneficiaryAddress: '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                pricePerSecond: 63,
                priceCurrency: 'DATA',
                minimumSubscriptionInSeconds: 0,
                imageUrl: null,
            }
        })
        it('must fail if no id', (done) => {
            const updateContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    id: null,
                })
            } catch (e) {
                assert(/No id/.test(e.message))
                done()
            }
        })
        it('must transform the currency to number', () => {
            const updateContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            all.updateContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            all.updateContractProduct({
                ...exampleProduct,
                priceCurrency: 'DATA',
            })
            assert(updateContractProductStub.calledTwice)
            assert.equal(1, updateContractProductStub.getCall(0).args[4])
            assert.equal(0, updateContractProductStub.getCall(1).args[4])
        })
        it('must fail if price is 0', (done) => {
            const updateContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    pricePerSecond: 0,
                })
            } catch (e) {
                assert(e.message.match(/product price/i))
                done()
            }
        })
        it('must fail if price is negative', (done) => {
            const updateContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    pricePerSecond: -3,
                })
            } catch (e) {
                assert(e.message.match(/product price/i))
                done()
            }
        })
        it('must fail if invalid currency', (done) => {
            const updateContractProductStub = sinon.stub().callsFake(() => ({
                send: () => 'test',
            }))
            sandbox.stub(utils, 'send').callsFake((method) => method.send())
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    updateProduct: updateContractProductStub,
                },
            }))
            try {
                all.updateContractProduct({
                    ...exampleProduct,
                    priceCurrency: 'foobar',
                })
            } catch (e) {
                assert(e.message.match('Invalid currency: foobar'))
                done()
            }
        })
        it('must call send with correct object', (done) => {
            sandbox.stub(utils, 'send').callsFake((a) => {
                assert.equal('test', a)
                done()
            })
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    updateProduct: () => 'test',
                },
            }))
            all.updateContractProduct(exampleProduct)
        })
        it('must return the result of send', () => {
            sandbox.stub(utils, 'send').callsFake(() => 'test')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    updateProduct: () => {
                    },
                },
            }))
            assert.equal('test', all.updateContractProduct(exampleProduct))
        })
        it('must call updateProduct with correct params (when DATA)', () => {
            const updateProductSpy = sandbox.spy()
            sandbox.stub(utils, 'send')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: updateProductSpy,
                },
            }))
            all.createContractProduct(exampleProduct)
            assert(updateProductSpy.calledOnce)
            assert(updateProductSpy.calledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000000000000',
                0,
                0,
            ))
        })
        it('must call updateProductSpy with correct params (when USD)', () => {
            const updateProductSpy = sandbox.spy()
            sandbox.stub(utils, 'send')
            sandbox.stub(utils, 'getContract').callsFake(() => ({
                methods: {
                    createProduct: updateProductSpy,
                },
            }))
            all.createContractProduct({
                ...exampleProduct,
                priceCurrency: 'USD',
            })
            assert(updateProductSpy.calledOnce)
            assert(updateProductSpy.calledWith(
                '0x1234abcdef',
                'Awesome Granite Sausages',
                '0xaf16ea680090e81af0acf5e2664a19a37f5a3c43',
                '63000000000',
                1,
                0,
            ))
        })
    })
})
