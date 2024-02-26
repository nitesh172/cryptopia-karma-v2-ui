import PopupEncloser from '../PopupEncloser/PopupEncloser'
import ConnectWallet from '../Popups/ConnectWallet'
import { useAppContext } from '../../context/AppContext'
import { useSDK } from '@metamask/sdk-react'
import { envConfig } from '../../config'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

const Navbar = () => {
  const { setWalletPopup, walletPopup, walletAddress, setWalletAddress } =
    useAppContext()
  const { connected, sdk, chainId } = useSDK()
  const { isConnected, chain } = useAccount()

  const toggleOn = () => setWalletPopup(true)
  const toggleOff = () => setWalletPopup(false)

  const { open } = useWeb3Modal()

  const disconnectWallet = async () => {
    if (connected) {
      setWalletAddress('')
      sdk?.terminate()
    }
  }

  const chainStatus = (connected || isConnected)
    ? (chainId === envConfig.CHAIN_STRING_ID || chain?.id.toString() === envConfig.CHAIN_ID)
      ? 'bg-gradient-to-b from-green1 to-green2'
      : 'bg-error_red'
    : 'bg-gradient-to-b from-green1 to-green2'

  const chainInnerDiv = (connected || isConnected)
    ? (chainId === envConfig.CHAIN_STRING_ID || chain?.id.toString() === envConfig.CHAIN_ID)
      ? 'bg-primary'
      : 'bg-background_color'
    : 'bg-background_color'

  const bnbImage = (connected || isConnected)
    ? (chainId === envConfig.CHAIN_STRING_ID || chain?.id.toString() === envConfig.CHAIN_ID)
      ? '/images/binance_black.svg'
      : '/images/binance.svg'
    : '/images/binance.svg'

  const connectWalletButton = (connected || isConnected)
    ? (chainId === envConfig.CHAIN_STRING_ID || chain?.id.toString() === envConfig.CHAIN_ID)
      ? 'bg-primary'
      : 'bg-error_red'
    : 'bg-primary'

  return (
    <div className="w-full bg-gradient-to-b from-[#090A0C] to-[#302F34] px-4 md:px-12 py-5 flex flex-col md:flex-row gap-3 justify-between items-center">
      <Image
        src="/images/logo.png"
        alt="logo"
        className="h-[75px] w-[329px]"
        width={329}
        height={329}
      />
      <div className="flex flex-row gap-7">
        <div
          className={`hidden md:flex rounded-full h-14 w-14 flex-col items-center justify-center ${chainStatus} p-[2.5px]`}
        >
          <div
            className={`w-full h-full ${chainInnerDiv} rounded-full flex flex-col items-center justify-center`}
          >
            <Image
              src={bnbImage}
              alt="chain_icon"
              width={28}
              height={28}
              className="h-7 w-7"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={
            connected ? disconnectWallet : isConnected ? () => open() : toggleOn
          }
          className={`${connectWalletButton} rounded-[100px] px-6 h-14 flex flex-row gap-2.5 items-center`}
        >
          <Image
            src="/images/wallet.svg"
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
