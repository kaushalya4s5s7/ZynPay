import { cn } from "@/lib/utils";
import {
    Wallet,
    ArrowLeftRight,
    Users,
    Lock,
    Bot,
    ShieldCheck,
    Building,
    Award
} from "lucide-react";

export default function AboutSection() {
    const aboutInfo = {
        title: "ZynPay",
        tagline: "Web3 Native Financial Infrastructure",
        description: "ZynPay is your all-in-one financial umbrella, seamlessly blending decentralized and centralized rails into a single, turnkey ecosystem. From on-chain smart-contract payroll, streaming payments, and trustless P2P transfers, to fiat on-ramps/off-ramps, KYC/AML compliance, and AI-powered automation, ZynPay empowers businesses and individuals with the full spectrum of Web3-native and traditional finance services—secure, scalable, and future-proof."
    };

    const features = [
        {
            title: "Payroll",
            description: "Automated, gas-abstracted disbursements that work on-chain or off-chain, eliminating manual overhead and ensuring employees get paid on time in the token of their choice.",
            icon: <Wallet />,
            status: "Live"
        }
    ];

    

    return (
        <div className="bg-white dark:bg-neutral-950 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-neutral-900 dark:text-white">{aboutInfo.title}</h1>
                    <p className="text-xl md:text-2xl mb-6 text-blue-600 dark:text-blue-400">{aboutInfo.tagline}</p>
                    <p className="max-w-3xl mx-auto text-neutral-600 dark:text-neutral-300">{aboutInfo.description}</p>
                </div>

                {/* Vision Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-white">Our Vision</h2>
                    <div className="bg-neutral-50 dark:bg-neutral-900 p-8 rounded-xl shadow-sm">
                        <p className="text-lg text-neutral-700 dark:text-neutral-300 mb-6">
                            ZynPay unifies TradFi and DeFi into one Web3-native financial umbrella, offering a seamless experience for both crypto-native projects and traditional enterprises.
                        </p>
                        <p className="text-lg text-neutral-700 dark:text-neutral-300">
                            Our end-to-end vision is to provide every piece of the financial lifecycle—from on-chain asset acquisition all the way through to fiat settlements—in a single, one-click experience that feels as familiar as your favorite payment app.
                        </p>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-20">
                    <h2 className="text-3xl font-bold mb-8 text-center text-neutral-900 dark:text-white">Our Core Modules</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                        {features.map((feature, index) => (
                            <Feature key={feature.title} {...feature} index={index} />
                        ))}
                    </div>
                </div>

               

                
                
            </div>
        </div>
    );
}

const Feature = ({
    title,
    description,
    icon,
    index,
    status
}: {
    title: string;
    description: string;
    icon: React.ReactNode;
    index: number;
    status: string;
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Live":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
            case "Upcoming":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
            case "Partial":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "Planned":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
        }
    };

    return (
        <div
            className={cn(
                "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
                (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
                index < 4 && "lg:border-b dark:border-neutral-800"
            )}
        >
            {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
            )}
            <div className="flex items-center justify-between mb-4 relative z-10 px-10">
                <div className="text-neutral-600 dark:text-neutral-400">
                    {icon}
                </div>
                <div className={cn("text-xs px-2 py-1 rounded-full", getStatusColor(status))}>
                    {status}
                </div>
            </div>
            <div className="text-lg font-bold mb-2 relative z-10 px-10">
                <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {title}
                </span>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                {description}
            </p>
        </div>
    );
};

