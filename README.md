This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Firest, create .env.local file:

```bash
NEXT_PUBLIC_WALLET_CONNECT_API_KEY="Your wallet connect api key"
NEXT_PUBLIC_WALLET_APP_NAME="Your App name"
NEXT_PUBLIC_WALLET_APP_DESCRIPTION="Your app description"
NEXT_PUBLIC_WALLET_APP_URL="Your website url"
NEXT_PUBLIC_WALLET_APP_ICON_URL="Your app icon url"
NEXT_PUBLIC_NFT_CONTRACT="Your nft contract address"
NEXT_PUBLIC_USDC_CONTRACT="Your usdc contract address"
NEXT_PUBLIC_USDT_CONTRACT="Your usdt contract address"
NEXT_PUBLIC_CHAIN_ID=97 # For bsc testnet use 97 or bsc mainnet use 56
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
