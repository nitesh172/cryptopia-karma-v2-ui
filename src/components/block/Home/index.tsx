'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { ERC20_ABI } from '../../../../public/token_contract'
import NFT_ABI from '../../../../public/contract.json'
import { useAppContext } from '@/context/AppContext'
import { useEffect } from 'react'
import { envConfig } from '@/config'
import Image from 'next/image'
import {
    useAccount,
    useWriteContract,
    useReadContract,
    useTransactionReceipt,
    useWaitForTransactionReceipt,
} from 'wagmi'
import { formatEther, hexToBigInt, hexToNumber, toHex } from 'viem'
import { useWeb3Modal } from '@web3modal/wagmi/react'
const LoaderPopup = dynamic(() => import('@/components/Popups/LoaderPopup'))
const PopupEncloser = dynamic(() => import('@/components/PopupEncloser/PopupEncloser'))

const MainSection = () => {
  const { isConnected, chain, address } = useAccount()

  const { open } = useWeb3Modal()

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

  const { data: totalMinted, refetch } = useReadContract({
    address: nftcontractAddress as any,
    abi: nftAbi,
    functionName: 'totalMinted',
  })

  const { data: totalSupply } = useReadContract({
    address: nftcontractAddress as any,
    abi: nftAbi,
    functionName: 'totalSupply',
  })

  const { data: price } = useReadContract({
    address: nftcontractAddress as any,
    abi: nftAbi,
    functionName: 'usdtPrice',
  })

  const { data: tokenApproveHash, writeContractAsync: tokenApprove } =
    useWriteContract()

  const {
    isSuccess: tokenApproveSucess,
    isLoading: tokenApproveLoading,
    isError: tokenApproveTxError,
  } = useWaitForTransactionReceipt({
    hash: tokenApproveHash,
  })

  const { data: randomTierHash, writeContractAsync: randomTier } =
    useWriteContract()

  const {
    isSuccess: randomTierSucess,
    isLoading: randomTierLoading,
    isError: randomTierTxError,
  } = useWaitForTransactionReceipt({
    hash: randomTierHash,
  })

  const { data: mintHash, writeContractAsync: mint } = useWriteContract()

  const { isSuccess: mintSuccess, isError: mintTxError } =
    useWaitForTransactionReceipt({
      hash: mintHash,
    })

  const {
    data: mintData,
    isError: mintDataError,
    isLoading: mintLoading,
  } = useTransactionReceipt({
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

  const getNFTImage = async () => {
    let uriReponse = await fetch(urlJson as any)

    let nft = await uriReponse.json()

    setNftImage(nft.image)
    setLoading(false)
    openLoaderPopup()
    setSelectToken('')
    await refetch()
  }

  useEffect(() => {
    if (uriSuccess && selectToken) {
      getNFTImage()
    } else if (uriError) {
      setLoaderText('Please try again...')
      setSelectToken('')
      setLoading(false)
    }
  }, [uriSuccess, uriError])

  const mintNFT = async () => {
    try {
      await mint({
        address: nftcontractAddress as any,
        functionName: 'mint',
        abi: nftAbi,
        args: [selectToken === 'usdc' ? usdcAddress : usdtAddress],
      })
    } catch (error) {
      setLoaderText('Please try again...')
      setSelectToken('')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mintSuccess && mintData && selectToken) {
      const txLogsTopic = mintData?.logs[0].topics as any

      if (txLogsTopic && txLogsTopic.length) {
        const tokenID = hexToNumber(txLogsTopic[3])

        const fromAddress = toHex(hexToBigInt(txLogsTopic[1])).toLowerCase()

        const toAddress = toHex(hexToBigInt(txLogsTopic[2])).toLowerCase()

        if (toAddress === address?.toLowerCase() && fromAddress === '0x0') {
          setTokenID(tokenID.toString())
          setLoaderText('You have successfully minted!')
        }
      }
    } else if (mintDataError || mintTxError) {
      setLoading(false)
      setLoaderText('Please try again...')
      setSelectToken('')
    }
  }, [mintSuccess, mintDataError, mintTxError])

  const assignRandomTier = async () => {
    try {
      const numbers: any = []

      while (numbers.length < 3) {
        let maxUint256 = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER) + 1

        if (!numbers.includes(maxUint256)) {
          numbers.push(maxUint256)
        }
      }

      await randomTier({
        address: nftcontractAddress as any,
        abi: nftAbi,
        functionName: 'assignRandomTier',
        // args: [5, 6, 7],
        args: [numbers[0], numbers[1], numbers[2]],
      })
    } catch (error) {
      setLoaderText('Please try again...')
      setSelectToken('')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (randomTierSucess && selectToken) {
      openLoaderPopup()
      setLoading(false)
      setLoaderText('Confirm the minting transaction in your wallet...')
      mintNFT()
    } else if (randomTierTxError) {
      setLoaderText('Please try again...')
      setSelectToken('')
      setLoading(false)
    }
  }, [randomTierSucess, randomTierTxError])

  const approveToken = async (
    tokenSelected: string,
    spenderAddress: string
  ) => {
    try {
      await tokenApprove({
        address: (tokenSelected === 'usdc' ? usdcAddress : usdtAddress) as any,
        abi: contractAbi,
        functionName: 'approve',
        args: [spenderAddress, price],
      })
    } catch (error) {
      setLoaderText('Please try again...')
      setSelectToken('')
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tokenApproveSucess && selectToken && !tokenApproveLoading) {
      setTimeout(() => {
        openLoaderPopup()
        setLoaderText('Confirm the random pick transaction in your wallet...')
        setLoading(false)
        assignRandomTier()
      }, 2000)
    } else if (tokenApproveTxError) {
      setLoaderText('Please try again...')
      setSelectToken('')
      setLoading(false)
    }
  }, [tokenApproveSucess, tokenApproveTxError])

  const mintByUSDC = () => {
    if (isConnected) {
      if (chain?.id.toString() === envConfig.CHAIN_ID) {
        openLoaderPopup()
        setLoaderText('Approve the amount to spend in your wallet.')
        setSelectToken('usdc')
        setNftImage('')
        approveToken('usdc', nftcontractAddress)
      } else {
        open({ view: 'Networks' })
      }
    } else {
      open({ view: 'Connect' })
    }
  }

  const mintByUSDT = () => {
    if (isConnected) {
      if (chain?.id.toString() === envConfig.CHAIN_ID) {
        openLoaderPopup()
        setLoaderText('Approve the amount to spend in your wallet.')
        setSelectToken('usdt')
        setNftImage('')
        approveToken('usdt', nftcontractAddress)
      } else {
        open({ view: 'Networks' })
      }
    } else {
      open({ view: 'Connect' })
    }
  }

  return (
    <div className="px-0 md:px-12 py-24 md:py-12 w-full text-white h-full">
      <div className="bg-gradient rounded-t-[20px] w-full pt-20 px-8 md:px-[60px]">
        <div className="flex flex-col xl:flex-row gap-16 justify-between">
          <div className="flex flex-col gap-8">
            <div className="text-[40px] md:text-6xl font-bold font-Orbitron text-primary text-center md:text-left">
              KARMA{' '}
              <span className="font-normal text-white font-Orbitron">
                v2 Collection
              </span>
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
                  onClick={mintByUSDC}
                  className="border-2 group/usdc hover:text-black hover:bg-primary hover:border-primary w-full md:w-auto justify-center border-white rounded-[20px] px-7 py-2.5 flex flex-row gap-2.5 items-center"
                >
                  <Image
                    src="/images/usdc.svg"
                    alt="wallet_icon"
                    className="w-6 h-6"
                    width={30}
                    height={30}
                    loading='eager'
                  />
                  <div className="font-medium text-lg group-hover/usdc:text-black text-white font-Jost">
                    USDC MINT
                  </div>
                </button>
                <button
                  onClick={mintByUSDT}
                  className="border-2 group/usdt hover:bg-primary hover:border-primary w-full md:w-auto justify-center border-white rounded-[20px] px-7 py-2.5 flex flex-row gap-2.5 items-center"
                >
                  <Image
                    src="/images/usdt.svg"
                    alt="wallet_icon"
                    className="w-6 h-6"
                    width={30}
                    loading='eager'
                    height={30}
                  />
                  <div className="font-medium text-lg group-hover/usdt:text-black text-white font-Jost">
                    USDT MINT
                  </div>
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                <div className="py-2.5 w-full md:w-auto bg-background_color1 text-center text-xl rounded-[20px]">
                  Price: ${price ? formatEther(price as any) : ''}
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
            loading='eager'
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
                        loading='lazy'
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
                    loading='lazy'
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
  )
}

export default MainSection
