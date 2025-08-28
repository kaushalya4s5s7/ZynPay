import { defineChain } from 'viem'

export const NATIVE_ADDRESS = `0x0000000000000000000000000000000000000000`

export const kaiaKairos = defineChain({
    id: 1001, // Chain ID for Kaia Kairos
    name: 'Kaia Kairos',
    nativeCurrency: { decimals: 18, name: 'Kaia', symbol: 'KAIA' },
    rpcUrls: {
        default: { http: ['https://public-en-kairos.node.kaia.io'] },
        public: { http: ['https://public-en-kairos.node.kaia.io'] },
    },
    blockExplorers: {
        default: { name: 'Kaiascope', url: 'https://kairos.kaiascope.com/' },
    },
    testnet: true, // Marks this as a testnet
})

export const allMainnetChains = [
    kaiaKairos,
]
