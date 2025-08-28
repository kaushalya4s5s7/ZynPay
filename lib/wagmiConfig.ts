import { getDefaultConfig, Chain } from '@rainbow-me/rainbowkit';

const kaiaKairos = {
  id: 1001, // Kaia Kairos Testnet chain ID
  name: "Kaia Kairos",
  iconUrl: "https://avatars.githubusercontent.com/u/31002956?s=200&v=4", // Official Kaia logo
  nativeCurrency: {
    name: "Kaia",
    symbol: "KAIA",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://public-en-kairos.node.kaia.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Kaiascope",
      url: "https://kairos.kaiascope.com/",
    },
  },
} as const satisfies Chain;

const config = getDefaultConfig({
  appName: 'ZynPay', // Replace with your DApp name
  projectId: '23c5e43972b3775ee6ed4f74f3e76efb', // Your RainbowKit Project ID
  chains: [kaiaKairos],
});

export { config };
