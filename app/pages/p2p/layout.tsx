"use client";
import React from 'react';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import { ProtectedRoute } from '@/context/authContext';
import { config } from '@/lib/wagmiConfig';


const queryClient = new QueryClient();

export default function PaymentsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container">
                <ProtectedRoute requireAdmin={true} route="pages/payroll">
                    <WagmiProvider config={config}>
                        <QueryClientProvider client={queryClient}>
                            <RainbowKitProvider >
                                {children}
                            </RainbowKitProvider>
                        </QueryClientProvider>
                    </WagmiProvider>
                </ProtectedRoute>
        </div>
    );
}