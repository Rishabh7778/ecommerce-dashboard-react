import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { MoreVertical } from 'lucide-react';

// 🔥 DUMMY DATA (Backend API banne tak):
// Baad mein ye data aapke backend se aayega ki kis state se kitne log aaye.
const stateData = [
  { state: 'Maharashtra', code: 'MH', users: '12.5k', trend: '+15.8%', isUp: true, width: 'w-3/4' },
  { state: 'Delhi', code: 'DL', users: '8.2k', trend: '+5.2%', isUp: true, width: 'w-1/2' },
  { state: 'Karnataka', code: 'KA', users: '6.4k', trend: '-2.1%', isUp: false, width: 'w-1/3' },
  { state: 'Uttar Pradesh', code: 'UP', users: '4.1k', trend: '+12.4%', isUp: true, width: 'w-1/4' },
];

// Live users in the last few minutes (Graph ke liye)
const liveChartData = [
  { time: '10m ago', users: 120 },
  { time: '8m ago', users: 150 },
  { time: '6m ago', users: 180 },
  { time: '4m ago', users: 140 },
  { time: '2m ago', users: 210 },
  { time: 'Now', users: 250 },
];

const LiveUsersWidget = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1">Active Users (Live)</p>
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-gray-800">250</h2>
            <span className="flex items-center w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          </div>
        </div>
        <MoreVertical size={18} className="text-gray-400 cursor-pointer" />
      </div>

      <p className="text-xs text-gray-400 mb-2">Users per minute</p>

      {/* Mini Bar Chart */}
      <div className="h-16 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={liveChartData}>
            <Tooltip
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }}
            />
            <Bar dataKey="users" radius={[2, 2, 0, 0]}>
              {liveChartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === liveChartData.length - 1 ? '#3BB77E' : '#A7F3D0'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic by State Section */}
      <div className="flex justify-between text-xs text-gray-400 font-medium mb-4">
        <span>Traffic by State</span>
        <span>Users</span>
      </div>

      <div className="flex flex-col gap-4 mb-6 flex-1">
        {stateData.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3 w-32">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-100">
                {item.code}
              </div>
              <div>
                <p className="font-bold text-gray-800 leading-tight">{item.users}</p>
                <p className="text-[10px] text-gray-400 font-medium truncate w-20">{item.state}</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex-1 mx-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full bg-[#3BB77E] rounded-full ${item.width}`}></div>
            </div>

            {/* Trend Indicator */}
            <span className={`text-[11px] font-bold w-12 text-right ${item.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {item.isUp ? '↑' : '↓'} {item.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-[#3BB77E] hover:text-white hover:border-[#3BB77E] transition-all duration-300">
        View Full Map
      </button>
    </div>
  );
};

export default LiveUsersWidget;