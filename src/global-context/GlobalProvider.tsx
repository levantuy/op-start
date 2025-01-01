import { MixpanelContextProvider } from './mixpanelContext'
import { queryClient } from './queryClient'
import { rainbowKitWagmiConfig } from './rainbowKitWagmiConfig'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClientProvider } from '@tanstack/react-query'
import mixpanel from 'mixpanel-browser'
import { WagmiProvider } from 'wagmi'

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={rainbowKitWagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <MixpanelContextProvider value={mixpanel}>
            {children}
          </MixpanelContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
