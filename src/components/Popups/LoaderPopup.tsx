import React from 'react'
import { useAppContext } from '../../context/AppContext'
import Image from 'next/image'

const LoaderPopup = () => {
  const { loaderText, nftImage, tokenID, loading } = useAppContext()
  console.log(loaderText)
  return (
    <div
      className={`bg-popup_bg rounded-2xl ${
        loaderText === 'You have successfully minted!'
          ? 'py-6 md:py-12'
          : 'py-16 md:py-32'
      } flex flex-col items-center`}
    >
      {loaderText === 'Please try again...' ? (
        <div className="text-error_red text-3xl px-12 mb-8">
          SOMETHING WENT WRONG!
        </div>
      ) : loaderText === 'You have successfully minted!' ? (
        <div className="flex flex-col items-center mb-4">
          <Image
            src={nftImage}
            alt="nftimage"
            width={281}
            height={421}
            className="w-[281px] h-[421px] rounded-[20px] mb-7"
          />
          <div className="text-2xl text-center px-6 md:px-12">
            TokenID: #{tokenID}
          </div>
        </div>
      ) : (
        <Image
          src="/images/logo_loader.svg"
          alt="loader_logo"
          width={600}
          height={121}
          className="w-[600px] h-[121px]"
        />
      )}
      <div className="text-2xl text-center px-6 md:px-16 text-white">
        {loaderText}
      </div>
      {loading && (
        <div className="text-sm px-4 mt-6">
          Please wait for transaction confirmation....
        </div>
      )}
    </div>
  )
}

export default LoaderPopup
