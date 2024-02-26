import { useSDK } from '@metamask/sdk-react'
import { useAppContext } from '../../context/AppContext'
import Image from 'next/image'
import { useWeb3Modal } from '@web3modal/wagmi/react'

type ConnectWalletProps = {
  close: () => void
}

const ConnectWallet: React.FC<ConnectWalletProps> = (props) => {
  const { close } = props
  const { setWalletAddress, setWalletPopup } = useAppContext()
  const { sdk } = useSDK()

  const connect = async () => {
    try {
      setWalletPopup(false)
      const accounts: any = await sdk?.connect()
      setWalletAddress(accounts?.[0])
    } catch (err) {
      console.warn(`failed to connect..`, err)
    }
  }

  const { open } = useWeb3Modal()

  const connectWallet = () => {
    setWalletPopup(false)
    open()
  }

  return (
    <div className="bg-popup_bg rounded-2xl px-14 text-white py-10 my-6">
      <div className="font-Urbanist text-[22px]">Connect Wallet</div>
      <div className="font-Roboto text-lg mb-12">
        Connect with one of the available wallet providers
      </div>
      <div className="flex flex-col gap-3.5 mb-9">
        <div
          onClick={connect}
          role="button"
          className="p-6 bg-grey_bg rounded-lg cursor-pointer flex flex-row gap-6 items-center"
        >
          <Image
            src="/images/metamask.svg"
            alt="metamask"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <div className="flex flex-col gap-1">
            <div className="text-lg font-Roboto">Metamask</div>
            <div className="py-1 px-2 rounded-xl bg-primary flex flex-row items-center w-fit">
              <div className="font-Roboto text-xs text-black font-medium">
                Popular
              </div>
            </div>
          </div>
        </div>
        <div onClick={connectWallet} className="p-6 bg-grey_bg rounded-lg cursor-pointer flex flex-row gap-6 items-center">
          <Image
            src="/images/wallet_connect.svg"
            alt="walletconnect"
            width={48}
            height={48}
            className="w-12 h-12"
          />
          <div className="text-lg font-Roboto">Wallet Connect</div>
        </div>
      </div>
      <div className="font-Urbanist text-lg font-semibold mb-2.5">
        Suggestions for connecting a wallet
      </div>
      <ul className="list-disc ml-4 flex flex-col gap-2.5 marker:text-primary mb-6">
        <li className="font-Roboto text-sm">
          If you’re on Desktop, try MetaMask
        </li>
        <li className="font-Roboto text-sm">
          If you’re on Mobile, try WalletConnect
        </li>
      </ul>
      <button
        type="button"
        onClick={close}
        className="py-2 px-4 border font-Urbanist font-semibold border-primary rounded-lg text-primary"
      >
        Close
      </button>
    </div>
  )
}

export default ConnectWallet
