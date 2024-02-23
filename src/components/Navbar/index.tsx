import { images } from '../../assets'
import PopupEncloser from '../PopupEncloser/PopupEncloser'
import ConnectWallet from '../Popups/ConnectWallet'
import { useAppContext } from '../../context/AppContext'
import { useSDK } from '@metamask/sdk-react'
import { useAccount, useDisconnect } from 'wagmi'
import { useWeb3ModalState } from '@web3modal/wagmi/react'

const Navbar = () => {
  const { setWalletPopup, walletPopup, walletAddress, setWalletAddress } =
    useAppContext()
  const { connected, sdk, chainId } = useSDK()
  // const { isConnected } = useAccount()
  const isConnected = false
  // const { disconnect } = useDisconnect()

  const toggleOn = () => setWalletPopup(true)
  const toggleOff = () => setWalletPopup(false)

  // const { selectedNetworkId } = useWeb3ModalState()

  const selectedNetworkId = ''

  const disconnectWallet = async () => {
    setWalletAddress('')
    // disconnect()
    sdk?.disconnect()
  }

  return (
    <div className="w-full bg-gradient-to-b from-[#090A0C] to-[#302F34] px-4 md:px-12 py-5 flex flex-col md:flex-row gap-3 justify-between items-center">
      <img src={images.logo} alt="logo" className="h-[75px] w-[329px]" />
      <div className="flex flex-row gap-7">
        <div
          className={`hidden md:flex rounded-full h-14 w-14 flex-col items-center justify-center ${
            connected || isConnected
              ? (isConnected && Number(selectedNetworkId) === Number(process.env.REACT_APP_CHAIN_ID || '')) ||
                chainId === process.env.REACT_APP_CHAIN_STRING_ID
                ? 'bg-gradient-to-b from-green1 to-green2'
                : 'bg-error_red'
              : 'bg-gradient-to-b from-green1 to-green2'
          } p-[2.5px]`}
        >
          <div
            className={`w-full h-full ${
              connected || isConnected
                ? (isConnected && Number(selectedNetworkId) === Number(process.env.REACT_APP_CHAIN_ID || '')) ||
                  chainId === process.env.REACT_APP_CHAIN_STRING_ID 
                  ? 'bg-primary'
                  : 'bg-background_color'
                : 'bg-background_color'
            } rounded-full flex flex-col items-center justify-center`}
          >
            <img
              src={
                connected || isConnected
                  ? (isConnected && Number(selectedNetworkId) === Number(process.env.REACT_APP_CHAIN_ID || '')) ||
                    chainId === process.env.REACT_APP_CHAIN_STRING_ID
                    ? images.binance_black
                    : images.binance
                  : images.binance
              }
              alt="chain_icon"
              className="h-7 w-7"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={(connected || isConnected) ? disconnectWallet : toggleOn}
          className={`${
            connected || isConnected
              ? (isConnected && Number(selectedNetworkId) === Number(process.env.REACT_APP_CHAIN_ID || '')) ||
                chainId === process.env.REACT_APP_CHAIN_STRING_ID
                ? 'bg-primary'
                : 'bg-error_red'
              : 'bg-primary'
          } rounded-[100px] px-6 h-14 flex flex-row gap-2.5 items-center`}
        >
          <img
            src={images.wallet}
            alt="wallet_icon"
            className="w-6 h-6"
            width={24}
            height={19}
          />
          <div className="font-semibold text-lg text-black font-Jost">
            {walletAddress
              ? walletAddress.substring(0, 5) +
                '....' +
                walletAddress?.slice(-5)
              : 'Connect Wallet'}
          </div>
        </button>
      </div>
      <PopupEncloser show={walletPopup} close={toggleOff}>
        <ConnectWallet close={toggleOff} />
      </PopupEncloser>
    </div>
  )
}

export default Navbar
