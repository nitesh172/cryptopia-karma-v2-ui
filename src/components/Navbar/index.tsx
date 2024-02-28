'use client'
import { envConfig } from '@/config'
import Image from 'next/image'
import { useAccount } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'

const Navbar = () => {
  const { isConnected, chain, address } = useAccount()

  const { open } = useWeb3Modal()

  const chainStatus = isConnected
    ? chain?.id.toString() === envConfig.CHAIN_ID
      ? 'bg-gradient-to-b from-green1 to-green2'
      : 'bg-error_red'
    : 'bg-gradient-to-b from-green1 to-green2'

  const chainInnerDiv = isConnected
    ? chain?.id.toString() === envConfig.CHAIN_ID
      ? 'bg-primary'
      : 'bg-background_color'
    : 'bg-background_color'

  const bnbImage = isConnected
    ? chain?.id.toString() === envConfig.CHAIN_ID
      ? '/images/binance_black.svg'
      : '/images/binance.svg'
    : '/images/binance.svg'

  const connectWalletButton = isConnected
    ? chain?.id.toString() === envConfig.CHAIN_ID
      ? 'bg-primary'
      : 'bg-error_red'
    : 'bg-primary'

  return (
    <div className="w-full bg-gradient-to-b from-[#090A0C] to-[#302F34] px-4 md:px-12 py-5 flex flex-col md:flex-row gap-3 justify-between items-center">
      <Image
        src="/images/logo.png"
        alt="logo"
        className="h-[75px] w-[329px]"
        height={75}
        width={329}
        loading='eager'
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
              loading='eager'
              className="h-7 w-7"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => open()}
          className={`${connectWalletButton} rounded-[100px] px-6 h-14 flex flex-row gap-2.5 items-center`}
        >
          <Image
            src="/images/wallet.svg"
            alt="wallet_icon"
            className="w-6 h-6"
            width={24}
            loading='eager'
            height={24}
          />
          <div className="font-semibold text-lg text-black font-Jost">
            {address
              ? chain?.id.toString() === envConfig.CHAIN_ID
                ? address.substring(0, 5) + '....' + address?.slice(-5)
                : 'Invalid Chain!'
              : 'Connect Wallet'}
          </div>
        </button>
      </div>
    </div>
  )
}

export default Navbar
