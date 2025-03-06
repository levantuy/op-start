import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'

import logo from './assets/react.svg'

import { RouterProvider, Outlet, createBrowserRouter } from 'react-router-dom'
import { queryClient } from './global-context/queryClient'
import { rainbowKitWagmiConfig } from './global-context/rainbowKitWagmiConfig'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { Layout } from './components/Layout'
import { HeaderLeft } from './components/header/HeaderLeft'
import { HeaderRight } from './components/header/HeaderRight'
import { Home } from './components/routes/Home'
import { Bridge } from './components/routes/Bridge'
import { ThemeProvider } from './providers/ThemeProvider'
import { Toaster } from './components/base/toast/toaster'
import { MixpanelContextProvider } from './global-context/mixpanelContext'
import mixpanel from 'mixpanel-browser'
import { Transfer } from './components/routes/Transfer'
import { NftMint } from './components/routes/NftMint'
import { Monad } from './components/routes/Monad'
import { Marketplace } from './components/routes/Marketplace'
import { AccountNft } from './components/routes/AccountNft'

const classNames = {
  app: 'app w-full min-h-screen flex flex-col',
}

type ProviderProps = {
  children: React.ReactNode
}

const Providers = ({ children }: ProviderProps) => (
  <WagmiProvider reconnectOnMount config={rainbowKitWagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <MixpanelContextProvider value={mixpanel}>
          <ThemeProvider>
            <>
              {children}
              <Toaster />
            </>
          </ThemeProvider>
        </MixpanelContextProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
)

const bridgeRoutes = [
  { index: true, element: <Bridge action="deposit" /> },
  { path: 'deposit', element: <Bridge action="deposit" /> },
  { path: 'withdraw', element: <Bridge action="withdrawal" /> },
]

const playgroundRoutes = [
  { index: true, element: <Transfer /> }
]

const AppRoot = () => {
  return (
    <Providers>
      <div className={classNames.app}>
        <Layout
          headerLeft={<HeaderLeft logo={logo} />}
          headerRight={<HeaderRight />}
        >
          <Outlet />
        </Layout>
      </div>
    </Providers>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppRoot />,
    children: [
      { index: true, element: <Home /> },
      { path: '/bridge', children: bridgeRoutes },
      { path: '/playground', children: playgroundRoutes },
      { path: '/nft-mint', element: <NftMint /> },
      { path: '/monad', element: <Monad /> },
      { path: '/marketplace', element: <Marketplace /> },
      { path: '/account-nft', element: <AccountNft /> },
    ],
  },
])

export const App = () => {
  return <RouterProvider router={router} />
}