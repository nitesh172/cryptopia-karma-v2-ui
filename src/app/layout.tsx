import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AppProvider } from '@/context/AppContext'
import { Jost, Orbitron, Roboto, Urbanist } from 'next/font/google'
import { envConfig } from '@/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: envConfig.WALLET_APP_NAME,
  description: envConfig.WALLET_APP_DESCRIPTION,
  openGraph: {
    images:
      'https://cryptopia-group.com/wp-content/uploads/2022/06/cryptopia-768x432.png',
    title: envConfig.WALLET_APP_NAME,
    description: envConfig.WALLET_APP_DESCRIPTION,
    type: 'website',
    url: envConfig.WALLET_APP_URL,
  },
  icons: envConfig.WALLET_APP_ICON_URL,
  twitter: {
    images:
      'https://cryptopia-group.com/wp-content/uploads/2022/06/cryptopia-768x432.png',
    title: envConfig.WALLET_APP_NAME,
    description: envConfig.WALLET_APP_DESCRIPTION,
    card: 'summary_large_image',
  },
  metadataBase: new URL(envConfig.WALLET_APP_URL || 'http://localhost:3000/'),
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
