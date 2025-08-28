"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import Head from "next/head";
import { useForm, SubmitHandler } from "react-hook-form";
import { LoginFormData, RegisterFormData } from "@/lib/interfaces";
import { useAuth } from "@/context/authContext";
import { authApi } from "@/api/authApi";
import { backendDomain } from "@/lib/network";

import { LoginForm, RegisterForm, ResetPasswordForm, ForgotPasswordForm } from "@/components/auth/Forms"
import { Home } from "lucide-react";
import Link from "next/link";
import { MONTSERRAT } from "@/lib/fonts";
import Loader from "@/components/ui/loader";
import { cn } from "@/lib/utils";

// --- Type Definitions ---
type AuthStep = "register" | "login" | "forgotPassword" | "resetPasswordOtp";
type ForgotPasswordFormData = { email: string };
type ResetPasswordFormData = { otp: string; password: string; confirmPassword: string };

// Create a new component to handle search params
const SearchParamsProvider = ({
    onModeChange
}: {
    onModeChange: (mode: string) => void
}) => {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode') || 'default';

    // Effect to pass the mode up to parent when it changes
    useEffect(() => {
        onModeChange(mode);
    }, [mode, onModeChange]);

    return null; // This component doesn't render anything
};

const AuthPage: React.FC = () => {
    // Remove direct useSearchParams usage
    // const searchParams = useSearchParams();
    // const mode = searchParams.get('mode') || 'default';

    const [mode, setMode] = useState<string>('default');
    const [authStep, setAuthStep] = useState<AuthStep>("register");
    const [isLoading, setIsLoading] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [userEmailForOtp, setUserEmailForOtp] = useState<string | null>(null);

    const { login, register: registerUser } = useAuth();
    const videoRef = useRef<HTMLVideoElement>(null);

    // Form Hooks
    const registerForm = useForm<RegisterFormData>();
    const loginForm = useForm<LoginFormData>();
    const forgotPasswordForm = useForm<ForgotPasswordFormData>();
    const resetPasswordForm = useForm<ResetPasswordFormData>();

    // Submit Handlers
    const onRegisterSubmit: SubmitHandler<RegisterFormData> = async (data) => {
        setIsLoading(true);
        setApiError(null);
        setSuccessMessage(null);
        try {
            const result = await registerUser({ ...data, authMode: mode });
            if (result.success) {
                setSuccessMessage("Registration successful! Please log in.");
                registerForm.reset();
                setAuthStep("login");
            } else {
                setApiError(result.error || "Registration failed");
            }
        } catch (error: any) {
            setApiError(error.response?.data?.message || "An unexpected error occurred during registration.");
        } finally {
            setIsLoading(false);
        }
    };

    const onLoginSubmit: SubmitHandler<LoginFormData> = async (data) => {
        setIsLoading(true);
        setApiError(null);
        setSuccessMessage(null);
        try {
            const result = await login({ ...data, authMode: mode });
            if (result.success) {
                console.log("Login successful");
                setSuccessMessage("Login successful! Redirecting...");
                loginForm.reset();
            } else {
                setApiError(result.error || "Login failed. Check your credentials.");
            }
        } catch (error: any) {
            setApiError(error.response?.data?.message || "An unexpected error occurred during login.");
        } finally {
            setIsLoading(false);
        }
    };

    const onForgotPasswordSubmitHandler: SubmitHandler<ForgotPasswordFormData> = async (data) => {
        setIsLoading(true);
        setApiError(null);
        setSuccessMessage(null);
        try {
            await authApi.forgotPassword(data.email);
            setUserEmailForOtp(data.email);
            setSuccessMessage(`OTP sent to ${data.email}. Check your inbox.`);
            setAuthStep("resetPasswordOtp");
            forgotPasswordForm.reset();
        } catch (error: any) {
            setApiError(error.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onResetPasswordSubmitHandler: SubmitHandler<ResetPasswordFormData> = async (data) => {
        setIsLoading(true);
        setApiError(null);
        setSuccessMessage(null);
        try {
            const payload = { ...data, email: userEmailForOtp };
            const response = await fetch(`${backendDomain}/auth/resetPassword/otp`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const result = await response.json();

            if (response.ok) {
                setSuccessMessage("Password reset successfully. You can now log in.");
                resetPasswordForm.reset();
                setUserEmailForOtp(null);
                setAuthStep("login");
            } else {
                setApiError(result.message || "Failed to reset password. Invalid OTP or other issue.");
            }
        } catch (error) {
            setApiError("An error occurred while resetting the password.");
        } finally {
            setIsLoading(false);
        }
    };

    // Effect to clear messages on step change
    useEffect(() => {
        setApiError(null);
        setSuccessMessage(null);
    }, [authStep]);

    // Effect to handle video loading
    useEffect(() => {
        const videoElement = videoRef.current;
        if (!videoElement) return;

        const handleVideoReady = () => {
            console.log("Video can play now.");
            setIsVideoReady(true);
        };

        if (videoElement.readyState >= 3) {
            handleVideoReady();
        } else {
            videoElement.addEventListener('canplay', handleVideoReady);
        }

        return () => {
            if (videoElement) {
                videoElement.removeEventListener('canplay', handleVideoReady);
            }
        };
    }, []);

    // Render the correct form based on authStep
    const renderFormContent = () => {
        const commonProps = {
            isLoading,
            apiError,
            successMessage,
            setAuthStep,
            mode,
        };

        switch (authStep) {
            case "register":
                return <RegisterForm formMethods={registerForm} onSubmit={onRegisterSubmit} {...commonProps} />;
            case "login":
                return <LoginForm formMethods={loginForm} onSubmit={onLoginSubmit} {...commonProps} />;
            case "forgotPassword":
                return <ForgotPasswordForm formMethods={forgotPasswordForm} onSubmit={onForgotPasswordSubmitHandler} {...commonProps} />;
            case "resetPasswordOtp":
                return <ResetPasswordForm formMethods={resetPasswordForm} onSubmit={onResetPasswordSubmitHandler} userEmailForOtp={userEmailForOtp} {...commonProps} />;
            default:
                return null;
        }
    };

    
    return (
        <>
            <Head>
                <link rel="preload" href="/auth.mp4" as="video" type="video/mp4" />
                <title>Authentication</title>
            </Head>
            <Suspense fallback={null}>
                <SearchParamsProvider onModeChange={setMode} />
            </Suspense>
            {/* Full-page background layers */}
            <div className="fixed inset-0 z-0">
                <div
                    className="absolute inset-0 bg-white dark:bg-black"
                />
                <div
                    className={
                        cn(
                            "absolute inset-0",
                            "[background-size:40px_40px]",
                            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
                        )
                    }
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" style={{zIndex:2}} />
            </div>
            <div className="absolute z-50 top-4 right-4">
                <Link href="/">
                    <Home className="text-black dark:hover:text-gray-200 hover:text-gray-800 dark:text-white" size={30} />
                </Link>
            </div>
            <main className="relative min-h-screen flex items-center justify-center z-10">
                <div className="flex relative items-center justify-center p-4 w-full">
                    <div className="relative z-100 w-full max-w-xl rounded-lg">
                        {renderFormContent()}
                    </div>
                </div>
            </main>
        </>
    );
};

export default AuthPage;
