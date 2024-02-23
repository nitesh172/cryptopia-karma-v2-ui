import React from 'react'
import { images } from '../../assets'
import { useAppContext } from '../../context/AppContext'

type LoaderPopupProps = {
  close: () => void
}

const LoaderPopup: React.FC<LoaderPopupProps> = (props) => {
  const { close } = props
  const { loaderText, nftImage, tokenID } = useAppContext()
  return (
    <div
      className={`bg-popup_bg rounded-2xl ${
        loaderText === 'You have successfully minted!' ? 'py-12' : 'py-32'
      } flex flex-col items-center`}
    >
      {/* <div className="text-2xl absolute top-6 right-6" onClick={close} role="button">
        X
      </div> */}
      {loaderText === 'Please try again...' ? (
        <div className="text-error_red text-3xl px-12 mb-8">
          SOMETHING WENT WRONG!
        </div>
      ) : loaderText === 'You have successfully minted!' ? (
        <div className="flex flex-col items-center mb-4">
          <img
            src={nftImage}
            alt="nftimage"
            width={281}
            height={421}
            className="w-[281px] h-[421px] rounded-[20px] mb-7"
          />
          <div className="text-2xl text-center px-12">TokenID: #{tokenID}</div>
        </div>
      ) : (
        <img
          src={images.logo_loader}
          alt="loader_logo"
          width={600}
          height={121}
          className="w-[600px] h-[121px]"
        />
      )}
      <div className="text-2xl text-center px-16 text-primary">
        {loaderText}
      </div>
    </div>
  )
}

export default LoaderPopup
