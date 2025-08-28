"use client";

import React, { useState, useEffect } from "react";
import PaymentsSidebar from "@/components/payroll/PaymentSidebar";
import ConfigurePayModal from "@/components/payroll/ConfigurePayModal";
import PaymentDashboard from "@/components/payroll/PaymentDashboard";
import AddEmployeeModal from "@/components/payroll/AddEmployeeModal";
import BulkUploadModal from "@/components/payroll/BulkUploadModal";
import { Employee, PayrollData } from "@/lib/interfaces";
import { employerApi } from "@/api/employerApi";
import { payrollApi } from "@/api/payrollApi";
import { toast } from "react-hot-toast";
import { parseUnits } from 'ethers';
import { contractMainnetAddresses as transferContract } from '@/lib/evm-tokens-mainnet';
import { allMainnetChains as chains, NATIVE_ADDRESS } from '@/lib/evm-chains-mainnet';
import { tokensPerMainnetChain as tokens } from '@/lib/evm-tokens-mainnet';
import transferAbi from '@/lib/Transfer.json';
import { erc20Abi } from 'viem';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useConfig } from 'wagmi';
import { waitForTransactionReceipt } from "@wagmi/core";
import { useReadContract } from "wagmi";
import useFullPageLoader from "@/hooks/usePageLoader";
import Loader from "@/components/ui/loader";
import { Home } from "lucide-react";
import Link from "next/link";
import { ethers } from 'ethers';

