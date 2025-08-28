"use client"

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { parseUnits, formatUnits, keccak256 } from 'ethers';
import {
    useAccount,
    useSwitchChain,
    usePublicClient,
    useWalletClient,
    useWriteContract,
    useWaitForTransactionReceipt,
    useReadContract
} from 'wagmi';
import { getAddress, type Address, stringToHex, pad } from 'viem';
import { erc20Abi } from 'viem'; // Correct import path
import SecureTransferABI from '@/lib/SecureTransfer.json'; // Import the contract ABI from JSON file
import { SecurecontractMainnetAddresses, tokensPerMainnetChain, NATIVE_ADDRESS } from '@/lib/evm-tokens-mainnet-tfs';

// Use the imported contract ABI
const CONTRACT_ABI = SecureTransferABI.abi;

// Updated event types for Wagmi v2
type PaymentEvent = {
    eventName: string;
    paymentId: `0x${string}`;
    from?: `0x${string}`;
    to?: `0x${string}`;
    by?: `0x${string}`;
    amount: bigint;
    tokenAddress: `0x${string}`;
    blockHash: `0x${string}`;
};

// Helper function to process events from Wagmi v2
const processEventLogs = (logs: any[], eventName: string): PaymentEvent[] => {
    return logs.map(log => {
        // Extract arguments based on event type
        let event: PaymentEvent = {
            eventName,
            paymentId: log.args.paymentId,
            amount: log.args.amount,
            tokenAddress: log.args.tokenAddress,
            blockHash: log.blockHash
        };

        // Add specific fields based on event type
        if (eventName === 'PaymentSent') {
            event.from = log.args.from;
            event.to = log.args.to;
        } else {
            // For PaymentClaimed and PaymentReimbursed
            event.by = log.args.by;
        }

        return event;
    });
};

