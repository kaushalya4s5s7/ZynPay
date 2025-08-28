import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/authContext";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"], // Optional: include desired weights
});

export const metadata: Metadata = {
  title: "ZynPay",
  description: "Web3 Finance Infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className="antialiased dark:bg-black font-ibm-plex-mono">
        <AuthProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 5000,
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
