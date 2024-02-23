import { MetaMaskProvider } from '@metamask/sdk-react'
import './App.css'
import AppRoutes from './routes'
import { AppProvider } from './context/AppContext'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// const queryClient = new QueryClient()

// const projectId = process.env.REACT_APP_WALLET_CONNECT_API_KEY || ''

// const metadata = {
//   name: process.env.REACT_APP_WALLET_APP_NAME || '',
//   description: process.env.REACT_APP_WALLET_APP_DESCRIPTION || '',
//   url: process.env.REACT_APP_WALLET_APP_URL || '', // origin must match your domain & subdomain
//   icons: [process.env.REACT_APP_WALLET_APP_ICON_URL || ''],
// }

// const chains = [bsc, bscTestnet] as const

// const config = defaultWagmiConfig({
//   chains,
//   projectId,
//   metadata,
//   enableWalletConnect: true,
//   enableInjected: true,
//   enableEIP6963: true,
//   enableCoinbase: true,
// })

// createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true,
//   allWallets: 'SHOW',
// })

console.log(process.env.REACT_APP_CHAIN_ID)

function App() {
  return (
    <div className="min-h-screen">
      <MetaMaskProvider
        debug={false}
        sdkOptions={{
          dappMetadata: {
            name: 'Example React Dapp',
            url: window.location.host,
          },
        }}
      >
        {/* <WagmiProvider config={config}> */}
          {/* <QueryClientProvider client={queryClient}> */}
            <AppProvider>
              <AppRoutes />
            </AppProvider>
          {/* </QueryClientProvider> */}
        {/* </WagmiProvider> */}
      </MetaMaskProvider>
    </div>
  )
}

export default App
