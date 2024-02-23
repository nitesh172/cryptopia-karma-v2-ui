import React from 'react'

export type PopupEncloserProps = {
  show: boolean
  close: (Option: boolean) => void
  children: React.ReactNode
}

const PopupEncloser = (props: PopupEncloserProps) => {
  const { children, close, show } = props

  const handleClose = () => close(false)

  document.body.style.overflow = show ? 'hidden' : 'auto'

  return show ? (
    <div
      className='z-50 fixed left-0 right-0 top-0 bottom-0 w-[100vw] h-[100vh] grid place-items-center bg-black backdrop-blur-sm bg-opacity-75 inset-0 overflow-x-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:"none"] [scrollbar-width:"none"]'
      onClick={handleClose}
    >
      <div className='relative max-w-[90%] xl:max-w-[600px]' onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null
}

export default PopupEncloser