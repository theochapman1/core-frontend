import Web3 from 'web3'

const SetEthereumProvider = 'set ethereum provider'

export function setProviderAction(payload) {
    return {
        type: SetEthereumProvider,
        payload,
    }
}

const initialState = {
    ethereumProvider: undefined,
    web3: undefined,
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SetEthereumProvider:
            return {
                ...state,
                ethereumProvider: action.payload,
                web3: action.payload ? new Web3(action.payload) : void 0,
            }
        default:
    }

    return state
}
