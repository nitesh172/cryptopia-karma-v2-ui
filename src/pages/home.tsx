import { useSDK } from '@metamask/sdk-react'
import { images } from '../assets'
import { Contract, ContractAbi, Web3, utils } from 'web3'
import { ERC20_ABI } from '../assets/token_contract'
import NFT_ABI from '../assets/contract_test.json'
import PopupEncloser from '../components/PopupEncloser/PopupEncloser'
import { useAppContext } from '../context/AppContext'
import LoaderPopup from '../components/Popups/LoaderPopup'
import { hexToString } from 'web3-utils'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useWeb3ModalState } from '@web3modal/wagmi/react'

const Home = () => {
  const { provider, connected, chainId, ready } = useSDK()

  const {
    loaderPopup,
    setLoaderPopup,
    setLoaderText,
    setTotalMinted,
    setTotalSupply,
    totalMinted,
    totalSupply,
    setTokenID,
    setNftImage,
  } = useAppContext()

  const openLoaderPopup = () => setLoaderPopup(true)
  const closeLoaderPopup = () => setLoaderPopup(false)

  // const { isConnected } = useAccount()
  // const { selectedNetworkId } = useWeb3ModalState()

  const steps = [
    {
      images: [images.binance],
      number: 1,
      desc: 'Connect Your Wallet (Binance Smart Chain)',
    },
    {
      images: [images.usdc, images.usdt],
      number: 2,
      desc: 'Choose To Mint With USDT Or USDC',
    },
    {
      images: [images.clock],
      number: 3,
      desc: 'Approve The Spending Amount In Your Wallet',
    },
    {
      images: [images.done],
      number: 4,
      desc: 'Confirm The Two Following Transactions In Your Wallet',
    },
    {
      images: [images.thumbs],
      number: 5,
      desc: 'It’s DONE! You Have Minted!',
    },
  ]

  const mintNFT = async (nftContractAddress: string, tokenAddress: string) => {
    try {
      const web3 = new Web3(provider)

      const accounts = await web3.eth.getAccounts()

      const contractAbi = JSON.parse(JSON.stringify(NFT_ABI))

      const contract = new Contract(
        contractAbi as ContractAbi,
        nftContractAddress,
        web3
      )

      const txReceipt = await contract.methods
        .mint(tokenAddress)
        .send({ from: accounts[0] })

      const txLogsTopic = txReceipt.logs[0].topics as any

      const tokenID = web3.utils.hexToNumberString(txLogsTopic[3])

      const fromAddress = web3.utils
        .toHex(web3.utils.toBigInt(txLogsTopic[1]).toString(16))
        .toLowerCase()

      const toAddress = web3.utils
        .toHex(web3.utils.toBigInt(txLogsTopic[2]).toString(16))
        .toLowerCase()

      if (toAddress === accounts[0].toLowerCase() && fromAddress === '0x30') {
        let response = (await contract.methods
          .tokenURI(tokenID)
          .call()) as string

        let uriReponse = await fetch(response)

        let nft = await uriReponse.json()

        console.log(nft.image)
        setTokenID(tokenID)
        setNftImage(nft.image)

        getTotalminted()
      }

      setLoaderText('You have successfully minted!')

      console.log(txReceipt)
    } catch (error) {
      setLoaderText('Please try again...')
    }
  }

  const assignRandomTier = async (
    nftContractAddress: string,
    tokenAddress: string
  ) => {
    try {
      const web3 = new Web3(provider)

      const accounts = await web3.eth.getAccounts()

      const contractAbi = JSON.parse(JSON.stringify(NFT_ABI))

      const contract = new Contract(
        contractAbi as ContractAbi,
        nftContractAddress,
        web3
      )

      const numbers: any = []

      while (numbers.length < 3) {
        let randomNumber = Math.floor(Math.random() * 5) + 1
        if (!numbers.includes(randomNumber)) {
          numbers.push(randomNumber)
        }
      }

      await contract.methods
        .assignRandomTier(numbers[0], numbers[1], numbers[2])
        .send({ from: accounts[0] })

      setLoaderText('Confirm the minting transaction in your wallet...')

      mintNFT(nftContractAddress, tokenAddress)
    } catch (error) {
      setLoaderText('Please try again...')
    }
  }

  const approveToken = async (tokenAddress: string, spenderAddress: string) => {
    try {
      const web3 = new Web3(provider)

      const accounts = await web3.eth.getAccounts()

      const contractAbi = JSON.parse(JSON.stringify(ERC20_ABI))

      const contract = new Contract(
        contractAbi as ContractAbi,
        tokenAddress,
        web3
      )

      const tokenAllowance = await contract.methods
        .allowance(accounts[0], spenderAddress)
        .call()

      let tokenAllowanceNumber = web3.utils.fromWei(
        `${tokenAllowance}`,
        'ether'
      )

      let requiredTokenAmount = Number(
        process.env.REACT_APP_REQUIRED_TOKEN_AMOUNT
      )

      if (Number(tokenAllowanceNumber) < Number(requiredTokenAmount)) {
        console.log(requiredTokenAmount, Number(tokenAllowanceNumber))
        let approveReponse = await contract.methods
          .approve(
            spenderAddress,
            web3.utils.toWei(requiredTokenAmount, 'ether')
          )
          .send({
            from: accounts[0],
          })

        console.log(approveReponse)
      }

      setLoaderText('Confirm the random pick transaction in your wallet...')

      assignRandomTier(spenderAddress, tokenAddress)
    } catch (error) {
      console.log(error)
      setLoaderText('Please try again...')
    }
  }

  const nftcontractAddress = process.env.REACT_APP_NFT_CONTRACT || ''
  const usdcAddress = process.env.REACT_APP_USDC_CONTRACT || ''
  const usdtAddress = process.env.REACT_APP_USDT_CONTRACT || ''

  const mintByUSDC = async () => {
    try {
      openLoaderPopup()
      setLoaderText('Approve the amount to spend in your wallet.')
      approveToken(usdcAddress, nftcontractAddress)
    } catch (error) {
      console.log(error)
    }
  }

  const mintByUSDT = async () => {
    try {
      openLoaderPopup()
      setLoaderText('Approve the amount to spend in your wallet.')
      approveToken(usdtAddress, nftcontractAddress)
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalminted = async () => {
    try {
      const web3 = new Web3(provider)

      const contractAbi = JSON.parse(JSON.stringify(NFT_ABI))

      const contract = new Contract(
        contractAbi as ContractAbi,
        nftcontractAddress,
        web3
      )

      let totalMinted = await contract.methods.totalMinted().call()
      setTotalMinted(web3.utils.toBigInt(totalMinted).toString())
    } catch (error) {
      console.log(error)
    }
  }

  const getTotalSupply = async () => {
    try {
      const web3 = new Web3(provider)

      const contractAbi = JSON.parse(JSON.stringify(NFT_ABI))

      const contract = new Contract(
        contractAbi as ContractAbi,
        nftcontractAddress,
        web3
      )

      let totalSupply = await contract.methods.totalSupply().call()
      setTotalSupply(web3.utils.toBigInt(totalSupply).toString())
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (provider && connected) {
      getTotalminted()
      getTotalSupply()
    }
  }, [provider])

  return (
    <div className="px-0 md:px-12 py-24 md:py-12 bg-[#090A0C] w-full text-white h-full">
      <div className="bg-gradient rounded-t-[20px] w-full pt-20 px-8 md:px-[60px]">
        <div className="flex flex-col xl:flex-row gap-16 justify-between">
          <div className="flex flex-col gap-8">
            <div className="text-[40px] md:text-6xl font-bold text-primary text-center md:text-left">
              KARMA{' '}
              <span className="font-normal text-white">v2 Collection</span>
            </div>
            <div className="text-sm tracking-widest leading-7 text-center md:text-left">
              Spanning Common Butterflies to Legendary Lions, with Uncommon
              Parrots, Rare Black Pumas, and Epic Elephants in between, the
              Karma NFT v2 collection offers 1,000 unique tokens that fuse
              rarity with utility for growth and passive rewards. Each tier
              provides a unique opportunity to support a vital cause and
              influence personal investments through the Community Investment
              Fund (CIF).
            </div>
            <div className="w-full md:w-fit flex flex-col gap-10">
              <div className="flex w-full md:w-auto flex-col items-center md:item md:flex-row gap-8">
                <button
                  type="button"
                  // disabled={connected || isConnected
                  //   ? (isConnected && Number(selectedNetworkId) === Number(process.env.REACT_APP_CHAIN_ID || '')) ||
                  //     chainId === process.env.REACT_APP_CHAIN_STRING_ID ? false : true : true}
                  onClick={mintByUSDC}
                  className="border-2 group/usdc hover:text-black hover:bg-primary hover:border-primary w-full md:w-auto justify-center border-white rounded-[20px] px-7 py-2.5 flex flex-row gap-2.5 items-center"
                >
                  <img
                    src={images.usdc}
                    alt="wallet_icon"
                    className="w-6 h-6"
                    width={30}
                    height={30}
                  />
                  <div className="font-medium text-lg group-hover/usdc:text-black text-white font-Jost">
                    USDC MINT
                  </div>
                </button>
                <button
                  onClick={mintByUSDT}
                  // disabled={connected || isConnected
                  //   ? (isConnected && Number(selectedNetworkId) === Number(process.env.REACT_APP_CHAIN_ID || '')) ||
                  //     chainId === process.env.REACT_APP_CHAIN_STRING_ID ? false : true : true}
                  className="border-2 group/usdt hover:bg-primary hover:border-primary w-full md:w-auto justify-center border-white rounded-[20px] px-7 py-2.5 flex flex-row gap-2.5 items-center"
                >
                  <img
                    src={images.usdt}
                    alt="wallet_icon"
                    className="w-6 h-6"
                    width={30}
                    height={30}
                  />
                  <div className="font-medium text-lg group-hover/usdt:text-black text-white font-Jost">
                    USDT MINT
                  </div>
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="py-2.5 w-full md:w-auto bg-background_color1 text-center text-xl rounded-[20px]">
                  Price: $1200
                </div>
                <div className="py-2.5 w-full md:w-auto bg-background_color1 text-center text-xl rounded-[20px]">
                  Total Minted: {`${totalMinted}/${totalSupply}`}
                </div>
              </div>
            </div>
          </div>
          <img
            src={images.nft}
            alt="nft"
            className="w-full md:w-[471px] h-auto self-center xl:self-start md:h-[471px]"
          />
        </div>
        <div className="mt-16 bg-background_color1 px-10 py-12 rounded-[20px] flex flex-row items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-9 w-full">
            {steps.map((step) => (
              <div
                key={`step-${step.number}`}
                className={`flex flex-col ${
                  step.number === 1 && 'md:flex-row'
                } ${step.number === 2 && 'lg:flex-row'} ${
                  step.number === 3 && 'md:flex-row'
                } ${step.number === 4 && 'md:flex-row'} items-center gap-9`}
              >
                <div className="flex flex-col items-center gap-5">
                  <div className="flex flex-row gap-2 items-center">
                    {step.images.map((image, inx) => (
                      <img
                        key={inx}
                        src={image}
                        width={32}
                        height={32}
                        className="w-8 h-8"
                        alt="steps"
                      />
                    ))}
                  </div>
                  <div className="text-sm rounded-[20px] py-2.5 px-6 tracking-widest bg-[#202324]">
                    STEP {step.number}
                  </div>
                  <div className="text-xs font-bold leading-4 tracking-widest text-center">
                    {step.desc}
                  </div>
                </div>
                {step.number !== 5 && (
                  <img
                    src={images.green_arrow}
                    width={14}
                    height={24}
                    className={`w-3.5 h-6 rotate-90 md:rotate-0
                    ${
                      (step.number === 2 || step.number === 4) &&
                      'md:hidden lg:block'
                    }
                    ${step.number === 3 && 'lg:hidden xl:block'}
                    `}
                    alt="arrow"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <PopupEncloser show={loaderPopup} close={closeLoaderPopup}>
        <LoaderPopup close={closeLoaderPopup} />
      </PopupEncloser>
    </div>
  )
}

export default Home

// "0x0ee3e20c584b75d421c00a75f6885373fe8dadd6c2936d6d44455942b2b612f5"
