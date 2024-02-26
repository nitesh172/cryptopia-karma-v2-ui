import Navbar from '@/components/Navbar'
import { AppProvider } from '@/context/AppContext'
import '@/styles/globals.css'
import { MetaMaskProvider } from '@metamask/sdk-react'
import type { AppProps } from 'next/app'
import { Jost, Orbitron, Roboto, Urbanist } from 'next/font/google'
import { envConfig } from '../config'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
})

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
})

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
})

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700', '100', '100', '300'],
  variable: '--font-roboto',
})

const queryClient = new QueryClient()

const projectId = envConfig.WALLET_CONNECT_API_KEY || ''

const metadata = {
  name: envConfig.WALLET_APP_NAME || '',
  description: envConfig.WALLET_APP_DESCRIPTION || '',
  url: envConfig.WALLET_APP_URL || '', // origin must match your domain & subdomain
  icons: [envConfig.WALLET_APP_ICON_URL || ''],
}

const chains = [bsc, bscTestnet] as const

const config = defaultWagmiConfig({
  chains: chains,
  projectId,
  metadata,
  ssr: true,
  enableWalletConnect: true,
  enableInjected: false,
  enableEIP6963: true,
  enableCoinbase: true,
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  allWallets: 'SHOW',
  excludeWalletIds: ['c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96']
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MetaMaskProvider
          debug={false}
          sdkOptions={{
            dappMetadata: {
              name: 'Example React Dapp',
            },
            forceInjectProvider: false,
          }}
        >
          <AppProvider>
            <div
              className={`${orbitron.variable} ${jost.variable} ${urbanist.variable} ${roboto.variable} font-sans`}
            >
              <Navbar />
              <Component {...pageProps} />
            </div>
          </AppProvider>
        </MetaMaskProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
