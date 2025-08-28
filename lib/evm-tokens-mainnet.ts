import { kaiaKairos } from "./evm-chains-mainnet";

// Export the native address constant
export const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000';

// Example contract address for Kaia Kairos (replace with your actual contract address if you have one)
export const contractMainnetAddresses = {
    [kaiaKairos.id]: '0x6132B4447D01CD79B5a9D65d7A37Aabcfc8EFC1d', // Placeholder, replace with your actual contract address
};

// Token interface with optional priceFeed field
export interface Token {
    symbol: string;
    address: string;
    decimals: number;
    priceFeed?: string;
}

export const tokensPerMainnetChain: { [chainId: number]: Token[] } = {
    [kaiaKairos.id]: [
        {
            symbol: 'KAIA',
            address: '0x0000000000000000000000000000000000000000', // Native KAIA
            decimals: 18,
            priceFeed: undefined // You may need to find a reliable price feed
        },
        // Example Kaia Compatible Token (KCT) placeholder
        {
            symbol: 'USDT',
            address: '0x5e9456756afef83dddfa6416c8f96ff7c8aae8ce',
            decimals: 18,
            priceFeed: undefined // Use CoinGecko or another price feed
        }
        // Add other Kaia testnet tokens as needed
    ]
};
