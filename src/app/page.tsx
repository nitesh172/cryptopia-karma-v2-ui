'use client'
import { ERC20_ABI } from '../../public/token_contract'
import NFT_ABI from '../../public/contract_test.json'
import PopupEncloser from '../components/PopupEncloser/PopupEncloser'
import { useAppContext } from '../context/AppContext'
import LoaderPopup from '../components/Popups/LoaderPopup'
import { useEffect } from 'react'
import { envConfig } from '../config'
import Image from 'next/image'
import {
  useAccount,
  useWriteContract,
  useReadContract,
  useTransactionReceipt,
  useWaitForTransactionReceipt,
} from 'wagmi'
import { formatEther, hexToBigInt, hexToNumber, parseEther, toHex } from 'viem'

export default function Home() {
  const { isConnected, chain, address } = useAccount()

  const {
    loaderPopup,
    setLoaderPopup,
    setLoaderText,
    setTokenID,
    tokenID,
    setNftImage,
    setSelectToken,
    selectToken,
    setLoading,
  } = useAppContext()

  const openLoaderPopup = () => setLoaderPopup(true)
  const closeLoaderPopup = () => setLoaderPopup(false)

  const steps = [
    {
      images: ['/images/binance.svg'],
      number: 1,
      desc: 'Connect Your Wallet (Binance Smart Chain)',
    },
    {
      images: ['/images/usdc.svg', '/images/usdt.svg'],
      number: 2,
      desc: 'Choose To Mint With USDT Or USDC',
    },
    {
      images: ['/images/clock.svg'],
      number: 3,
      desc: 'Approve The Spending Amount In Your Wallet',
    },
    {
      images: ['/images/done.svg'],
      number: 4,
      desc: 'Confirm The Two Following Transactions In Your Wallet',
    },
    {
      images: ['/images/thumbs.svg'],
      number: 5,
      desc: 'It’s DONE! You Have Minted!',
    },
  ]

  const nftcontractAddress = envConfig.NFT_CONTRACT || ''
  const usdcAddress = envConfig.USDC_CONTRACT || ''
  const usdtAddress = envConfig.USDT_CONTRACT || ''

  const contractAbi = JSON.parse(JSON.stringify(ERC20_ABI))
  const nftAbi = JSON.parse(JSON.stringify(NFT_ABI))

  const { data: usdcAllowance } = useReadContract({
    address: usdcAddress as any,
    abi: contractAbi,
    functionName: 'allowance',
    args: [address || '', nftcontractAddress],
  })

  const { data: usdtAllowance } = useReadContract({
    address: usdtAddress as any,
    abi: contractAbi,
    functionName: 'allowance',
    args: [address || '', nftcontractAddress],
  })

  const { data: totalMinted } = useReadContract({
    address: nftcontractAddress as any,
    abi: nftAbi,
    functionName: 'totalMinted',
  })

  const { data: totalSupply } = useReadContract({
    address: nftcontractAddress as any,
    abi: nftAbi,
    functionName: 'totalSupply',
  })

  const {
    data: tokenApproveHash,
    writeContract: tokenApprove,
    isError: tokenApproveError,
  } = useWriteContract()

  const { isSuccess: tokenApproveSucess, isLoading: tokenApproveLoading } =
    useWaitForTransactionReceipt({
      hash: tokenApproveHash,
    })

  const {
    data: randomTierHash,
    writeContract: randomTier,
    isError: randomTierError,
  } = useWriteContract()

  const { isSuccess: randomTierSucess, isLoading: randomTierLoading } =
    useWaitForTransactionReceipt({
      hash: randomTierHash,
    })

  const {
    data: mintHash,
    writeContract: mint,
    isError: mintError,
  } = useWriteContract()

  const { isSuccess: mintSuccess, isLoading: mintLoading } =
    useWaitForTransactionReceipt({
      hash: mintHash,
    })

  const {
    data: urlJson,
    isError: uriError,
    isSuccess: uriSuccess,
  } = useReadContract({
    address: nftcontractAddress as any,
    functionName: 'tokenURI',
    abi: nftAbi,
    args: [tokenID],
  })

  const { data: mintData, isError: mintDataError } = useTransactionReceipt({
    hash: mintHash,
  })

  const assignRandomTier = () => {
    const contractAbi = JSON.parse(JSON.stringify(NFT_ABI))
    const numbers: any = []

    while (numbers.length < 3) {
      let randomNumber = Math.floor(Math.random() * 5) + 1
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber)
      }
    }

    randomTier({
      address: nftcontractAddress as any,
      abi: contractAbi,
      functionName: 'assignRandomTier',
      args: [numbers[0], numbers[1], numbers[2]],
    })
  }

  useEffect(() => {
    if (mintLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [mintLoading])

  useEffect(() => {
    if (tokenApproveLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [tokenApproveLoading])

  useEffect(() => {
    if (randomTierLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [randomTierLoading])

  const mintNFT = () => {
    const contractAbi = JSON.parse(JSON.stringify(NFT_ABI))

    mint({
      address: nftcontractAddress as any,
      functionName: 'mint',
      abi: contractAbi,
      args: [selectToken === 'usdc' ? usdcAddress : usdtAddress],
    })
  }

  useEffect(() => {
    if (mintData) {
      setLoading(true)
      const txLogsTopic = mintData?.logs[0].topics as any

      if (txLogsTopic && txLogsTopic.length) {
        const tokenID = hexToNumber(txLogsTopic[3])

        const fromAddress = toHex(hexToBigInt(txLogsTopic[1])).toLowerCase()

        const toAddress = toHex(hexToBigInt(txLogsTopic[2])).toLowerCase()

        if (toAddress === address?.toLowerCase() && fromAddress === '0x0') {
          setTokenID(tokenID.toString())
        }
      }
    } else if (mintDataError) {
      setLoading(false)
      setLoaderText('Please try again...')
    }
  }, [mintData])

  useEffect(() => {
    if (mintSuccess) {
      setLoading(false)
    } else if (mintError) {
      setLoaderText('Please try again...')
    }
  }, [mintSuccess, mintError])

  const getNFTImage = async () => {
    let uriReponse = await fetch(urlJson as any)

    let nft = await uriReponse.json()

    setNftImage(nft.image)
    setLoading(false)
    openLoaderPopup()
    setLoaderText('You have successfully minted!')
  }

  useEffect(() => {
    if (uriSuccess) {
      getNFTImage()
    } else if (uriError) {
      setLoaderText('Please try again...')
      setLoading(false)
    }
  }, [uriSuccess, uriError])

  useEffect(() => {
    if (randomTierSucess) {
      setLoading(false)
      openLoaderPopup()
      setLoaderText('Confirm the minting transaction in your wallet...')
      mintNFT()
    } else if (randomTierError) {
      setLoaderText('Please try again...')
      setLoading(false)
    }
  }, [randomTierSucess, randomTierError])

  const approveToken = (tokenSelected: string, spenderAddress: string) => {
    const tokenAllowanceNumber = formatEther(
      selectToken === 'usdc'
        ? (usdcAllowance as bigint)
        : (usdtAllowance as bigint)
    )

    let requiredTokenAmount = Number(envConfig.REQUIRED_TOKEN_AMOUNT)

    console.log(selectToken)
    if (Number(tokenAllowanceNumber) < Number(requiredTokenAmount)) {
      tokenApprove({
        address: tokenSelected === 'usdc' ? usdcAddress : usdtAddress as any,
        abi: contractAbi,
        functionName: 'approve',
        args: [spenderAddress, parseEther(requiredTokenAmount.toString())],
      })
      setLoading(false)
    } else {
      setLoaderText('Confirm the random pick transaction in your wallet...')

      setLoading(false)
      assignRandomTier()
    }
  }

  useEffect(() => {
    if (tokenApproveSucess) {
      setLoading(false)
      openLoaderPopup()
      setLoaderText('Confirm the random pick transaction in your wallet...')
      assignRandomTier()
    } else if (tokenApproveError) {
      setLoaderText('Please try again...')
      setLoading(false)
    }
  }, [tokenApproveSucess, tokenApproveError])

  const mintByUSDC = () => {
    openLoaderPopup()
    setLoaderText('Approve the amount to spend in your wallet.')
    setSelectToken('usdc')
    approveToken('usdc', nftcontractAddress)
  }

  const mintByUSDT = () => {
    openLoaderPopup()
    setLoaderText('Approve the amount to spend in your wallet.')
    setSelectToken('usdt')
    approveToken('usdt', nftcontractAddress)
  }

  return (
    <div className="bg-[#090A0C] flex flex-col items-center">
      <div className="px-0 md:px-12 py-24 md:py-12 w-full text-white h-full">
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
                    disabled={
                      isConnected
                        ? chain?.id.toString() === envConfig.CHAIN_ID
                          ? false
                          : true
                        : true
                    }
                    onClick={mintByUSDC}
                    className="border-2 group/usdc hover:text-black hover:bg-primary hover:border-primary w-full md:w-auto justify-center border-white rounded-[20px] px-7 py-2.5 flex flex-row gap-2.5 items-center"
                  >
                    <Image
                      src="/images/usdc.svg"
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
                    disabled={
                      isConnected
                        ? chain?.id.toString() === envConfig.CHAIN_ID
                          ? false
                          : true
                        : true
                    }
                    className="border-2 group/usdt hover:bg-primary hover:border-primary w-full md:w-auto justify-center border-white rounded-[20px] px-7 py-2.5 flex flex-row gap-2.5 items-center"
                  >
                    <Image
                      src="/images/usdt.svg"
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
                    Total Minted:{' '}
                    {`${totalMinted ? totalMinted : '-'}/${
                      totalSupply ? totalSupply : '-'
                    }`}
                  </div>
                </div>
              </div>
            </div>
            <Image
              src="/images/nft.png"
              alt="nft"
              width={471}
              height={471}
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
                        <Image
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
                    <Image
                      src="/images/green_arrow.svg"
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
          <LoaderPopup />
        </PopupEncloser>
      </div>
      <footer className="h-11 px-6 rounded-t-[20px] flex flex-col justify-center bg-gradient_footer self-center">
        <div className="text-lg text-white">
          Made by InfinityBlocks © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}