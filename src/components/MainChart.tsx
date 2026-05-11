import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical, Loader2 } from 'lucide-react';
import { useGetDashboardStatsQuery } from '../services/productApi';

const formatNumber = (num: number) => {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
};

const MainChart = () => {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  // 🔥 FIX 1: SQL se aaye data ko dhyan se Number mein convert karna
  const dynamicChartData = Array.isArray(stats?.chartData) 
    ? stats.chartData.map((item: any) => ({
        name: item.name,
        value: Number(item.value) || 0 // String ko Number mein convert kiya
      }))
    : [];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-800 font-semibold">Weekly Sales Report</h3>
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 rounded-lg p-1 flex text-xs font-medium">
            <button className="px-3 py-1 bg-white rounded shadow-sm text-green-600">This week</button>
            <button className="px-3 py-1 text-gray-500">Last week</button>
          </div>
          <MoreVertical size={18} className="text-gray-400 cursor-pointer" />
        </div>
      </div>

      <div className="flex gap-8 border-b border-gray-100 pb-4 mb-6">
         <div>
            <p className="text-xl font-bold text-gray-800">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : formatNumber(stats?.customers || 0)}
            </p>
            <p className="text-xs text-green-500 font-medium">Customers</p>
         </div>
         <div>
            <p className="text-xl font-bold text-gray-800">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : formatNumber(stats?.totalProducts || 0)}
            </p>
            <p className="text-xs text-gray-400 font-medium">Total Products</p>
         </div>
         <div>
            <p className="text-xl font-bold text-gray-800">
                {isLoading ? <Loader2 size={16} className="animate-spin" /> : formatNumber(stats?.stockProducts || 0)}
            </p>
            <p className="text-xs text-gray-400 font-medium">Stock Products</p>
         </div>
      </div>

      <div className="flex-1 min-h-[250px]">
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin text-green-500" size={32} />
            </div>
        ) : dynamicChartData.length === 0 ? (
            // 🔥 Agar DB me 7 din ka koi order nahi hai, toh ye message dikhega
            <div className="flex justify-center items-center h-full text-gray-400 text-sm font-medium">
                No sales data found for the last 7 days.
            </div>
        ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#9ca3af' }} 
                    dy={10} 
                    tickFormatter={(str) => str.slice(0, 3)} 
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                
                {/* 🔥 FIX 2: TS Error theek karne ke liye (value: any) kiya aur Number() lagaya */}
                <Tooltip 
                   formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Sales']}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default MainChart;