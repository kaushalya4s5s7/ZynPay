'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Clock, LucideIcon } from 'lucide-react';

type Stats = {
  totalPayments: number;
  activeUsers: number;
  volumeProcessed: number;
  avgProcessingTime: number;
};

type StatData = {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  color: string;
  bgColor: string;
  textColor: string;
};

type Activity = {
  type: string;
  location: string;
  amount: string;
  time: string;
};

export default function LiveStats(): React.JSX.Element {
  const [stats, setStats] = useState<Stats>({
    totalPayments: 1247832,
    activeUsers: 12847,
    volumeProcessed: 24789234,
    avgProcessingTime: 2.3
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        totalPayments: prev.totalPayments + Math.floor(Math.random() * 5) + 1,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        volumeProcessed: prev.volumeProcessed + Math.floor(Math.random() * 10000) + 1000,
        avgProcessingTime: 2.1 + Math.random() * 0.4
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const statsData: StatData[] = [
    {
      icon: DollarSign,
      label: "Total Payments Processed",
      value: stats.totalPayments.toLocaleString(),
      change: "+12.5%",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      icon: Users,
      label: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: "+8.2%",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      icon: TrendingUp,
      label: "Volume Processed (USD)",
      value: `$${(stats.volumeProcessed / 1_000_000).toFixed(1)}M`,
      change: "+15.7%",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700"
    },
    {
      icon: Clock,
      label: "Avg Processing Time",
      value: `${stats.avgProcessingTime.toFixed(1)}s`,
      change: "-0.3s",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
      textColor: "text-teal-700"
    }
  ];

  const activityFeed: Activity[] = [
    { type: "Payment processed", location: "🇺🇸 → 🇮🇳", amount: "$2,450", time: "2s ago" },
    { type: "Bulk payroll", location: "🇩🇪 → Multiple", amount: "$15,240", time: "5s ago" },
    { type: "Payment processed", location: "🇬🇧 → 🇵🇭", amount: "$890", time: "8s ago" },
    { type: "Contract payment", location: "🇨🇦 → 🇧🇷", amount: "$3,200", time: "12s ago" }
  ];

  return (
    <section className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm text-white font-medium">Live Network Stats</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real-time global
            <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              payroll activity
            </span>
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Watch our decentralized payroll network process thousands of payments 
            across the globe in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`text-xs font-semibold px-2 py-1 ${stat.bgColor} ${stat.textColor} rounded-full`}>
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3" />
            Live Transaction Feed
          </h3>
          <div className="space-y-4">
            {activityFeed.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <div>
                    <div className="text-white font-medium">{activity.type}</div>
                    <div className="text-sm text-gray-400">{activity.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{activity.amount}</div>
                  <div className="text-sm text-gray-400">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
