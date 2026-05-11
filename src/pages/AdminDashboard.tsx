import StatCard from '../components/StatCard';
import MainChart from '../components/MainChart';
import LiveUsersWidget from '../components/LiveUsersWidget';
import TopProductsList from '../components/TopProductsList';
import RecentOrdersTable from '../components/RecentOrdersTable';
import UserListTable from '../components/UserListTable';
import UploadImageCard from '../components/UploadImageCard';
// import AddNewProductCard from '../components/AddNewProductCard';
import { Loader2 } from 'lucide-react';

// 🔥 API Hook Import
import { useGetDashboardStatsQuery } from '../services/productApi';

const AdminDashboard = () => {
  // 🔥 API Call for Stats
  const { data: stats, isLoading } = useGetDashboardStatsQuery();

  // Helper: Exact Rupees (₹) format karne ke liye bina kisi 'K' ke
  const formatCurrency = (num: number) => {
    if (!num) return '₹0.00';
    return `₹${num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Helper: Numbers ko format karne ke liye (e.g., 1240)
  const formatNumber = (num: number) => {
    if (!num) return '0';
    return num.toLocaleString('en-IN');
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      
      {/* --- TOP SECTION: Stats & Main Chart --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Stat Cards (Takes up 4 columns) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center flex-1 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50">
              <Loader2 className="animate-spin text-green-500 w-8 h-8" />
            </div>
          ) : (
            <>
              <StatCard 
                title="Total Sales" 
                period="All Time" 
                amount={formatCurrency(stats?.totalSales)} 
                trend={`${stats?.salesTrend || 0}%`} 
                isPositive={Number(stats?.salesTrend || 0) >= 0} 
                subText={stats?.prevSales ? `Previous 7 days ${formatCurrency(stats?.prevSales)}` : ''}
              />
              <StatCard 
                title="Total Orders" 
                period="All Time" 
                amount={formatNumber(stats?.totalOrders)} 
                trend={`${stats?.ordersTrend || 0}%`} 
                isPositive={Number(stats?.ordersTrend || 0) >= 0} 
              />
            </>
          )}
        </div>

        {/* Middle/Right Col: Main Chart (Takes up 8 columns) */}
        <div className="lg:col-span-8">
           <MainChart />
        </div>

      </div>

      {/* --- MIDDLE SECTION: Orders & Widgets --- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Col: Order Table (Takes up 7 columns) */}
        <div className="xl:col-span-7 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col overflow-hidden">
            <RecentOrdersTable />
        </div>

        {/* Right Col: Widgets Area (Takes up 5 columns) */}
        <div className="xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Right Column A */}
            <div className="flex flex-col gap-6">
                <LiveUsersWidget />
                
                <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full overflow-hidden">
                   <UploadImageCard />
                </div>
            </div>

            {/* Right Column B */}
            <div className="flex flex-col gap-6">
                <TopProductsList />
            </div>

        </div>

      </div>

      {/* --- BOTTOM SECTION: Full Width User Table --- */}
      {/* 🔥 UserListTable ko nikal kar yahan full-width section mein daal diya hai */}
      <div className="w-full">
         <UserListTable />
      </div>

    </div>
  );
};

export default AdminDashboard;