"use client";
import "@/hooks/usePaymentManager"
import { useState, useEffect } from 'react';
import { tokensPerMainnetChain, Token } from '@/lib/evm-tokens-mainnet-tfs';
import P2PHeader from "@/components/p2p/Header";
import SecureTransferInterface from "@/components/p2p/SecureTransfer";
import { SplitBillList } from "@/components/p2p/SplitBillList";
import { InvoiceList } from "@/components/p2p/InvoiceList";
import { CreateInvoiceForm } from "@/components/p2p/CreateInvoiceForm";
import { useAccount, useChainId } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Home } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Page() {
    const { address } = useAccount();
    const chainId = useChainId();
    const [selectedToken, setSelectedToken] = useState<Token | undefined>(undefined);
    const [splitBillRefresh, setSplitBillRefresh] = useState(0);

    // Update selected token when chain changes
    useEffect(() => {
        if (chainId) {
            const chainTokens = tokensPerMainnetChain[chainId];
            if (chainTokens && chainTokens.length > 0) {
                setSelectedToken(chainTokens[0]); // Default to first token for chain
            }
        }
    }, [chainId]);

    // Handle token changes from the ConfigurePayModal component
    const handleTokenChange = (token: Token) => {
        setSelectedToken(token);
    };

    return (
        <div className="relative h-screen w-screen dark:text-white text-black p-6 z-10">
            <div className="absolute top-4 left-4">
                <Link href="/">
                    <Home className="text-black dark:hover:text-gray-200 hover:text-gray-800 dark:text-white" size={30} />
                </Link>
            </div>
            <div className="flex flex-col max-w-screen max-h-screen items-center m-10">
                <div className="w-full flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">ZynPay P2P Payments</h1>
                    <ConnectButton />
                </div>

                {address ? (
                    selectedToken ? (
                        <Tabs defaultValue="transfer" className="min-w-[90%]">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="transfer">Secure Transfer</TabsTrigger>
                                <TabsTrigger value="invoices">My Invoices</TabsTrigger>
                                <TabsTrigger value="splitbills">Split Bills</TabsTrigger>
                                <TabsTrigger value="create-invoice">Create Invoice</TabsTrigger>
                            </TabsList>

                            <TabsContent value="transfer">
                                <SecureTransferInterface selectedToken={selectedToken} />
                            </TabsContent>

                            <TabsContent value="invoices">
                                <InvoiceList selectedToken={selectedToken} />
                            </TabsContent>

                            <TabsContent value="splitbills">
                                <SplitBillList
                                    selectedToken={selectedToken}
                                    refreshTrigger={splitBillRefresh}
                                />
                            </TabsContent>

                            <TabsContent value="create-invoice">
                                <CreateInvoiceForm />
                            </TabsContent>
                        </Tabs>
                    ) : (
                        <div className="dark:text-white text-black border-2 border-blue-200 p-4 rounded-md">
                            <p>No compatible tokens found for the current chain. Please switch networks.</p>
                        </div>
                    )
                ) : (
                    <div className="dark:text-white text-black border-2 border-blue-200 p-4 rounded-md">
                        <p>Please connect your wallet to use these features.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Page;