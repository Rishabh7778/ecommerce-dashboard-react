import React from 'react';
import { MoreVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  period: string;
  amount: string | number;
  trend: string;
  isPositive: boolean;
  subText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, period, amount, trend, isPositive, subText }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col justify-between h-full">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-800 font-bold text-lg">{title}</h3>
          <p className="text-gray-400 text-xs mt-1">{period}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      {/* Amount and Trend */}
      <div>
        <div className="flex items-center gap-3">
          {/* 🔥 Yahan pehle $350K hardcoded tha, ab {amount} lagaya hai */}
          <h2 className="text-4xl font-extrabold text-[#253D4E]">{amount}</h2>
          
          <div className={`flex items-center text-sm font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUp size={14} className="mr-0.5" /> : <ArrowDown size={14} className="mr-0.5" />}
            <span>{trend}</span>
          </div>
        </div>

        {/* Subtext */}
        {subText ? (
          <p className="text-gray-400 text-xs font-medium mt-3">{subText}</p>
        ) : (
          <div className="mt-3 h-4"></div> // Khali space maintain karne ke liye
        )}
      </div>

    </div>
  );
};

export default StatCard;