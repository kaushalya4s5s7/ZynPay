"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import QuickActions from "./QuickActions";
import { Settings, LogOut, ClipboardList } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/authContext";
import TransactionsLog from "./TransactionsLog"; // Assuming TransactionsLog is defined elsewhere
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PaymentsSidebarProps {
    onConfigurePayments: () => void;
    onAddEmployee: () => void;
    onBulkUpload: () => void;
}

const PaymentSidebar: React.FC<PaymentsSidebarProps> = ({
    onConfigurePayments,
    onAddEmployee,
    onBulkUpload,
}) => {
    const [showLogs, setShowLogs] = useState(false); // You might need to implement the logs modal
    const { user,logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [open, setOpen] = useState(false);

    return (
        <div
      className={cn(
        "z-20 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
         // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >

            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className={`justify-between bg-black-500 gap-10 ${open ? '' : 'items-center px-2'}`}>
                    <div className={`flex flex-1 flex-col overflow-y-auto ${open ? '' : 'items-center'} ${open ? '' : 'w-[60px] min-w-[60px] max-w-[60px]'}`}>
                        {open ? <Logo /> : <LogoIcon />}

                        <div className={`mt-8 flex flex-col gap-2 relative z-30 ${open ? '' : 'items-center'}`}>
                            {/* Make QuickActions dropdown always render above sidebar with z-50 and right alignment */}
                            <div className={`relative z-50 ${open ? '' : 'hidden'}`}>
                                <QuickActions
                                    onAddEmployee={onAddEmployee}
                                    onBulkUpload={onBulkUpload}
                                />
                            </div>
                            {/* Logs Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowLogs(true)}
                                className={`flex items-center ${open ? 'justify-start w-full py-2 px-3' : 'justify-center w-[44px] h-[44px] p-0'} gap-2 relative rounded-lg backdrop-blur-md bg-gray-200/30 border border-gray-300/50 shadow-md hover:shadow-lg transition-all duration-300`}
                                title="Transaction Logs"
                            >
                                <ClipboardList className="h-5 w-5 text-white" />
                                {open && <span className="font-medium text-sm whitespace-nowrap text-white">Logs</span>}
                            </motion.button>
                            {/* Configure Payments Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onConfigurePayments}
                                className={`flex items-center ${open ? 'justify-start w-full py-2 px-3' : 'justify-center w-[44px] h-[44px] p-0'} gap-2 relative rounded-lg backdrop-blur-md bg-gray-200/30 border border-gray-300/50 shadow-md hover:shadow-lg transition-all duration-300`}
                                title="Configure Payments"
                            >
                                <Settings className="h-5 w-5 text-white" />
                                {open && <span className="font-medium text-sm whitespace-nowrap text-white">Configure</span>}
                            </motion.button>
                            {/* Logout Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowLogoutModal(true)}
                                className={`flex items-center ${open ? 'justify-start w-full py-2 px-3' : 'justify-center w-[44px] h-[44px] p-0'} gap-2 relative text-white rounded-lg backdrop-blur-md bg-blue-500 border border-blue-400 shadow-md hover:shadow-lg transition-all`}
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5 text-white" />
                                {open && <span className="font-medium text-sm whitespace-nowrap text-white">Logout</span>}
                            </motion.button>
                        </div>
                    </div>
                      <TransactionsLog
        isOpen={showLogs}
        onClose={() => setShowLogs(false)}
      />

                    
<span className={`tracking-wider flex items-center ${open ? '' : 'justify-center px-2'}`}>
            {open ? (
                <h2 className="text-white font-semibold text-base tracking-wider flex items-center gap-2">Welcome, {user?.company || "ZynPay Dashboard"}</h2>
            ) : (
                <LogoIcon />
            )}
        </span>
                </SidebarBody>
            </Sidebar>

            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="dark:bg-[#1A1F2E] bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl border dark:border-gray-700 border-gray-300">
                        <h3 className="text-xl font-medium dark:text-white text-black mb-4">Confirm Logout</h3>
                        <p className="dark:text-gray-300 text-gray-600 mb-6">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md text-black dark:text-white transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={logout} // This button now calls the logout function
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export const Logo = () => (
    <a
        href="#"
        className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
        <img src="/ZynPay_without_bg.png" alt="ZynPay Logo" className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm" />
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-medium whitespace-pre text-black dark:text-white"
        >
            ZynPay
        </motion.span>
    </a>
);

export const LogoIcon = () => (
    <a
        href="ZynPay.png"
        className="relative z-20 flex items-center justify-center py-1 text-sm font-normal text-black"
    >
        <img src="/ZynPay_without_bg.png" alt="ZynPay Logo" className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm" />
    </a>
);

export default PaymentSidebar;