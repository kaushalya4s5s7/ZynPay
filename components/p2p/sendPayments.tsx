"use client";

import { useState, useEffect, KeyboardEvent } from 'react';
import { useAccount, useChainId, usePublicClient } from 'wagmi';
import { Search, DollarSign } from 'lucide-react';
import { fetchAllAddresses, searchAddresses, resolveRecipient } from '@/api/p2pApi';
import { ResultMessageDisplay } from './ResultMessegeDisplay';
import { getExchangeRate } from '@/lib/chainlink-helper';
import { Token } from '@/lib/evm-tokens-mainnet-tfs';
import { ethers } from 'ethers';

export default function SendPaymentTab({
    selectedToken,
    isLoading,
    resultMessage,
    onSendPayment,
    onDismissResult
}: {
    selectedToken: Token | undefined;
    isLoading: boolean;
    resultMessage?: { type: string; message: string };
    onSendPayment: (paymentId: string, payeeAddress: string, amount: string) => void;
    onDismissResult?: () => void;
}) {
    const [amount, setAmount] = useState(''); // Token amount
    const [usdAmount, setUsdAmount] = useState(''); // USD amount
    const [exchangeRate, setExchangeRate] = useState(0);
    const [isConvertingPrice, setIsConvertingPrice] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [paymentId, setPaymentId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [localIsLoading, setLocalIsLoading] = useState(false);

    // Wagmi hooks
    const { address } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();

    // Combined message state - using parent message or local error
    const displayMessage = errorMessage
        ? { type: 'error', message: errorMessage }
        : resultMessage || { type: '', message: '' };

    interface AddressBookEntry {
        _id: string;
        nickname: string;
        walletAddress: string;
    }

    const [addressBookEntries, setAddressBookEntries] = useState<AddressBookEntry[]>([]);
    const [showAddressBookDropdown, setShowAddressBookDropdown] = useState(false);
    const [addressSearchQuery, setAddressSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    // Initialize payment ID
    useEffect(() => {
        setPaymentId(`payment-${Date.now()}-${Math.floor(Math.random() * 1000000)}`);
    }, []);

    // Fetch address book
    useEffect(() => {
        if (address) {
            loadAddressBook();
        }
    }, [address]);

    // Sync loading state from parent
    useEffect(() => {
        setLocalIsLoading(isLoading);
    }, [isLoading]);

    // Fetch token price on component mount or when token changes
    useEffect(() => {
        const fetchExchangeRate = async () => {
            if (!selectedToken || !chainId) return;

            try {
                setIsConvertingPrice(true);
                // Create provider from publicClient
                let provider;
                if (publicClient && 'transport' in publicClient && 'url' in publicClient.transport) {
                    provider = new ethers.JsonRpcProvider(publicClient.transport.url);
                } else {
                    // Fallback for testing
                    provider = new ethers.JsonRpcProvider();
                }

                const rate = await getExchangeRate(
                    provider,
                    selectedToken.symbol,
                    chainId
                );

                setExchangeRate(rate);
            } catch (error) {
                console.error(`Failed to fetch ${selectedToken?.symbol} exchange rate:`, error);
                setErrorMessage(`Could not fetch current ${selectedToken?.symbol} price. Using fallback rate.`);

                // Set fallback rate based on token type
                if (selectedToken?.symbol.includes('USD')) {
                    setExchangeRate(1); // 1:1 for stablecoins
                } else {
                    setExchangeRate(0.001); // Generic fallback for other tokens
                }
            } finally {
                setIsConvertingPrice(false);
            }
        };

        fetchExchangeRate();
    }, [selectedToken, chainId, publicClient]);

    // Convert USD to token amount when USD amount changes
    useEffect(() => {
        const convertUsdToToken = async () => {
            if (!usdAmount || !selectedToken || isNaN(parseFloat(usdAmount)) || parseFloat(usdAmount) <= 0) {
                setAmount('');
                return;
            }

            setIsConvertingPrice(true);

            try {
                // If we don't have an exchange rate yet, use fallback
                const rate = exchangeRate > 0 ? exchangeRate : (selectedToken.symbol.includes('USD') ? 1 : 0.001);

                // Convert USD to token: USD amount × (Token/USD rate)
                const usdAmountNum = parseFloat(usdAmount);
                const tokenAmount = usdAmountNum * rate;

                // Format to 6 decimal places max
                setAmount(tokenAmount.toFixed(6));
            } catch (error) {
                console.error(`Error converting USD to ${selectedToken.symbol}:`, error);
                setErrorMessage(`Could not convert USD to ${selectedToken.symbol}. Please try again.`);
            } finally {
                setIsConvertingPrice(false);
            }
        };

        convertUsdToToken();
    }, [usdAmount, exchangeRate, selectedToken]);

    const handleDismissMessage = () => {
        setErrorMessage('');

        // Notify parent component if needed
        if (onDismissResult) {
            onDismissResult();
        }
    };

    const loadAddressBook = async () => {
        try {
            const response = await fetchAllAddresses();
            setAddressBookEntries(response.data);
        } catch (error) {
            console.error('Failed to load address book:', error);
        }
    };

    const handleAddressSearch = async (query: string) => {
        setAddressSearchQuery(query);

        if (query.length > 0) {
            setIsSearching(true);
            try {
                const result = await searchAddresses(query);
                setAddressBookEntries(result.data);
            } catch (error) {
                console.error('Address search failed:', error);
            } finally {
                setIsSearching(false);
            }
        } else {
            loadAddressBook();
        }
    };

    const selectContact = (contact: AddressBookEntry) => {
        setRecipient(contact.walletAddress);
        setShowAddressBookDropdown(false);
    };

    const handleSendPayment = async () => {
        if (!recipient || !amount) {
            setErrorMessage('Please provide both recipient and amount');
            return;
        }

        // Validate EVM address format
        if (!recipient.startsWith('0x') || recipient.length !== 42) {
            try {
                // Try to resolve if it's a nickname
                const resolvedAddress = await resolveRecipient(recipient);
                if (!resolvedAddress.startsWith('0x') || resolvedAddress.length !== 42) {
                    setErrorMessage('Invalid Ethereum address format');
                    return;
                }
                setRecipient(resolvedAddress);
            } catch (error) {
                setErrorMessage(`Could not resolve nickname: ${recipient}`);
                return;
            }
        }

        setErrorMessage('');
        // Set local loading state to true ONLY when actually sending payment
        setLocalIsLoading(true);

        try {
            onSendPayment(paymentId, recipient, amount);
            // Parent component will control the overall loading state
        } catch (error) {
            setErrorMessage('Payment failed: ' + (error instanceof Error ? error.message : String(error)));
            setLocalIsLoading(false);
        }
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setShowAddressBookDropdown(true);
            handleAddressSearch(recipient);
        }
    };

    const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRecipient(value);

        if (value.length > 2) {
            setShowAddressBookDropdown(true);
            handleAddressSearch(value);
        } else if (value.length === 0) {
            setShowAddressBookDropdown(false);
        }
    };

    const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow valid number inputs
        const value = e.target.value;
        if (value === '' || /^\d*\.?\d*$/.test(value)) {
            setUsdAmount(value);
        }
    };

    // Use either parent or local loading state
    const effectiveIsLoading = isLoading || localIsLoading;

    return (
        <div className="flex justify-center items-center">
            <div className="max-w-4xl w-full space-y-6 backdrop-blur-sm p-8 rounded-lg">
                <ResultMessageDisplay
                    message={displayMessage}
                    onDismiss={handleDismissMessage}
                />

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Recipient Address or Username
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={recipient}
                            onChange={handleRecipientChange}
                            onKeyPress={handleKeyPress}
                            className="w-full p-2 pr-10 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                            placeholder="0x... or username"
                            disabled={effectiveIsLoading}
                        />
                        <button
                            type="button"
                            onClick={() => {
                                setShowAddressBookDropdown(!showAddressBookDropdown);
                                if (!showAddressBookDropdown) loadAddressBook();
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            disabled={effectiveIsLoading}
                        >
                            <Search size={18} />
                        </button>

                        {showAddressBookDropdown && (
                            <div className="absolute z-10 w-full mt-1 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 rounded-md shadow-lg">
                                <div className="max-h-48 overflow-y-auto">
                                    {isSearching ? (
                                        <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                                            Searching...
                                        </div>
                                    ) : addressBookEntries.length > 0 ? (
                                        addressBookEntries.map((contact) => (
                                            <div
                                                key={contact._id}
                                                className="p-3 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 cursor-pointer border-b border-gray-200/50 dark:border-gray-700/50"
                                                onClick={() => selectContact(contact)}
                                            >
                                                <div className="font-medium text-gray-900 dark:text-white">{contact.nickname}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {contact.walletAddress}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-3 text-center text-gray-500 dark:text-gray-400">
                                            {addressSearchQuery ? 'No contacts found' : 'Your address book is empty'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* USD Amount Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Amount (USD)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <DollarSign size={16} className="text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={usdAmount}
                                onChange={handleUsdAmountChange}
                                className="w-full p-2 pl-8 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
                                placeholder="0.00"
                                disabled={effectiveIsLoading}
                            />
                        </div>
                    </div>

                    {/* Token Amount Display */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Equivalent in {selectedToken?.symbol || 'Token'}
                        </label>
                        <div className="relative">
                            {isConvertingPrice ? (
                                <div className="w-full p-2 bg-transparent border-b border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                                    Converting...
                                </div>
                            ) : (
                                <div className="w-full p-2 bg-transparent border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white">
                                    {amount ? `${amount} ${selectedToken?.symbol || 'Token'}` : `0.00 ${selectedToken?.symbol || 'Token'}`}
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Exchange Rate: 1 USD ≈ {exchangeRate > 0 ? exchangeRate.toFixed(6) : '...'} {selectedToken?.symbol || 'Token'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleSendPayment}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-md font-medium shadow-md transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={effectiveIsLoading || isConvertingPrice || !amount || !recipient}
                >
                    {effectiveIsLoading && localIsLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Payment...
                        </span>
                    ) : isConvertingPrice ? (
                        "Preparing..."
                    ) : (
                        `Send ${amount ? amount + ' ' + (selectedToken?.symbol || 'Token') : 'Payment'}`
                    )}
                </button>
            </div>
        </div>
    );
}