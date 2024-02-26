import { useSDK } from '@metamask/sdk-react'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useAccount } from 'wagmi'

export type AppContextType = {
  setWalletAddress: (value: string) => void
  walletAddress: string
  setLoaderText: (value: string) => void
  loaderText: string
  setWalletPopup: (value: boolean) => void
  walletPopup: boolean
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
}

const AppContext: any = createContext<AppContextType>({} as AppContextType)
export type AppProviderProps = {
  children?: ReactNode
}

export const useAppContext = () => {
  return useContext<AppContextType>(AppContext)
}

export const AppProvider = (props: AppProviderProps) => {
  const { children } = props
  const { connected, account } = useSDK()

  const { address, isConnected } = useAccount()

  const [walletAddress, setWalletAddress] = useState<string>('')
  const [loaderText, setLoaderText] = useState<string>('')
  const [walletPopup, setWalletPopup] = useState<boolean>(false)
  const [loaderPopup, setLoaderPopup] = useState<boolean>(false)
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [totalMinted, setTotalMinted] = useState<string>('')
  const [nftImage, setNftImage] = useState<string>('')
  const [tokenID, setTokenID] = useState<string>('')

  useEffect(() => {
    if (connected) {
      let walletAddress = account ? account : ''
      setWalletAddress(walletAddress)
    } else if (isConnected && address) {
      setWalletAddress(address)
    } else {
      setWalletAddress('')
    }

  }, [connected, isConnected])

  const defaultContext: AppContextType = {
    ...props,
    setWalletAddress,
    walletAddress,
    setWalletPopup,
    walletPopup,
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
  }

  return (
    <AppContext.Provider value={defaultContext}>{children}</AppContext.Provider>
  )
}
