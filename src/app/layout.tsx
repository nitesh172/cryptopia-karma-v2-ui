import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AppProvider } from '@/context/AppContext'
import { Jost, Orbitron, Roboto, Urbanist } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cryptopia',
  description:
    'Cryptopia is a crypto YouTube channel, blockchain investment VC and charity',
  openGraph: {
    images:
      'https://cryptopia-group.com/wp-content/uploads/2022/06/cryptopia-768x432.png',
    title: 'Cryptopia',
    description:
      'Cryptopia is a crypto YouTube channel, blockchain investment VC and charity',
    type: 'website',
    url: 'https://cryptopia-group.com',
  },
  icons:
    'https://cryptopia-group.com/wp-content/uploads/2022/06/cropped-favicon-32x32.png',
  twitter: {
    images:
      'https://cryptopia-group.com/wp-content/uploads/2022/06/cryptopia-768x432.png',
    title: 'Cryptopia',
    description:
      'Cryptopia is a crypto YouTube channel, blockchain investment VC and charity',
    card: 'summary_large_image',
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WALLET_APP_URL || 'http://localhost:3000/'
  ),
}

const orbitron = Orbitron({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-orbitron',
})

const jost = Jost({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jost',
})

const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
})

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700', '100', '100', '300'],
  variable: '--font-roboto',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <div
            className={`${orbitron.variable} ${jost.variable} ${urbanist.variable} ${roboto.variable} font-sans`}
          >
            <Navbar />
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  )
}
