import dynamic from 'next/dynamic'
const MainSection = dynamic(() => import('@/components/block/Home'))

export default function Home() {
  return (
    <div className="bg-[#090A0C] flex flex-col items-center">
      <MainSection />
      <footer className="h-11 px-6 rounded-t-[20px] flex flex-col justify-center bg-gradient_footer self-center">
        <div className="text-lg text-white text-center font-Roboto">
          Made by InfinityBlocks © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}
