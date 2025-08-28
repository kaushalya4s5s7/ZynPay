"use client";

import { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { X, Plus, Minus, Users } from 'lucide-react';
import { fetchAllAddresses, AddressBookEntry } from '../../api/p2pApi';
import { createSplitBill } from '@/api/SplitBillApi';
import { toast } from 'react-hot-toast';
import { getExchangeRate } from '@/lib/chainlink-helper';
import { ethers } from 'ethers';
import { ResultMessageDisplay } from './ResultMessegeDisplay';

interface SplitBillModalProps {
    invoice: {
        _id: string;
        invoiceNumber: string;
        amount: number;
        dueDate: string;
    };
    onClose: () => void;
    onSuccess: () => void;
    tokenSymbol: string;
}

interface Participant {
    nickname: string;
    amount: number; // USD amount
    tokenAmount: number; // Token amount (for display only)
}

export const SplitBillModal = ({ invoice, onClose, onSuccess, tokenSymbol = 'ETH' }: SplitBillModalProps) => {
    const [contacts, setContacts] = useState<AddressBookEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [exchangeRate, setExchangeRate] = useState(0);
    const [tokenAmount, setTokenAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0); // USD remaining
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { address } = useAccount();
    const publicClient = usePublicClient();
    const walletAddress = address || '';

    // Format token amount with appropriate decimals
    const formatTokenAmount = (amount: number): string => {
        if (amount >= 0.01) {
            return amount.toFixed(4);
        } else {
            return amount.toFixed(8);
        }
    };

    useEffect(() => {
        const fetchExchangeRate = async () => {
            if (!publicClient) return;

            try {
                const chainId = publicClient.chain?.id || 1;

                let provider;
                if ('transport' in publicClient && 'url' in publicClient.transport) {
                    provider = new ethers.JsonRpcProvider(publicClient.transport.url);
                } else {
                    provider = new ethers.JsonRpcProvider();
                }

                const rate = await getExchangeRate(provider, tokenSymbol, chainId);
                setExchangeRate(rate);
                console.log(`Exchange rate loaded: 1 USD = ${rate} ${tokenSymbol}`);

                // Calculate token equivalent for display only
                setTokenAmount(invoice.amount * rate);
            } catch (error) {
                console.error(`Failed to fetch ${tokenSymbol} exchange rate:`, error);
                if (tokenSymbol.includes('USD')) {
                    setExchangeRate(1);
                    setTokenAmount(invoice.amount);
                } else {
                    setExchangeRate(0.001);
                    setTokenAmount(invoice.amount * 0.001);
                }
            }
        };

        fetchExchangeRate();
    }, [publicClient, tokenSymbol, invoice.amount]);

    // Initialize remaining amount in USD
    useEffect(() => {
        setRemainingAmount(invoice.amount);
    }, [invoice.amount]);

    useEffect(() => {
        const loadContacts = async () => {
            setIsLoading(true);
            try {
                const response = await fetchAllAddresses();
                setContacts(response.data);
            } catch (error) {
                console.error('Failed to load contacts:', error);
                toast.error('Failed to load your contacts');
                setError('Could not load your contacts. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        loadContacts();
    }, []);

    // Update remaining amount in USD when participants change
    useEffect(() => {
        const totalSplit = participants.reduce((sum, p) => sum + p.amount, 0);
        const remaining = parseFloat((invoice.amount - totalSplit).toFixed(2));
        setRemainingAmount(remaining);
    }, [participants, invoice.amount]);

    const addParticipant = () => {
        if (contacts.length === 0) {
            setError('No contacts available in your address book.');
            return;
        }

        const availableContacts = contacts.filter(
            contact => !participants.some(p => p.nickname === contact.nickname)
        );

        if (availableContacts.length === 0) {
            setError('All your contacts have been added already.');
            return;
        }

        // Default to 50% of remaining USD amount
        const defaultAmount = parseFloat((remainingAmount * 0.5).toFixed(2));
        const tokenEquivalent = parseFloat((defaultAmount * exchangeRate).toFixed(8));

        // Add new participant with USD amount and token equivalent
        setParticipants([
            ...participants,
            {
                nickname: availableContacts[0].nickname,
                amount: defaultAmount,
                tokenAmount: tokenEquivalent
            }
        ]);
    };

    const removeParticipant = (index: number) => {
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleAmountChange = (index: number, newAmount: number) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index].amount = newAmount;
        // Update token equivalent
        updatedParticipants[index].tokenAmount = parseFloat((newAmount * exchangeRate).toFixed(8));
        setParticipants(updatedParticipants);
    };

    const handleContactChange = (index: number, nickname: string) => {
        const updatedParticipants = [...participants];
        updatedParticipants[index].nickname = nickname;
        setParticipants(updatedParticipants);
    };

    const handleSubmit = async () => {
        if (participants.length === 0) {
            setError('Add at least one friend to split the bill with.');
            return;
        }

        // Add validation to prevent negative remaining amount
        if (remainingAmount < 0) {
            setError('The total split amount exceeds the invoice amount.');
            return;
        }

        if (!walletAddress) {
            setError('Your wallet address is required to create a split.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            // Send only the USD amounts to the backend
            const participantsToSubmit = participants.map(p => ({
                nickname: p.nickname,
                amount: p.amount  // USD amount for backend
            }));

            await createSplitBill(invoice._id, walletAddress, participantsToSubmit);
            toast.success('Split bill created successfully!');
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Failed to create split bill:', error);
            setError(error.response?.data?.message || 'Failed to create split bill. Please try again.');
            toast.error('Failed to create split bill');
        } finally {
            setIsSubmitting(false);
        }
    };

    const splitEvenly = () => {
        if (participants.length === 0) {
            setError('Add friends first to split evenly.');
            return;
        }

        // Split USD amount evenly
        const totalParties = participants.length + 1; // +1 for you
        const evenAmount = parseFloat((invoice.amount / totalParties).toFixed(2));
        const evenTokenAmount = parseFloat((evenAmount * exchangeRate).toFixed(8));

        // Set even USD amount for all participants with token equivalent
        const updatedParticipants = participants.map(p => ({
            ...p,
            amount: evenAmount,
            tokenAmount: evenTokenAmount
        }));

        setParticipants(updatedParticipants);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Split Invoice {invoice.invoiceNumber}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        disabled={isSubmitting}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Invoice Amount (USD)</p>
                            <p className="font-medium text-lg">{invoice.amount} USD</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                            <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Exchange Rate:</span>
                            <span className="font-medium">1 USD = {exchangeRate > 0 ? exchangeRate.toFixed(6) : '...'} {tokenSymbol}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total in {tokenSymbol}:</span>
                            <span className="font-bold text-lg">{formatTokenAmount(tokenAmount)} {tokenSymbol}</span>
                        </div>
                    </div>

                    {error && (
                        <ResultMessageDisplay
                            message={{
                                type: 'error',
                                message: error
                            }}
                            onDismiss={() => setError('')}
                        />
                    )}

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <Users className="h-5 w-5 mr-2" />
                                <h4 className="font-medium">Friends to Split With</h4>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    onClick={splitEvenly}
                                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline mr-4"
                                    disabled={participants.length === 0 || isSubmitting}
                                >
                                    Split Evenly
                                </button>
                                <button
                                    type="button"
                                    onClick={addParticipant}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded text-sm"
                                    disabled={isLoading || isSubmitting}
                                >
                                    <Plus size={14} className="inline mr-1" />
                                    Add Friend
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-4">Loading contacts...</div>
                        ) : (
                            <div>
                                {participants.length === 0 ? (
                                    <div className="text-center py-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                                        Click "Add Friend" to start splitting
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {participants.map((participant, index) => (
                                            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                                                <div className="flex-1">
                                                    <select
                                                        value={participant.nickname}
                                                        onChange={(e) => handleContactChange(index, e.target.value)}
                                                        className="w-full bg-transparent border-b border-gray-300 dark:border-gray-600 py-1 focus:outline-none"
                                                        disabled={isSubmitting}
                                                    >
                                                        {contacts.map((contact) => (
                                                            <option
                                                                key={contact._id}
                                                                value={contact.nickname}
                                                                disabled={participants.some(
                                                                    (p, i) => i !== index && p.nickname === contact.nickname
                                                                )}
                                                            >
                                                                {contact.nickname}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="number"
                                                            value={participant.amount}
                                                            onChange={(e) => handleAmountChange(index, parseFloat(e.target.value) || 0)}
                                                            step="0.01"
                                                            min="0.01"
                                                            max={invoice.amount.toString()}
                                                            className="w-20 bg-transparent border-b border-gray-300 dark:border-gray-600 py-1 text-right focus:outline-none"
                                                            disabled={isSubmitting}
                                                        />
                                                        <span className="ml-1">USD</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        ≈ {participant.tokenAmount.toFixed(8)} {tokenSymbol}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeParticipant(index)}
                                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                                                    disabled={isSubmitting}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex justify-between mt-4 text-sm">
                                    <div>
                                        <span className="font-medium">Your portion (remaining):</span>
                                        <div className="text-xs text-gray-500 mt-1">
                                            ≈ {(remainingAmount * exchangeRate).toFixed(8)} {tokenSymbol}
                                        </div>
                                    </div>
                                    <span className={`font-medium ${remainingAmount < 0 ? 'text-red-600 dark:text-red-500' : 'text-green-600 dark:text-green-500'}`}>
                                        {remainingAmount.toFixed(2)} USD
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        disabled={
                            isSubmitting ||
                            isLoading ||
                            participants.length === 0 ||
                            remainingAmount < 0 // Only prevent negative remaining amounts
                        }
                    >
                        {isSubmitting ? 'Creating...' : 'Create Split Bill'}
                    </button>
                </div>
            </div>
        </div>
    );
};