export function usePaymentsManager(selectedToken: any) {
    // Wallet and network hooks (updated for wagmi v2)
    const { address: currentAccount, chain } = useAccount();
    const publicClient = usePublicClient();
    const { data: walletClient } = useWalletClient();

    // Transaction hooks
    const { writeContractAsync } = useWriteContract();

    // State management
    const [tokenBalance, setTokenBalance] = useState('0');
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [resultMessage, setResultMessage] = useState({ type: '', message: '' });
    const [currentTxHash, setCurrentTxHash] = useState<Address | undefined>(undefined);

    // Get contract address for current chain
    const contractAddress = chain?.id ? SecurecontractMainnetAddresses[chain.id as keyof typeof SecurecontractMainnetAddresses] : undefined;

    // Transaction status tracking
    const { isLoading: isTxPending, isSuccess: isTxSuccess } =
        useWaitForTransactionReceipt({
            hash: currentTxHash,
        });

    // Get token balance using wagmi hook
    const { data: wagmiBalance } = useReadContract({
        address: selectedToken?.address !== NATIVE_ADDRESS
            ? selectedToken?.address as Address
            : undefined,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: currentAccount ? [currentAccount as Address] : undefined,
        query: {
            enabled: !!currentAccount &&
                !!selectedToken &&
                selectedToken.address !== NATIVE_ADDRESS,
        }
    });

    // Get native token balance
    const getNativeBalance = useCallback(async () => {
        if (!currentAccount || !publicClient) return BigInt(0);
        try {
            const balance = await publicClient.getBalance({
                address: currentAccount as Address
            });
            return balance;
        } catch (error) {
            console.error("Error getting native balance:", error);
            return BigInt(0);
        }
    }, [currentAccount, publicClient]);

    // Get native balance effect
    useEffect(() => {
        const fetchNativeBalance = async () => {
            if (selectedToken?.address === NATIVE_ADDRESS) {
                const balance = await getNativeBalance();
                setTokenBalance(formatUnits(balance, selectedToken.decimals || 18));
            }
        };

        fetchNativeBalance();
    }, [selectedToken, getNativeBalance]);

    // Update ERC20 token balance when data changes
    useEffect(() => {
        if (selectedToken && selectedToken.address !== NATIVE_ADDRESS && wagmiBalance) {
            setTokenBalance(formatUnits(wagmiBalance as bigint, selectedToken.decimals || 18));
        }
    }, [wagmiBalance, selectedToken]);

    // Fetch user's token balance (fallback method if wagmi hooks don't work)
    const fetchUserCoins = useCallback(async () => {
        if (!currentAccount || !publicClient || !selectedToken) return;

        try {
            let balance;

            if (selectedToken.address === NATIVE_ADDRESS) {
                // Native token (ETH, BNB, etc.)
                balance = await publicClient.getBalance({
                    address: currentAccount as Address
                });
            } else {
                // ERC20 token
                const tokenAddr = selectedToken.address as Address;
                balance = await publicClient.readContract({
                    address: tokenAddr,
                    abi: erc20Abi,
                    functionName: 'balanceOf',
                    args: [currentAccount as Address],
                });
            }

            // Format based on token decimals
            const decimals = selectedToken.decimals || 18;
            const formattedBalance = formatUnits(balance as bigint, decimals);
            setTokenBalance(formattedBalance);
        } catch (error) {
            console.error('Error fetching token balance:', error);
            toast.error(`Failed to fetch your ${selectedToken.symbol || 'token'} balance`);
        }
    }, [currentAccount, publicClient, selectedToken]);

    // Fetch payment events
    const fetchPayments = useCallback(async () => {
        if (!currentAccount || !publicClient || !contractAddress) return;

        try {
            setIsLoading(true);

            // Determine block range (look back ~1 day worth of blocks)
            const blockNumber = await publicClient.getBlockNumber();
            const fromBlock = BigInt(Math.max(0, Number(blockNumber) - 5760)); // ~1 day of blocks

            const normalizedAccount = getAddress(currentAccount as string);

            // Fetch and process events using publicClient
            const [sentByLogsResult, sentToLogsResult, claimedLogsResult, reimbursedLogsResult] = await Promise.all([
                // Sent by user
                publicClient.getContractEvents({
                    address: contractAddress as Address,
                    abi: CONTRACT_ABI,
                    eventName: 'PaymentSent',
                    fromBlock,
                    args: {
                        from: normalizedAccount as Address
                    }
                }),
                // Sent to user
                publicClient.getContractEvents({
                    address: contractAddress as Address,
                    abi: CONTRACT_ABI,
                    eventName: 'PaymentSent',
                    fromBlock,
                    args: {
                        to: normalizedAccount as Address
                    }
                }),
                // Claimed events
                publicClient.getContractEvents({
                    address: contractAddress as Address,
                    abi: CONTRACT_ABI,
                    eventName: 'PaymentClaimed',
                    fromBlock
                }),
                // Reimbursed events
                publicClient.getContractEvents({
                    address: contractAddress as Address,
                    abi: CONTRACT_ABI,
                    eventName: 'PaymentReimbursed',
                    fromBlock
                })
            ]);

            // Process the logs into our consistent format
            const sentByEvents = processEventLogs(sentByLogsResult, 'PaymentSent');
            const sentToEvents = processEventLogs(sentToLogsResult, 'PaymentSent');
            const claimedEvents = processEventLogs(claimedLogsResult, 'PaymentClaimed');
            const reimbursedEvents = processEventLogs(reimbursedLogsResult, 'PaymentReimbursed');

            // Create map to track payment statuses
            const paymentStatusMap = new Map();

            // Process claimed events
            for (const event of claimedEvents) {
                const block = await publicClient.getBlock({
                    blockHash: event.blockHash
                });
                paymentStatusMap.set(event.paymentId, {
                    status: 'CLAIMED',
                    timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
                    by: event.by
                });
            }

            // Process reimbursed events
            for (const event of reimbursedEvents) {
                const block = await publicClient.getBlock({
                    blockHash: event.blockHash
                });
                paymentStatusMap.set(event.paymentId, {
                    status: 'REIMBURSED',
                    timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString(),
                    by: event.by
                });
            }

            // Process payment events in parallel
            const processedEvents = await Promise.all([...sentByEvents, ...sentToEvents].map(async (event) => {
                const { paymentId, from, to, amount, tokenAddress } = event;

                // Get block timestamp
                const block = await publicClient.getBlock({
                    blockHash: event.blockHash
                });

                // Get payment status or default to SENT
                const statusInfo = paymentStatusMap.get(paymentId) || {
                    status: 'SENT',
                    timestamp: new Date(Number(block.timestamp) * 1000).toLocaleString()
                };

                // Get token info directly from predefined token lists
                let tokenInfo: { symbol: string; decimals: number };

                if (tokenAddress === NATIVE_ADDRESS) {
                    // Native token - get from chain's native currency info
                    const chainTokens = chain?.id ? tokensPerMainnetChain[chain.id] : undefined;
                    const nativeToken = chainTokens?.find(t => t.address === NATIVE_ADDRESS);

                    tokenInfo = {
                        symbol: nativeToken?.symbol || chain?.nativeCurrency?.symbol || 'ETH',
                        decimals: nativeToken?.decimals || 18
                    };
                } else {
                    // Try to find in our predefined token lists first
                    const chainTokens = chain?.id ? tokensPerMainnetChain[chain.id] : undefined;
                    const knownToken = chainTokens?.find(
                        t => t.address.toLowerCase() === tokenAddress.toLowerCase()
                    );

                    if (knownToken) {
                        // Use predefined token info
                        tokenInfo = {
                            symbol: knownToken.symbol,
                            decimals: knownToken.decimals
                        };
                    } else {
                        // Token not in our list, try to get from chain as fallback
                        try {
                            const symbol = await publicClient.readContract({
                                address: tokenAddress as Address,
                                abi: erc20Abi,
                                functionName: 'symbol'
                            });

                            const decimals = await publicClient.readContract({
                                address: tokenAddress as Address,
                                abi: erc20Abi,
                                functionName: 'decimals'
                            });

                            tokenInfo = {
                                symbol: symbol as string,
                                decimals: Number(decimals)
                            };
                        } catch (error) {
                            // If all else fails, use generic values
                            console.warn(`Could not get info for token at ${tokenAddress}`);
                            tokenInfo = {
                                symbol: 'UNKNOWN',
                                decimals: 18
                            };
                        }
                    }
                }

                // Format amount based on token decimals
                const formattedAmount = formatUnits(amount, tokenInfo.decimals);

                return {
                    parsedJson: {
                        payment_id: paymentId,
                        payment_object_id: paymentId, // For compatibility with original hook
                        from,
                        to,
                        amount: formattedAmount,
                        tokenAddress,
                        tokenSymbol: tokenInfo.symbol,
                        created_at: Number(block.timestamp),
                        statusInfo
                    }
                };
            }));

            setPayments(processedEvents);
        } catch (error) {
            console.error('Error fetching payments:', error);
            toast.error('Failed to fetch payment history');
        } finally {
            setIsLoading(false);
        }
    }, [currentAccount, publicClient, contractAddress, chain]);

    // Load data when component mounts or dependencies change
    useEffect(() => {
        if (currentAccount && publicClient) {
            fetchUserCoins();
            fetchPayments();
        }
    }, [currentAccount, publicClient, selectedToken, chain, fetchUserCoins, fetchPayments]);

    // Check token allowance if needed for ERC20
    const { data: tokenAllowance, refetch: refetchAllowance } = useReadContract({
        address: selectedToken?.address !== NATIVE_ADDRESS
            ? selectedToken?.address as Address
            : undefined,
        abi: erc20Abi,
        functionName: 'allowance',
        args: currentAccount && contractAddress
            ? [currentAccount as Address, contractAddress as Address]
            : undefined,
        query: {
            enabled: !!currentAccount &&
                !!contractAddress &&
                !!selectedToken &&
                selectedToken.address !== NATIVE_ADDRESS,
        }
    });

    // Helper function to convert string to bytes32 using viem
    const getStringAsBytes32 = (str: string): `0x${string}` => {
        // Use keccak256 to hash the string - this creates a unique bytes32 identifier
        // and avoids potential encoding issues with plain string conversion
        return keccak256(stringToHex(str)) as `0x${string}`;
    };

    // Add this function to check network health before transactions
    const checkNetworkHealth = async (): Promise<boolean> => {
        if (!publicClient) return false;

        try {
            // Check if we can get the current block
            await publicClient.getBlockNumber();
            return true;
        } catch (error) {
            console.error("Network health check failed:", error);
            return false;
        }
    };

    // Add this function to get gas estimates with doubled values
    const getDoubledGasEstimate = async () => {
        if (!publicClient) return undefined;

        try {
            // For EIP-1559 compatible chains
            if (publicClient.chain?.fees?.baseFeeMultiplier) {
                const feeData = await publicClient.estimateFeesPerGas();

                // Double both the max fee and priority fee
                return {
                    maxFeePerGas: feeData.maxFeePerGas ? feeData.maxFeePerGas * BigInt(2) : undefined,
                    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? feeData.maxPriorityFeePerGas * BigInt(2) : undefined,
                };
            }
            // For legacy chains
            else {
                const gasPrice = await publicClient.getGasPrice();
                // Double the gas price
                return {
                    gasPrice: gasPrice * BigInt(2)
                };
            }
        } catch (error) {
            console.error("Error estimating gas:", error);
            return undefined;
        }
    };

    // Send payment function (handles both ETH and ERC20)
    const sendPayment = async (paymentId: string, payeeAddress: string, amount: string) => {
        setIsLoading(true);
        setResultMessage({ type: '', message: '' });

        if (!currentAccount || !walletClient) {
            setResultMessage({ type: 'error', message: 'Wallet not connected' });
            setIsLoading(false);
            return;
        }

        if (!paymentId || !payeeAddress || !amount) {
            setResultMessage({ type: 'error', message: 'Please fill all required fields' });
            setIsLoading(false);
            return;
        }

        // Validate amount
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            setResultMessage({ type: 'error', message: 'Please enter a valid amount greater than zero' });
            setIsLoading(false);
            return;
        }

        if (!contractAddress) {
            setResultMessage({ type: 'error', message: 'Contract not deployed on this network' });
            setIsLoading(false);
            return;
        }

        // Check network health
        const isNetworkHealthy = await checkNetworkHealth();
        if (!isNetworkHealthy) {
            setResultMessage({
                type: 'error',
                message: 'Network connection issues detected. Please try again later.'
            });
            setIsLoading(false);
            return;
        }

        try {
            // Generate a unique payment ID by combining the user's ID with timestamp
            // This helps avoid payment ID collisions
            const uniquePaymentId = `${paymentId}-${Date.now()}-${Math.floor(Math.random() * 10000000)}-${crypto.randomUUID().slice(0, 8)}`;
            const bytesPaymentId = getStringAsBytes32(uniquePaymentId);
            console.log("Payment ID:", uniquePaymentId);
            console.log("Bytes Payment ID:", bytesPaymentId);
            console.log("Payee Address:", payeeAddress);

            // Format amount based on token decimals
            const decimals = selectedToken.decimals || 18;
            // Convert string to BigInt directly to avoid potential conversion issues
            const amountInWei = BigInt(parseUnits(amount, decimals).toString());
            console.log("Amount in Wei:", amountInWei.toString());

            // Check if the token is native (ETH, MATIC, etc.)
            const isNativeToken = selectedToken.address === NATIVE_ADDRESS ||
                selectedToken.address === '0x0000000000000000000000000000000000001010' ||
                selectedToken.symbol?.toUpperCase() === chain?.nativeCurrency?.symbol?.toUpperCase();

            console.log("Is Native Token:", isNativeToken);
            console.log("Selected Token:", selectedToken);
            console.log("Contract Address:", contractAddress);

            if (isNativeToken) {
                // Send native token (ETH, BNB, MATIC, etc.)
                setResultMessage({ type: 'info', message: 'Preparing transaction, please confirm in your wallet...' });

                try {
                    // Use hardcoded gas limit for sendETH function to avoid gas estimation issues
                    const gasLimit = BigInt(3000000); // Fixed 3M gas limit
                    console.log(`Using hardcoded gas limit: ${gasLimit}`);

                    // Get gas price parameters
                    const gasParams = await getDoubledGasEstimate();

                    // Log the full transaction parameters for debugging
                    console.log("Sending transaction with params:", {
                        address: contractAddress,
                        functionName: 'sendETH',
                        args: [bytesPaymentId, payeeAddress],
                        value: amountInWei,
                        gas: gasLimit,
                        ...gasParams // Include doubled gas parameters
                    });

                    // Ensure we're using the correct type for the contract address
                    const contractAddr = contractAddress as `0x${string}`;

                    const txHash = await writeContractAsync({
                        address: contractAddr,
                        abi: CONTRACT_ABI,
                        functionName: 'sendETH',
                        args: [bytesPaymentId, payeeAddress as `0x${string}`],
                        value: amountInWei,
                        gas: gasLimit, // Apply hardcoded 3M gas limit
                        ...gasParams // Apply doubled gas parameters
                    });

                    setCurrentTxHash(txHash);
                    setResultMessage({ type: 'info', message: 'Transaction sent. Waiting for confirmation...' });
                } catch (innerError: any) {
                    // Add more detailed error logging
                    console.error("Inner transaction error:", innerError);

                    // Try to extract more specific error information
                    if (innerError.shortMessage) {
                        console.error("Error short message:", innerError.shortMessage);
                    }

                    // Check for inner cause
                    if (innerError.cause) {
                        console.error("Error cause:", innerError.cause);
                    }

                    throw innerError;
                }
            } else {
                // For ERC20 tokens - apply the same careful typing and error handling
                // Rest of your ERC20 logic...
            }
        } catch (error: any) {
            console.error('Transaction failed:', error);
            // Extract the specific error message from the RPC error if possible
            let errorMessage = error.message || 'Unknown error';

            // Try to parse out a cleaner error message if available
            const revertReasonMatch = errorMessage.match(/reverted with reason string '([^']+)'/);
            if (revertReasonMatch && revertReasonMatch[1]) {
                errorMessage = revertReasonMatch[1];
            }

            setResultMessage({
                type: 'error',
                message: `Error: ${errorMessage}`
            });
            toast.error(`Transaction failed: ${errorMessage}`);
            setIsLoading(false);
        }
    };

    // Effect to handle transaction status changes
    useEffect(() => {
        if (isTxSuccess && currentTxHash) {
            setResultMessage({
                type: 'success',
                message: `Transaction successful! Hash: ${currentTxHash}`
            });
            toast.success('Transaction completed successfully!');

            // Refresh data
            fetchPayments();
            fetchUserCoins();
            setIsLoading(false);

            // Reset transaction hash after success
            setTimeout(() => {
                setCurrentTxHash(undefined);
            }, 5000);
        }
    }, [isTxSuccess, currentTxHash, fetchPayments, fetchUserCoins]);

    // Execute claim or reimburse action
    const executePaymentAction = async (paymentObjectId: string, action: 'claim' | 'reimburse') => {
        if (!paymentObjectId) {
            setResultMessage({
                type: 'error',
                message: 'Please enter a payment ID'
            });
            return;
        }

        if (!currentAccount || !walletClient) {
            setResultMessage({
                type: 'error',
                message: 'Wallet not connected'
            });
            return;
        }

        // Check if payment is actionable
        const payment = payments.find(p =>
            p.parsedJson.payment_id === paymentObjectId ||
            p.parsedJson.payment_object_id === paymentObjectId
        );

        if (payment && payment.parsedJson.statusInfo?.status !== 'SENT') {
            setResultMessage({
                type: 'error',
                message: `This payment cannot be ${action}ed because it has status: ${payment.parsedJson.statusInfo?.status}`
            });
            toast.error(`Payment is not in a ${action}able state`);
            return;
        }

        setIsLoading(true);
        setResultMessage({ type: 'info', message: 'Preparing transaction...' });

        try {
            if (!contractAddress) {
                throw new Error('Contract address not available');
            }

            // Use the payment ID as is if it's a bytes32 hash, otherwise hash it
            const bytesPaymentId = paymentObjectId.startsWith('0x') && paymentObjectId.length === 66
                ? paymentObjectId as `0x${string}`
                : getStringAsBytes32(paymentObjectId);

            // Call appropriate contract function (either claim or reimburse)
            setResultMessage({ type: 'info', message: `Initiating ${action}. Please confirm in your wallet...` });

            // Use hardcoded gas limit for claim/reimburse functions
            const gasLimit = BigInt(3000000); // Fixed 3M gas limit
            console.log(`Using hardcoded gas limit for ${action}: ${gasLimit}`);

            // Get gas price parameters
            const gasParams = await getDoubledGasEstimate();

            const txHash = await writeContractAsync({
                address: contractAddress as Address,
                abi: CONTRACT_ABI,
                functionName: action,
                args: [bytesPaymentId],
                gas: gasLimit, // Apply hardcoded 3M gas limit
                ...gasParams // Apply doubled gas parameters
            });

            setCurrentTxHash(txHash);
            setResultMessage({ type: 'info', message: 'Transaction sent. Waiting for confirmation...' });

        } catch (error: any) {
            console.error(`${action} transaction failed:`, error);
            setResultMessage({
                type: 'error',
                message: `Error: ${error.message || 'Transaction failed'}`
            });
            toast.error(`Transaction failed: ${error.message}`);
            setIsLoading(false);
        }
    };

    return {
        currentAccount,
        coinObjects: [{ balance: tokenBalance }], // For compatibility with original hook
        payments,
        isLoading: isLoading || isTxPending,
        resultMessage,
        setResultMessage,
        sendPayment,
        executePaymentAction,
        fetchPayments,
        fetchUserCoins,
    };
}