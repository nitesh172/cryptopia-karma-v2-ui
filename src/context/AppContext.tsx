'use client'
import { envConfig } from '@/config'
import { createContext, ReactNode, useContext, useState } from 'react'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider, cookieStorage, createStorage } from 'wagmi'
import { bsc, bscTestnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export type AppContextType = {
  setLoaderText: (value: string) => void
  loaderText: string
  setLoaderPopup: (value: boolean) => void
  loaderPopup: boolean
  totalSupply: string
  setTotalSupply: (value: string) => void
  totalMinted: string
  setTotalMinted: (value: string) => void
  nftImage: string
  setNftImage: (value: string) => void
  tokenID: string
  setTokenID: (value: string) => void
  selectToken: string
  setSelectToken: (value: string) => void
  loading: boolean
  setLoading: (value: boolean) => void
}

const AppContext: any = createContext<AppContextType>({} as AppContextType)
export type AppProviderProps = {
  children?: ReactNode
}

export const useAppContext = () => {
  return useContext<AppContextType>(AppContext)
}

const queryClient = new QueryClient()

const projectId = envConfig.WALLET_CONNECT_API_KEY || ''

const walletMetaData = {
  name: envConfig.WALLET_APP_NAME || '',
  description: envConfig.WALLET_APP_DESCRIPTION || '',
  url: envConfig.WALLET_APP_URL || '',
  icons: [envConfig.WALLET_APP_ICON_URL || ''],
}

const chains = [bsc, bscTestnet] as const

const config = defaultWagmiConfig({
  chains: chains,
  projectId,
  metadata: walletMetaData,
  ssr: true,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: false,
  enableCoinbase: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  allWallets: 'SHOW',
})

export const AppProvider = (props: AppProviderProps) => {
  const { children } = props

  const [loaderText, setLoaderText] = useState<string>('')
  const [loaderPopup, setLoaderPopup] = useState<boolean>(false)
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [totalMinted, setTotalMinted] = useState<string>('')
  const [nftImage, setNftImage] = useState<string>('')
  const [tokenID, setTokenID] = useState<string>('')
  const [selectToken, setSelectToken] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const defaultContext: AppContextType = {
    ...props,
    setLoaderPopup,
    loaderPopup,
    setLoaderText,
    loaderText,
    totalMinted,
    setTotalMinted,
    setTotalSupply,
    totalSupply,
    setNftImage,
    nftImage,
    tokenID,
    setTokenID,
    selectToken,
    setSelectToken,
    loading,
    setLoading,
  }

  return (
    <AppContext.Provider value={defaultContext}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </AppContext.Provider>
  )
}
