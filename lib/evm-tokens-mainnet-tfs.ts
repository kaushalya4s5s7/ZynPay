import { kaiaKairos } from "./evm-chains-mainnet"; // Make sure this file exports kaiaKairos

// Export the native address constant
export const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000';

// Add the contract address for Kaia Kairos (replace with your actual contract address if available)
export const contractMainnetAddresses = {
    [kaiaKairos.id]: '0x6132B4447D01CD79B5a9D65d7A37Aabcfc8EFC1d', // Replace with your deployed contract address
};

export const SecurecontractMainnetAddresses = {
    [kaiaKairos.id]: '0x2dFD4c57D3281eE403Fd5061a1184d4c6AE5F3bc', // Replace with your deployed secure contract address
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
            address: NATIVE_ADDRESS, // Native KAIA
            decimals: 18,
            priceFeed: ''
        },
         {
            symbol: 'USDT',
            address: '0x5e9456756afef83dddfa6416c8f96ff7c8aae8ce',
            decimals: 18,
            priceFeed: undefined // Use CoinGecko or another price feed
        }
    ]
};
