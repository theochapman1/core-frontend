import React, { forwardRef } from 'react'
import { cleanup, screen, render, fireEvent, waitFor } from '@testing-library/react'
jest.mock('$shared/components/ModalPortal', () => ({
    __esModule: true,
    default: ({ children }) => children || null,
}))
const mockGetImage = jest.fn(() => ({
    width: 100,
    height: 100,
    toBlob: (resolve) => resolve('image'),
}))
jest.doMock('react-avatar-editor', () => ({
    __esModule: true,
    // eslint-disable-next-line react/display-name
    default: forwardRef((props, ref: any) => {
        // eslint-disable-next-line no-param-reassign
        ref.current = {
            getImage: mockGetImage,
        }
        return <div id="AvatarEditor" />
    }),
}))

/* eslint-disable object-curly-newline */
describe('CropImageModal', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        jest.restoreAllMocks()
    })
    afterEach(cleanup)
    describe('getResizedBlob', () => {
        it('returns the same canvas if smaller than max width', async () => {
            const { getResizedBlob, MAX_WIDTH } = await import('.')
            const originalCanvas = {
                width: 100,
                height: 100,
                // @ts-ignore
                toBlob: (resolve) => resolve('image'),
            } as Partial<HTMLCanvasElement>
            expect(originalCanvas.width).toBeLessThanOrEqual(MAX_WIDTH)
            const result = await getResizedBlob(originalCanvas as HTMLCanvasElement)
            expect(result).toBe('image')
        })
        it('returns a resized canvas if smaller than max width', async () => {
            const { getResizedBlob, MAX_WIDTH } = await import('.')
            const nextCanvas = {
                width: undefined,
                height: undefined,
                getContext: () => ({
                    drawImage: jest.fn(),
                }),
                toBlob: (resolve) => resolve('nextImage'),
            }
            jest.spyOn(document, 'createElement').mockImplementation((): any => nextCanvas)
            const originalCanvas = {
                width: 2000,
                height: 2000,
            } as Partial<HTMLCanvasElement>
            expect(originalCanvas.width).toBeGreaterThan(MAX_WIDTH)
            const result = await getResizedBlob(originalCanvas as HTMLCanvasElement)
            expect(result).toBe('nextImage')
            expect(nextCanvas.width).toBe(MAX_WIDTH)
        })
    })
    it('renders the avatar editor', async () => {
        const { default: CropImageModal } = await import('.')
        render(<CropImageModal imageUrl="http://" onClose={jest.fn()} onSave={jest.fn()} />)
        expect(screen.getByText(/Scale and crop your image/)).toBeInTheDocument()
    })
    it('closes the modal', async () => {
        const { default: CropImageModal } = await import('.')
        const closeStub = jest.fn()
        render(<CropImageModal imageUrl="http://" onClose={closeStub} onSave={jest.fn()} />)
        fireEvent.click(screen.getByText(/cancel/i))
        expect(closeStub).toHaveBeenCalled()
    })
    it('calls the save prop with edited image', async () => {
        const { default: CropImageModal } = await import('.')
        const saveStub = jest.fn()
        render(<CropImageModal imageUrl="http://" onClose={jest.fn()} onSave={saveStub} />)
        fireEvent.click(screen.getByText(/apply/i))
        // `onSave` gets called within an async function, after `await`.
        await waitFor(() => expect(saveStub).toHaveBeenCalled())
    })
})
