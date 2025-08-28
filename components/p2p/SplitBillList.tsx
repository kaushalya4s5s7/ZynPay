import React, { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { useAuth } from '@/context/authContext';
import { getInitiatedSplitBills, getParticipantSplitBills, SplitBill, updateParticipantPayment } from '@/api/SplitBillApi';
import { usePaymentsManager } from '@/hooks/usePaymentManager';
import { Token } from '@/lib/evm-tokens-mainnet-tfs';
import { Users, Clock, CheckCircle, X, AlertCircle, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { ResultMessageDisplay } from './ResultMessegeDisplay';
import { getExchangeRate } from '@/lib/chainlink-helper';
import { ethers } from 'ethers';

interface SplitBillListProps {
    selectedToken: Token | undefined;
    refreshTrigger?: number;  // To trigger refresh from outside
}

export const SplitBillList = ({ selectedToken, refreshTrigger = 0 }: SplitBillListProps) => {
    const [initiatedSplits, setInitiatedSplits] = useState<SplitBill[]>([]);
    const [participatingSplits, setParticipatingSplits] = useState<SplitBill[]>([]);
    const [activeTab, setActiveTab] = useState<'initiated' | 'participating'>('initiated');
    const [loading, setLoading] = useState(true);
    const [selectedSplit, setSelectedSplit] = useState<SplitBill | null>(null);
    const [paymentSplit, setPaymentSplit] = useState<SplitBill | null>(null);
    const [isPayModalOpen, setIsPayModalOpen] = useState(false);
    const [exchangeRate, setExchangeRate] = useState<number>(0);

    const { address } = useAccount();
    const { user } = useAuth();
    const publicClient = usePublicClient();

    const {
        sendPayment,
        isLoading: paymentLoading,
        resultMessage,
        setResultMessage
    } = usePaymentsManager(selectedToken);

    // Fetch split bills
    useEffect(() => {
        const fetchSplitBills = async () => {
            if (!user) return;

            setLoading(true);
            try {
                // Get splits initiated by user
                const initiatedResponse = await getInitiatedSplitBills();
                setInitiatedSplits(initiatedResponse.data);

                // Get splits where user is a participant
                const participatingResponse = await getParticipantSplitBills();
                setParticipatingSplits(participatingResponse.data);
            } catch (error) {
                console.error('Failed to fetch split bills:', error);
                toast.error('Failed to load your split bills');
            } finally {
                setLoading(false);
            }
        };

        fetchSplitBills();
    }, [refreshTrigger, user]);

    // Fetch exchange rate when selected token changes
    useEffect(() => {
        const fetchExchangeRate = async () => {
            if (!selectedToken || !publicClient) return;

            try {
                const chainId = publicClient.chain?.id || 1;

                let provider;
                if ('transport' in publicClient && 'url' in publicClient.transport) {
                    provider = new ethers.JsonRpcProvider(publicClient.transport.url);
                } else {
                    provider = new ethers.JsonRpcProvider();
                }

                const rate = await getExchangeRate(provider, selectedToken.symbol, chainId);
                setExchangeRate(rate);
                console.log(`Exchange rate loaded: 1 USD = ${rate} ${selectedToken.symbol}`);
            } catch (error) {
                console.error(`Failed to fetch ${selectedToken.symbol} exchange rate:`, error);
                // Fallback exchange rate
                if (selectedToken.symbol.includes('USD')) {
                    setExchangeRate(1);
                } else {
                    setExchangeRate(0.001); // Default fallback
                }
            }
        };

        fetchExchangeRate();
    }, [selectedToken, publicClient]);

    // Find the participant entry for the current user
    const getCurrentUserParticipant = (split: SplitBill) => {
        if (!address || !user?.email) return null;

        return split.participants.find(
            p => p.email === user.email || p.walletAddress === address
        );
    };

    // Check if a split is completed (all participants paid)
    const isSplitCompleted = (split: SplitBill) => {
        return split.participants.every(p => p.status === 'paid');
    };

    // Handle opening split details
    const handleViewSplit = (split: SplitBill) => {
        setSelectedSplit(split);
    };

    // Handle opening payment modal
    const handlePaySplit = (split: SplitBill) => {
        setPaymentSplit(split);
        setIsPayModalOpen(true);
    };

    // Convert USD amount to token amount
    const convertUsdToToken = (usdAmount: number): number => {
        return usdAmount * exchangeRate;
    };

    // Format token amount with appropriate decimals
    const formatTokenAmount = (amount: number): string => {
        if (amount >= 0.01) {
            return amount.toFixed(4);
        } else {
            return amount.toFixed(8);
        }
    };

    // Execute payment to split initiator
    const handleMakePayment = async () => {
        if (!paymentSplit || !address || !user) return;

        // Find the current user's part of the split
        const userParticipant = getCurrentUserParticipant(paymentSplit);
        if (!userParticipant) {
            toast.error('Could not find your payment details');
            return;
        }

        if (userParticipant.status === 'paid') {
            toast('You have already paid your share');
            setIsPayModalOpen(false);
            return;
        }

        // Generate a payment ID
        const paymentId = `SPLIT-PAY-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

        // Reset any previous result message
        setResultMessage({ type: '', message: '' });

        try {
            // Convert USD amount to token amount with proper decimal handling
            const tokenAmount = convertUsdToToken(userParticipant.amount);

            // Format to a maximum of 8 decimal places to prevent precision errors
            // Use ethers.js utils to ensure correct formatting for blockchain transactions
            let formattedAmount;

            if (tokenAmount < 0.00001) {
                // For very small amounts, use a fixed number of decimals
                formattedAmount = tokenAmount.toFixed(8);
            } else {
                formattedAmount = tokenAmount.toFixed(8);
            }

            console.log(`Payment amount: ${userParticipant.amount} USD → ${formattedAmount} ${selectedToken?.symbol || 'ETH'}`);

            // Make the payment using EVM payment system with the properly formatted token amount
            await sendPayment(
                paymentId,
                paymentSplit.initiatorWalletAddress,
                formattedAmount
            );

            // If payment was successful (monitored in the effect below)
        } catch (error) {
            console.error('Payment failed:', error);
            toast.error('Failed to make payment');
        }
    };

    // Monitor for successful payment
    useEffect(() => {
        if (paymentSplit && resultMessage.type === 'success' && resultMessage.message.includes('Hash:') && user?.email) {
            // Extract transaction hash - adjusted for EVM tx hash format
            const txHash = resultMessage.message.split('Hash: ')[1];

            // Update the participant payment status in the backend
            const updatePaymentStatus = async () => {
                try {
                    await updateParticipantPayment(
                        paymentSplit.splitId,
                        user.email,
                        txHash
                    );

                    // Refresh the participant list
                    const updatedParticipating = await getParticipantSplitBills();
                    setParticipatingSplits(updatedParticipating.data);

                    toast.success('Your payment has been recorded');

                    setTimeout(() => {
                        setIsPayModalOpen(false);
                        setPaymentSplit(null);
                    }, 2000);
                } catch (error) {
                    console.error('Failed to update payment status:', error);
                    toast.error('Payment was sent but failed to update status');
                }
            };

            updatePaymentStatus();
        }
    }, [resultMessage, paymentSplit, user?.email]);

    // Format date to be more readable
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Get status indicator for a split bill
    const getSplitStatusIndicator = (split: SplitBill) => {
        switch (split.status) {
            case 'active':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'cancelled':
                return <X className="h-5 w-5 text-red-500" />;
            default:
                return null;
        }
    };

    // If no user is logged in, show a message
    if (!user) {
        return (
            <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-md">
                Please sign in to view your split bills
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const displayedSplits = activeTab === 'initiated' ? initiatedSplits : participatingSplits;
    const tokenSymbol = selectedToken?.symbol || 'ETH';

    return (
        <div className="mt-4 w-full">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'initiated'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                    onClick={() => setActiveTab('initiated')}
                >
                    Splits You Created
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm ${activeTab === 'participating'
                        ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'text-gray-500 dark:text-gray-400'
                        }`}
                    onClick={() => setActiveTab('participating')}
                >
                    Splits to Pay
                </button>
            </div>

            {displayedSplits.length === 0 ? (
                <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-md">
                    No split bills found
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedSplits.map((split) => (
                        <div
                            key={split._id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center">
                                        <h3 className="font-medium text-lg">Split {split.splitId}</h3>
                                        <div className="ml-2">
                                            {getSplitStatusIndicator(split)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        For invoice {split.invoiceNumber}
                                    </p>
                                    <p className="text-sm mt-1">
                                        <span className="text-gray-500 dark:text-gray-400">Total: </span>
                                        <span className="font-medium">{split.totalAmount} USD</span>
                                    </p>
                                    <p className="text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Due: </span>
                                        <span className="font-medium">{formatDate(split.dueDate)}</span>
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleViewSplit(split)}
                                        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        View Details
                                    </button>

                                    {activeTab === 'participating' && (
                                        (() => {
                                            const userPart = getCurrentUserParticipant(split);
                                            if (!userPart) return null;

                                            if (userPart.status === 'paid') {
                                                return (
                                                    <span className="text-sm text-green-600 dark:text-green-500 flex items-center">
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Paid
                                                    </span>
                                                );
                                            }

                                            if (split.status === 'active') {
                                                return (
                                                    <button
                                                        onClick={() => handlePaySplit(split)}
                                                        className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                                    >
                                                        Pay {userPart.amount} USD
                                                    </button>
                                                );
                                            }

                                            return null;
                                        })()
                                    )}
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <Users className="h-4 w-4 mr-1" />
                                    <span>
                                        {split.participants.filter(p => p.status === 'paid').length} of {split.participants.length} paid
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Split Detail Modal */}
            {selectedSplit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Split Details</h3>
                            <button
                                onClick={() => setSelectedSplit(null)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Split ID</p>
                                    <p className="font-medium">{selectedSplit.splitId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Invoice</p>
                                    <p className="font-medium">{selectedSplit.invoiceNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                                    <p className="font-medium">{selectedSplit.totalAmount} USD</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                                    <p className="font-medium">{formatDate(selectedSplit.dueDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <div className="flex items-center">
                                        {getSplitStatusIndicator(selectedSplit)}
                                        <span className="ml-2 capitalize">{selectedSplit.status}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                                    <p className="font-medium">{formatDate(selectedSplit.createdAt)}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Participants</h4>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
                                    {selectedSplit.participants.map((participant, index) => (
                                        <div
                                            key={index}
                                            className="flex justify-between items-center p-3"
                                        >
                                            <div>
                                                <p className="font-medium">{participant.nickname}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{participant.email}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{participant.amount} USD</p>
                                                <p className={`text-sm ${participant.status === 'paid'
                                                    ? 'text-green-600 dark:text-green-500'
                                                    : 'text-yellow-600 dark:text-yellow-500'
                                                    }`}>
                                                    {participant.status === 'paid' ? (
                                                        <span className="flex items-center justify-end">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Paid on {formatDate(participant.paymentDate || '')}
                                                        </span>
                                                    ) : (
                                                        <span>Pending</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {selectedSplit.status === 'completed' && selectedSplit.completedDate && (
                                <div className="bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-md p-3">
                                    <p className="text-green-700 dark:text-green-400 flex items-center">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        All participants have paid. Split completed on {formatDate(selectedSplit.completedDate)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedSplit(null)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal - Updated to show both USD and token amounts */}
            {isPayModalOpen && paymentSplit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Pay Your Share</h3>
                            {!paymentLoading && (
                                <button
                                    onClick={() => setIsPayModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                                <p className="font-medium">Split ID: {paymentSplit.splitId}</p>
                                <p className="text-sm mt-1">Invoice: {paymentSplit.invoiceNumber}</p>
                                <p className="text-sm mt-1">Due: {formatDate(paymentSplit.dueDate)}</p>
                            </div>

                            {(() => {
                                const userPart = getCurrentUserParticipant(paymentSplit);
                                if (!userPart) return null;

                                // Calculate token amount from USD amount
                                const tokenAmount = convertUsdToToken(userPart.amount);

                                return (
                                    <div className="p-4 border border-blue-100 dark:border-blue-900 rounded-md">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium flex items-center">
                                                <DollarSign className="h-4 w-4 mr-1" />
                                                USD Amount:
                                            </span>
                                            <span className="font-bold">{userPart.amount} USD</span>
                                        </div>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-medium">Token Equivalent:</span>
                                            <span className="font-bold">{formatTokenAmount(tokenAmount)} {selectedToken?.symbol || 'ETH'}</span>
                                        </div>

                                        <div className="text-xs text-gray-500 mt-1">
                                            Exchange Rate: 1 USD = {exchangeRate.toFixed(6)} {selectedToken?.symbol || 'ETH'}
                                        </div>

                                        <p className="text-sm mt-3">
                                            Paying to: {paymentSplit.initiatorWalletAddress.substring(0, 8)}...
                                        </p>
                                    </div>
                                );
                            })()}

                            {/* Payment Status/Messages */}
                            {paymentLoading && (
                                <ResultMessageDisplay
                                    message={{
                                        type: 'info',
                                        message: "Processing your payment..."
                                    }}
                                />
                            )}

                            {resultMessage.type && (
                                <ResultMessageDisplay
                                    message={resultMessage}
                                    onDismiss={() => setResultMessage({ type: '', message: '' })}
                                />
                            )}
                        </div>

                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setIsPayModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                                disabled={paymentLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMakePayment}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                                disabled={paymentLoading || resultMessage.type === 'success'}
                            >
                                {paymentLoading ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    'Confirm Payment'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};