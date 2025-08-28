"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, ClipboardList, Menu, X as CloseIcon, Settings } from "lucide-react";
import { useAuth } from "@/context/authContext";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Token } from '@/lib/evm-tokens-mainnet-tfs';
import ConfigurePayModal from "../payroll/ConfigurePayModal";

interface PaymentsHeaderProps {
    selectedToken: Token | undefined;
    onTokenChange: (token: Token) => void;
}

const P2PHeader: React.FC<PaymentsHeaderProps> = ({
    selectedToken,
    onTokenChange,
}) => {
    const { user, logout } = useAuth();
    const { address, isConnected } = useAccount();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
    const [exchangeRate, setExchangeRate] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleMenuAction = (action: () => void) => {
        action();
        setIsMobileMenuOpen(false); // Close menu after action
    };

    // Handle exchange rate updates from the modal
    const handleExchangeRateUpdate = (rate: number, tokenSymbol: string) => {
        setExchangeRate(rate);
    };

    return (
        // Adjusted width and padding for responsiveness
        <div className="mb-6 sm:mb-8 px-4 md:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 relative">
                {/* Left Side: Title and Description */}
                <div className="w-full md:w-auto">
                    <h1 className="text-lg sm:text-2xl md:text-3xl lg:text font-bold text-black dark:text-white">
                        {user?.company || "ZynPay Dashboard"}
                    </h1>
                    <h3 className="text-md sm:text-lg md:text-xl text-black dark:text-white">
                        {user?.email || "Email"}
                    </h3>
                    <p className="text-sm hidden sm:block sm:text-base md:text-lg text-gray-600 dark:text-gray-300 mt-1">
                        Secure and recoverable | P2P | Invoice | Subscriptions | Split Bills | payments
                    </p>
                </div>

                {/* Right Side: Actions (Desktop) */}
                <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                    {/* RainbowKit ConnectButton */}
                    <ConnectButton />

                    {/* Configure Payments Button */}
                    {isConnected && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsConfigureModalOpen(true)}
                            className="relative text-white py-2 px-3 lg:py-2.5 lg:px-4 rounded-lg backdrop-blur-md bg-blue-500 border border-blue-400 shadow-md hover:shadow-lg
                           transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-600 hover:border-blue-500
                           flex items-center justify-center gap-2"
                            title="Configure Payments"
                        >
                            <Settings className="h-4 w-4 lg:h-5 lg:w-5" />
                            <span className="hidden lg:inline font-medium text-sm whitespace-nowrap">
                                Configure
                            </span>
                        </motion.button>
                    )}

                    {/* Logout Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowLogoutModal(true)}
                        className="relative text-white py-2 px-3 lg:py-2.5 lg:px-4 rounded-lg backdrop-blur-md bg-blue-500 border border-blue-400 shadow-md hover:shadow-lg
                       transition-all duration-300 hover:bg-gradient-to-r hover:from-indigo-400 hover:to-indigo-600 hover:border-indigo-500
                       flex items-center justify-center gap-2"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4 lg:h-5 lg:w-5" />
                        <span className="hidden lg:inline font-medium text-sm whitespace-nowrap">
                            Logout
                        </span>
                    </motion.button>
                </div>

                {/* Hamburger Menu Button (Mobile/Tablet) */}
                <div className="md:hidden absolute top-0 right-0 mt-1 mr-1">
                    <motion.button
                        ref={buttonRef}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg bg-gray-200/50 dark:bg-white/10 border border-gray-300/50 dark:border-white/20 text-black dark:text-white"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <CloseIcon className="h-5 w-5" />
                        ) : (
                            <Menu className="h-5 w-5" />
                        )}
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden absolute top-16 right-4 z-40 mt-2 w-64 origin-top-right rounded-xl bg-white dark:bg-black shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white/10 focus:outline-none backdrop-blur-lg border border-gray-200 dark:border-gray-700/50"
                    >
                        <div className="py-2 px-2 space-y-1">
                            {/* Wallet Connection (for mobile) */}
                            <div className="px-3 py-2">
                                <ConnectButton />
                            </div>

                            {/* Configure Button (for mobile) */}
                            {isConnected && (
                                <button
                                    onClick={() => handleMenuAction(() => setIsConfigureModalOpen(true))}
                                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-3 transition-colors"
                                >
                                    <Settings className="h-4 w-4" />
                                    Configure Payments
                                </button>
                            )}

                            <hr className="border-gray-200 dark:border-gray-700/50 my-1" />
                            <button
                                onClick={() => handleMenuAction(() => setShowLogoutModal(true))}
                                className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Confirmation Modal */}
            <AnimatePresence>
                {showLogoutModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/80 backdrop-blur-sm p-4"
                        onClick={() => setShowLogoutModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700/50 rounded-xl p-5 sm:p-6 w-full max-w-sm shadow-xl"
                        >
                            <h3 className="text-black dark:text-white text-lg font-semibold mb-2">
                                Confirm Logout
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">
                                Are you sure you want to logout?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="w-full sm:w-auto flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-700 text-black dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setShowLogoutModal(false);
                                    }}
                                    className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Configure Payment Modal */}
            <ConfigurePayModal
                isOpen={isConfigureModalOpen}
                onClose={() => setIsConfigureModalOpen(false)}
                onExchangeRateUpdate={handleExchangeRateUpdate}
            />
        </div>
    );
};

export default P2PHeader;