const PaymentsPage: React.FC = () => {
    // Original state
    const [showConfigurePayModal, setShowConfigurePayModal] = useState(true);
    const [exchangeRate, setExchangeRate] = useState(1);
    const [selectedTokenSymbol, setSelectedTokenSymbol] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [walletToDelete, setWalletToDelete] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState<string>('');

    // Lifted state from PaymentDashboard
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [txError, setTxError] = useState('');
    const [needsApproval, setNeedsApproval] = useState(false);
    const [isApproving, setIsApproving] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [approvalTxHash, setApprovalTxHash] = useState<`0x${string}` | undefined>(undefined);
    const [showPaymentStatus, setShowPaymentStatus] = useState(false);
    const [selectedChain, setSelectedChain] = useState(chains[0]);
    const [selectedToken, setSelectedToken] = useState(tokens[chains[0].id][0]);
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

    // Get transfer contract address for current chain
    const getTransferContract = () => {
        return transferContract[selectedChain.id];
    };
    // Wallet and transaction hooks
    const { address, isConnected, chainId } = useAccount();
    const config = useConfig();
    const { writeContractAsync, isPending: isWritePending, data: wagmiTxHash } = useWriteContract();
    const { isLoading: isTxLoading, isSuccess: isTxSuccess, isError: isTxErrorStatus } =
        useWaitForTransactionReceipt({ hash: wagmiTxHash });

    // State for Morph chain transaction hash
    const [MorphTxHash, setMorphTxHash] = useState<`0x${string}` | undefined>(undefined);


    useEffect(() => {
        if (wagmiTxHash) {
            setTxHash(wagmiTxHash as `0x${string}`);
        } else if (MorphTxHash) {
            setTxHash(MorphTxHash);
        }

    }, [wagmiTxHash, MorphTxHash]);

    // Derived loading state
    const isLoadingDerived = isApproving || isSending || isWritePending || isTxLoading;

    // Ethers-based allowance state
    const [ethersAllowance, setEthersAllowance] = useState<bigint | undefined>(undefined);

    // Wagmi allowance hook
    const { data: wagmiAllowance, refetch: refetchWagmiAllowance } = useReadContract({
        address: selectedToken?.address !== NATIVE_ADDRESS
            ? (selectedToken?.address as `0x${string}`)
            : undefined,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [
            address as `0x${string}`,
            getTransferContract() as `0x${string}`
        ],
        chainId: selectedChain?.id,
        query: {
            enabled: isConnected &&
                !!selectedToken &&
                !!address &&
                selectedToken?.address !== NATIVE_ADDRESS &&
                !!getTransferContract() &&
                selectedChain?.id !== 1001 // Disable for Morph chain
        }
    });

    // Combined allowance value
    const allowance = selectedChain?.id === 1001 ? ethersAllowance : wagmiAllowance;

    // Override refetchAllowance to work with both methods
    const refetchAllowance = async () => {
        if (selectedChain?.id === 1001) {
            // For Morph, manually trigger the ethers effect logic
            if (
                isConnected &&
                selectedToken?.address !== NATIVE_ADDRESS &&
                address &&
                window.ethereum
            ) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const tokenContract = new ethers.Contract(
                        selectedToken.address,
                        erc20Abi,
                        provider
                    );

                    const allowanceResult = await tokenContract.allowance(
                        address,
                        getTransferContract()
                    );

                    setEthersAllowance(BigInt(allowanceResult.toString()));
                } catch (error) {
                    console.error("Error fetching allowance with ethers:", error);
                }
            }
        } else {
            // For other chains, use the wagmi refetch
            refetchWagmiAllowance();
        }
    };

    useEffect(() => {
        fetchEmployees();

        // Fetch company name
        const fetchCompanyInfo = async () => {
            try {
                const userInfo = localStorage.getItem('user');
                if (userInfo) {
                    const { company } = JSON.parse(userInfo);
                    setCompanyName(company);
                }
            } catch (error) {
                console.error("Failed to fetch company info:", error);
            }
        };

        fetchCompanyInfo();
    }, []);

    // Effect to update chain based on connected wallet
    useEffect(() => {
        if (chainId) {
            const chain = chains.find(c => c.id === chainId);
            if (chain) {
                setSelectedChain(chain);

                if (tokens[chain.id]?.length > 0) {
                    const matchedToken = selectedTokenSymbol
                        ? tokens[chain.id].find(token => token.symbol === selectedTokenSymbol)
                        : undefined;
                    setSelectedToken(matchedToken || tokens[chain.id][0]);
                }
            }
        }
    }, [chainId, selectedTokenSymbol]);

    // Handle token symbol changes
    useEffect(() => {
        if (selectedTokenSymbol && selectedChain) {
            const chainTokens = tokens[selectedChain.id] || [];
            const matchedToken = chainTokens.find(token => token.symbol === selectedTokenSymbol);

            if (matchedToken) {
                setSelectedToken(matchedToken);
            }
        }
    }, [selectedTokenSymbol, selectedChain]);


    useEffect(() => {
        if (selectedChain?.id === 1001 && txHash && !isSending) {
            const checkEthersTxStatus = async () => {
                try {
                    if (!window.ethereum) return;

                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const receipt = await provider.getTransactionReceipt(txHash);

                    if (receipt && receipt.status === 1) {
                        setTimeout(() => {
                            setSelectedEmployees([]);
                            setTimeout(() => {
                                setShowPaymentStatus(false);
                                setApprovalTxHash(undefined);
                                setTxError('');
                                setMorphTxHash(undefined);
                            }, 5000);
                        }, 2000);
                        return;
                    } else if (receipt && receipt.status === 0) {
                        setTxError("Transaction reverted on blockchain");
                        setIsSending(false);
                        return;
                    }
                    setTimeout(checkEthersTxStatus, 3000);
                } catch (error) {
                    console.error("Error checking Morph transaction:", error);
                }
            };
            checkEthersTxStatus();
        }
    }, [selectedChain?.id, txHash, isSending, selectedEmployees.length]);

    // Effect to clear txError after 6 seconds
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (txError) {
            timer = setTimeout(() => {
                setTxError('');
            }, 6000);
        }
        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [txError]);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await employerApi.getAllEmployees();
            if (response.status == "success") {
                setEmployees(response.employees || []);
            } else {
                throw new Error(response.message || "Failed to fetch employees due to API error.");
            }
        } catch (error: any) {
            console.error("Failed to fetch employees:", error);
            const message = error?.response?.data?.message || error?.message || "An unknown error occurred";
            toast.error(`Failed to load employees: ${message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const usdToToken = (usdAmount: string) => {
        return (parseFloat(usdAmount) * exchangeRate).toFixed(6);
    };

    const calculateTotalAmount = () => {
        return employees
            .filter(emp => selectedEmployees.includes(emp.wallet))
            .reduce((sum, emp) => sum + parseFloat(emp.salary), 0);
    };

    const getRecipientsAndAmounts = () => {
        const selectedEmployeeData = employees.filter(emp => selectedEmployees.includes(emp.wallet));

        return {
            recipients: selectedEmployeeData.map(emp => emp.wallet as `0x${string}`),
            amounts: selectedEmployeeData.map(emp => {
                const tokenAmount = usdToToken(emp.salary);
                // For kaia testnet (chain 1001), we need amounts in tinybars (8 decimals)
                if (selectedChain?.id === 1001 && selectedToken.address === NATIVE_ADDRESS) {
                    return parseUnits(tokenAmount, 8); // KAIA tinybars conversion
                }
                return parseUnits(tokenAmount, selectedToken.decimals);
            })
        };
    };

    const getExplorerUrl = (txHashValue: `0x${string}` | undefined): string => {
        const explorer = selectedChain.blockExplorers?.default?.url;
        if (!explorer || !txHashValue) return '#';
        return `${explorer}/tx/${txHashValue}`;
    };

    const toggleEmployeeSelection = (employeeId: string) => {
        setSelectedEmployees(prev =>
            prev.includes(employeeId)
                ? prev.filter(id => id !== employeeId)
                : [...prev, employeeId]
        );
    };

    useEffect(() => {
        const checkEthersAllowance = async () => {
            if (
                selectedChain?.id === 1001 &&
                isConnected &&
                selectedToken?.address !== NATIVE_ADDRESS &&
                address &&
                window.ethereum
            ) {
                try {
                    const provider = new ethers.BrowserProvider(window.ethereum);
                    const tokenContract = new ethers.Contract(
                        selectedToken.address,
                        erc20Abi,
                        provider
                    );
                    const allowanceResult = await tokenContract.allowance(
                        address,
                        getTransferContract()
                    );
                    setEthersAllowance(BigInt(allowanceResult.toString()));
                } catch (error) {
                    console.error("Error fetching allowance with ethers:", error);
                    setEthersAllowance(undefined);
                }
            }
        };
        checkEthersAllowance();
    }, [selectedChain?.id, address, selectedToken, isConnected, getTransferContract]);

    useEffect(() => {
        if (
            selectedToken?.address !== NATIVE_ADDRESS &&
            allowance !== undefined &&
            selectedEmployees.length > 0
        ) {
            try {
                const totalAmount = calculateTotalAmount();
                const parsedAmount = parseUnits(usdToToken(totalAmount.toString()), selectedToken.decimals);
                setNeedsApproval(allowance < parsedAmount);
            } catch (e) {
                // Invalid amount format, ignore
            }
        } else {
            setNeedsApproval(false);
        }
    }, [allowance, selectedEmployees, selectedToken]);

    useEffect(() => {
        if (isConnected && selectedToken && address && selectedToken?.address !== NATIVE_ADDRESS) {
            refetchAllowance();
        }
    }, [selectedToken?.address, selectedChain?.id, refetchAllowance, isConnected, address, selectedToken]);

    const allEmployeesSelected = employees.length > 0 && selectedEmployees.length === employees.length;

    const toggleAllEmployees = () => {
        if (allEmployeesSelected) {
            setSelectedEmployees([]);
        } else {
            setSelectedEmployees(employees.map(emp => emp.wallet));
        }
    };

    const sendTransactionAfterApproval = async (
        transferContractAddress: string,
        recipients: `0x${string}`[],
        amounts: bigint[],
        totalAmount: bigint
    ) => {
        setIsSending(true);
        console.log('Sending final transaction...');
        try {
            const functionName = 'bulkTransfer';
            const baseArgs = [recipients, amounts];
            const args = selectedToken.address === NATIVE_ADDRESS
                ? [NATIVE_ADDRESS, ...baseArgs]
                : [selectedToken.address as `0x${string}`, ...baseArgs];
            
            const finalTxHash = await writeContractAsync({
                address: transferContractAddress as `0x${string}`,
                abi: transferAbi.abi,
                functionName,
                args,
                value: selectedToken.address === NATIVE_ADDRESS ? totalAmount : BigInt(0),
                gas: BigInt(400000),
                chainId: selectedChain.id
            });

            setTxHash(finalTxHash);
            await logPayrollTransaction(finalTxHash);
            console.log('Transaction sent successfully');
        } catch (error) {
            console.error('Error in sendTransactionAfterApproval:', error);
            throw error;
        } finally {
            setIsSending(false);
        }
    };

    const logPayrollTransaction = async (transactionHash: `0x${string}`) => {
        console.log('Logging payroll transaction with hash:', transactionHash);
        if (!transactionHash || !companyName) {
            console.error("Missing transaction hash or company name");
            return;
        }

        try {
            const selectedEmployeeData = employees.filter(emp => selectedEmployees.includes(emp.wallet));
            const totalUsdAmount = selectedEmployeeData.reduce((sum, emp) => sum + parseFloat(emp.salary), 0).toFixed(2);
            const employeePayments = selectedEmployeeData.map(emp => ({ wallet: emp.wallet, amount: emp.salary }));

            const payrollData: PayrollData = {
                company: companyName,
                employees: employeePayments,
                totalAmount: totalUsdAmount,
                tokenSymbol: selectedToken.symbol,
                transactionHash: transactionHash,
                chain: selectedChain.name
            };

            const response = await payrollApi.addPayroll(payrollData);
            if (response.status === "success") {
                toast.success("Payroll record saved successfully");
                setTxHash(undefined);
                setMorphTxHash(undefined);
                setApprovalTxHash(undefined);
            } else {
                toast.error("Failed to save payroll record");
            }
        } catch (error) {
            console.error("Error logging payroll transaction:", error);
            toast.error("Failed to save payroll record");
        }
    };

    const handleTransaction = async () => {
  setTxError('');
  setShowPaymentStatus(true);

  if (selectedEmployees.length === 0) {
    setTxError('Please select at least one employee to pay');
    return;
  }

  try {
    const transferContractAddress = getTransferContract();
    if (!transferContractAddress) {
      setTxError('No transfer contract available for this network');
      return;
    }

    const { recipients, amounts } = getRecipientsAndAmounts();
    const totalAmount = amounts.reduce((sum, amount) => sum + amount, BigInt(0));

    // ✅ Kaia Kairos Testnet Logic (Chain ID: 1001)
    if (selectedChain?.id === 1001) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // ✅ Token Approval (if not native token)
        if (selectedToken.address !== NATIVE_ADDRESS && needsApproval) {
          setIsApproving(true);
          try {
            const tokenContract = new ethers.Contract(selectedToken.address, erc20Abi, signer);
            const approvalTx = await tokenContract.approve(
              transferContractAddress,
              totalAmount,
              { gasLimit: 400_000 }
            );

            setApprovalTxHash(approvalTx.hash as `0x${string}`);

            const approvalReceipt = await provider.waitForTransaction(approvalTx.hash);
            if (approvalReceipt?.status !== 1) throw new Error('Approval transaction failed');

            setIsApproving(false);
            await refetchAllowance();
          } catch (error: any) {
            setIsApproving(false);
            setTxError(error.message || 'Approval failed');
            return;
          }
        }

        // ✅ Bulk Transfer Logic
        const contract = new ethers.Contract(transferContractAddress, transferAbi.abi, signer);
        setIsSending(true);

        try {
          const kaiaTotalAmount = parseUnits(
            (calculateTotalAmount() * exchangeRate).toFixed(18),
            18
          );

          const tx =
            selectedToken.address === NATIVE_ADDRESS
              ? await contract.bulkTransfer(
                  NATIVE_ADDRESS,
                  recipients,
                  amounts,
                  {
                    value: kaiaTotalAmount, // KAIA value in wei
                    gasLimit: 3_000_000,
                  }
                )
              : await contract.bulkTransfer(
                  selectedToken.address as `0x${string}`,
                  recipients,
                  amounts,
                  { gasLimit: 3_000_000 }
                );

          const finalTxHash = tx.hash as `0x${string}`;
          setMorphTxHash(finalTxHash);
          setTxHash(finalTxHash);
          await logPayrollTransaction(finalTxHash);
        } catch (error: any) {
          console.error('Ethers transaction error:', error);
          setTxError(error.message || 'Transaction failed');
        } finally {
          setIsSending(false);
        }
      } catch (error: any) {
        console.error('Ethers setup error:', error);
        setIsSending(false);
        setTxError(error.message || 'Transaction failed');
      }
    }

    // ✅ Default logic for other chains (Wagmi)
    else {
      if (selectedToken.address !== NATIVE_ADDRESS && needsApproval) {
        setIsApproving(true);
        try {
          const approvalHash = await writeContractAsync({
            address: selectedToken.address as `0x${string}`,
            abi: erc20Abi,
            functionName: 'approve',
            args: [transferContractAddress as `0x${string}`, totalAmount],
            chainId: selectedChain.id,
            gas: BigInt(400_000),
          });

          setApprovalTxHash(approvalHash);

          const approvalReceipt = await waitForTransactionReceipt(config, {
            chainId: selectedChain.id,
            hash: approvalHash,
          });

          if (approvalReceipt.status !== 'success') throw new Error('Approval transaction failed');

          setIsApproving(false);
          await sendTransactionAfterApproval(transferContractAddress, recipients, amounts, totalAmount);
        } catch (error: any) {
          setIsApproving(false);
          setTxError(error.message || 'Approval failed');
          return;
        }
      } else {
        await sendTransactionAfterApproval(transferContractAddress, recipients, amounts, totalAmount);
      }
    }
  } catch (error: any) {
    setIsSending(false);
    setTxError(error.message || 'Transaction failed');
  }
};


    const handleAddEmployeeClick = () => {
        setSelectedEmployee(null);
        setShowAddModal(true);
    };

    const handleBulkUploadClick = () => {
        setShowBulkUploadModal(true);
    };

    const confirmDeleteEmployee = async () => {
        if (!walletToDelete) return;
        try {
            await employerApi.deleteEmployee(walletToDelete);
            setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.wallet !== walletToDelete));
            toast.success("Employee deleted successfully");
        } catch (error: any) {
            console.error("Failed to delete employee:", error);
            const message = error?.response?.data?.message || error?.message || "An unknown error occurred";
            toast.error(`Failed to delete employee: ${message}`);
        } finally {
            setIsDeleteDialogOpen(false);
            setWalletToDelete(null);
        }
    };

    const handleEditEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
        setShowAddModal(true);
    };

    const handleAddEmployee = async (employee: Employee) => {
        try {
            const response = await employerApi.addEmployee(employee);
            if (response.status === "success") {
                await fetchEmployees();
                setShowAddModal(false);
                toast.success("Employee added successfully");
            } else {
                throw new Error(response.message || "Failed to add employee.");
            }
        } catch (error: any) {
            console.error("Failed to add employee:", error);
            const message = error?.response?.data?.message || error?.message || "An unknown error occurred";
            toast.error(`Failed to add employee: ${message}`);
        }
    };

    const handleUpdateEmployee = async (wallet: string, updatedData: Partial<Employee>) => {
        try {
            const response = await employerApi.updateEmployee(wallet, updatedData);
            if (response.status === "success") {
                await fetchEmployees();
                setShowAddModal(false);
                setSelectedEmployee(null);
                toast.success("Employee updated successfully");
            } else {
                throw new Error(response.message || "Failed to update employee.");
            }
        } catch (error: any) {
            console.error("Failed to update employee:", error);
            const message = error?.response?.data?.message || error?.message || "An unknown error occurred";
            toast.error(`Failed to update employee: ${message}`);
        }
    };

    const handleExchangeRateUpdate = (rate: number, tokenSymbol: string) => {
        setExchangeRate(rate);
        setSelectedTokenSymbol(tokenSymbol);
    };

    const hasTransactionActivity = isLoadingDerived || isTxSuccess || isTxErrorStatus || !!txError || !!approvalTxHash || !!txHash;

    return (
        <div className="flex h-screen w-screen relative bg-black">
            {/* Background Video */}
           
            <PaymentsSidebar
                onConfigurePayments={() => setShowConfigurePayModal(true)}
                onAddEmployee={handleAddEmployeeClick}
                onBulkUpload={handleBulkUploadClick}
            />

            <main className="flex-1 flex flex-col p-6 overflow-y-auto relative text-white">
                <div className="absolute top-4 right-4 z-20">
                    <Link href="/">
                        <Home className="text-white hover:text-gray-200" size={30} />
                    </Link>
                </div>
                
                <PaymentDashboard
                    exchangeRate={exchangeRate}
                    selectedTokenSymbol={selectedTokenSymbol}
                    employees={employees}
                    isConnected={isConnected}
                    selectedEmployees={selectedEmployees}
                    toggleEmployeeSelection={toggleEmployeeSelection}
                    toggleAllEmployees={toggleAllEmployees}
                    allEmployeesSelected={allEmployeesSelected}
                    handleTransaction={handleTransaction}
                    usdToToken={usdToToken}
                    isLoadingDerived={isLoadingDerived}
                    needsApproval={needsApproval}
                    isApproving={isApproving}
                    isSending={isSending}
                    isWritePending={isWritePending}
                    isTxLoading={isTxLoading}
                    isTxSuccess={isTxSuccess}
                    isTxError={isTxErrorStatus}
                    txHash={txHash}
                    txError={txError}
                    approvalTxHash={approvalTxHash}
                    showPaymentStatus={showPaymentStatus}
                    hasTransactionActivity={hasTransactionActivity}
                    getExplorerUrl={getExplorerUrl}
                    selectedToken={selectedToken}
                    handleAddEmployeeClick={handleAddEmployeeClick}
                    handleEditEmployee={handleEditEmployee}
                    deleteEmployeeById={(wallet: string) => {
                        setWalletToDelete(wallet);
                        setIsDeleteDialogOpen(true);
                    }}
                    selectedChain={selectedChain}
                    handleAutoClose={() => {
                        setShowPaymentStatus(false);
                        setApprovalTxHash(undefined);
                        setTxError('');
                        setMorphTxHash(undefined);
                        setTxHash(undefined);
                        setSelectedEmployees([]);
                    }}
                />
            </main>

            {/* Modals and Dialogs */}
            <ConfigurePayModal
                isOpen={showConfigurePayModal}
                onClose={() => setShowConfigurePayModal(false)}
                onExchangeRateUpdate={handleExchangeRateUpdate}
            />

            <AddEmployeeModal
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setSelectedEmployee(null);
                }}
                onAddEmployee={handleAddEmployee}
                onUpdateEmployee={handleUpdateEmployee}
                editEmployee={selectedEmployee}
                onUploadSuccess={() => {
                    fetchEmployees();
                    setShowBulkUploadModal(false);
                }}
            />

            <BulkUploadModal
                isOpen={showBulkUploadModal}
                onClose={() => setShowBulkUploadModal(false)}
                onUploadSuccess={() => {
                    fetchEmployees();
                    setShowBulkUploadModal(false);
                }}
            />

            {isDeleteDialogOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black text-white backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-[#1A1F2E] rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-gray-700 animate-fade-in">
                        <h3 className="text-xl font-medium text-white mb-4">Confirm Deletion</h3>
                        <p className="text-gray-300 mb-6">
                            Are you sure you want to delete this employee? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setIsDeleteDialogOpen(false);
                                    setWalletToDelete(null);
                                }}
                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteEmployee}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PaymentPageWithLoader = useFullPageLoader(PaymentsPage, <Loader />);

export default PaymentPageWithLoader;