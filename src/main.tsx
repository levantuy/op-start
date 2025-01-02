import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import mixpanel from 'mixpanel-browser'

import { envVars } from './envVars'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  (() => {
    mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN)
    mixpanel.register_once({
      app: 'superchain-relayer',
    })

    if (envVars.VITE_ENVIRONMENT === 'development') {
      mixpanel.disable()
    }

    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  })(),
)
