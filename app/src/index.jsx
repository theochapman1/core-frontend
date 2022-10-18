// @flow

import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './app'
import store from './store'

const root = createRoot(document.getElementById("root"))

if (root) {
    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    )
} else {
    throw new Error('Root element could not be found.')
}
